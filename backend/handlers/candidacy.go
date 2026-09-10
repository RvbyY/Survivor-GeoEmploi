package handlers

import (
	"backend/middleware"
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type candidacyResponse struct {
	ID        int    `json:"id"`
	ListingID int    `json:"listingId"`
	UserEmail string `json:"userEmail"`
	Status    string `json:"status"`
	CreatedAt string `json:"createdAt"`
}

func claimsFromRequest(r *http.Request) (int, string, error) {
	claims, ok := r.Context().Value(middleware.ClaimsKey).(jwt.MapClaims)
	if !ok {
		return 0, "", jwt.ErrTokenInvalidClaims
	}
	userID, ok := claims["user_id"].(float64)
	if !ok {
		return 0, "", jwt.ErrTokenInvalidClaims
	}
	accountType, _ := claims["account_type"].(string)
	return int(userID), accountType, nil
}

func GetCandidacies(w http.ResponseWriter, r *http.Request) {
	userID, accountType, err := claimsFromRequest(r)
	if err != nil {
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}

	query := `
		SELECT c.id, c.offer_id, u.email, c.status, c.created_at
		FROM candidacy c
		JOIN users u ON u.id = c.candidate_id`
	var args []interface{}
	if accountType == "admin" {
		query += " ORDER BY c.created_at DESC"
	} else if accountType == "employer" {
		query += " JOIN offers o ON o.id = c.offer_id WHERE o.company_id = $1 ORDER BY c.created_at DESC"
		args = append(args, userID)
	} else {
		query += " WHERE c.candidate_id = $1 ORDER BY c.created_at DESC"
		args = append(args, userID)
	}

	rows, err := DB.Query(query, args...)
	if err != nil {
		http.Error(w, "could not load applications", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	applications := []candidacyResponse{}
	for rows.Next() {
		var application candidacyResponse
		var createdAt time.Time
		if err := rows.Scan(&application.ID, &application.ListingID, &application.UserEmail, &application.Status, &createdAt); err != nil {
			http.Error(w, "could not read applications", http.StatusInternalServerError)
			return
		}
		application.CreatedAt = createdAt.UTC().Format(time.RFC3339)
		applications = append(applications, application)
	}
	if err := rows.Err(); err != nil {
		http.Error(w, "could not read applications", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(applications)
}

func AddCandidacy(w http.ResponseWriter, r *http.Request) {
	userID, accountType, err := claimsFromRequest(r)
	if err != nil || accountType != "jobseeker" {
		http.Error(w, "only candidates can apply", http.StatusForbidden)
		return
	}

	var request struct {
		ListingID int `json:"listingId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil || request.ListingID == 0 {
		http.Error(w, "invalid application", http.StatusBadRequest)
		return
	}

	var id int
	err = DB.QueryRow(
		`INSERT INTO candidacy (offer_id, candidate_id) VALUES ($1, $2)
		 ON CONFLICT (offer_id, candidate_id) DO NOTHING RETURNING id`,
		request.ListingID, userID,
	).Scan(&id)
	if err == sql.ErrNoRows {
		http.Error(w, "already applied", http.StatusConflict)
		return
	}
	if err != nil {
		http.Error(w, "could not create application", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]int{"id": id})
}

func UpdateCandidacy(w http.ResponseWriter, r *http.Request) {
	_, accountType, err := claimsFromRequest(r)
	if err != nil || accountType != "admin" {
		http.Error(w, "only administrators can update applications", http.StatusForbidden)
		return
	}

	var request struct {
		ID     int    `json:"id"`
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "invalid application", http.StatusBadRequest)
		return
	}
	if request.Status != "pending" && request.Status != "accepted" && request.Status != "rejected" {
		http.Error(w, "invalid status", http.StatusBadRequest)
		return
	}

	result, err := DB.Exec("UPDATE candidacy SET status=$1 WHERE id=$2", request.Status, request.ID)
	if err != nil {
		http.Error(w, "could not update application", http.StatusInternalServerError)
		return
	}
	count, _ := result.RowsAffected()
	if count == 0 {
		http.Error(w, "application not found", http.StatusNotFound)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func DeleteCandidacy(w http.ResponseWriter, r *http.Request) {
	userID, accountType, err := claimsFromRequest(r)
	if err != nil {
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}

	id, err := strconv.Atoi(r.URL.Query().Get("id"))
	if err != nil {
		http.Error(w, "invalid application id", http.StatusBadRequest)
		return
	}

	query := "DELETE FROM candidacy WHERE id=$1"
	args := []interface{}{id}
	if accountType != "admin" {
		query = `DELETE FROM candidacy c USING offers o WHERE c.id=$1 AND (c.candidate_id=$2 OR o.id=c.offer_id AND o.company_id=$2)`
		args = []interface{}{id, userID}
	}
	result, err := DB.Exec(query, args...)
	if err != nil {
		http.Error(w, "could not delete application", http.StatusInternalServerError)
		return
	}
	count, _ := result.RowsAffected()
	if count == 0 {
		http.Error(w, "application not found", http.StatusNotFound)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
