package handlers

import (
	"backend/middleware"
	"backend/models"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
)

type CreateOfferRequest struct {
	OfferName   string  `json:"offer_name"`
	Description string  `json:"description"`
	Address     string  `json:"address"`
	CompanyName string  `json:"company_name"`
	Salary      float64 `json:"salary"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	MaxDistance float64 `json:"max_distance"`
}

type ReportOfferRequest struct {
	ReportReason string `json:"report_reason"`
}

func GetOffer(w http.ResponseWriter, r *http.Request) {
	rows, err := DB.Query("SELECT id, offer_name, description, address, company_name, company_id, salary, latitude, longitude, date, max_distance FROM offers")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var offers []models.Offer
	for rows.Next() {
		var o models.Offer
		err := rows.Scan(&o.ID, &o.OfferName, &o.Description, &o.Address, &o.CompanyName, &o.CompanyId, &o.Salary, &o.Latitude, &o.Longitude, &o.Date, &o.MaxDistance)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		offers = append(offers, o)
	}
	json.NewEncoder(w).Encode(offers)
}

func AddOffer(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.ClaimsKey).(jwt.MapClaims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	userID := int(userIDFloat)
	var exists bool
	err := DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)`, userID).Scan(&exists)
	if err != nil {
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	if !exists {
		http.Error(w, "Account not found", http.StatusForbidden)
		return
	}

	var offerForm CreateOfferRequest
	err = json.NewDecoder(r.Body).Decode(&offerForm)
	if err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	var offerID int
	err = DB.QueryRow(`INSERT INTO offers (offer_name, description, address, company_name, company_id, salary, latitude, longitude, max_distance)
					   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
					   RETURNING id`,
		offerForm.OfferName, offerForm.Description, offerForm.Address, offerForm.CompanyName, userID, offerForm.Salary, offerForm.Latitude, offerForm.Longitude, offerForm.MaxDistance).Scan(&offerID)
	if err != nil {
		fmt.Println("DEBUG erreur insertion:", err)
		http.Error(w, "Offer creation failed", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":      offerID,
		"message": "Offre créée avec succès",
	})
}

func DeleteOffer(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.ClaimsKey).(jwt.MapClaims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}
	userID := int(userIDFloat)

	offerIDStr := r.PathValue("id")
	offerID, err := strconv.Atoi(offerIDStr)
	if err != nil {
		http.Error(w, "invalid offer id", http.StatusBadRequest)
		return
	}

	result, err := DB.Exec(`DELETE FROM offers WHERE id = $1 AND company_id = $2`, offerID, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "offer not found or not yours", http.StatusForbidden)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func ReportsOffer(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.ClaimsKey).(jwt.MapClaims)
	fmt.Println("coucou")
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}
	userID := int(userIDFloat)

	var exists bool
	err := DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)`, userID).Scan(&exists)
	if err != nil {
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	if !exists {
		http.Error(w, "Account not found", http.StatusForbidden)
		return
	}

	offerIDStr := r.PathValue("id")
	offerID, err := strconv.Atoi(offerIDStr)
	if err != nil {
		http.Error(w, "invalid offer id", http.StatusBadRequest)
		return
	}

	var offerExists bool
	err = DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM offers WHERE id = $1)`, offerID).Scan(&offerExists)
	if err != nil {
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	if !offerExists {
		http.Error(w, "Offer not found", http.StatusNotFound)
		return
	}

	var req ReportOfferRequest
	err = json.NewDecoder(r.Body).Decode(&req);
	if err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	var reportID int
	err = DB.QueryRow(`
		INSERT INTO reports (offer_id, candidate_id, reason)
		VALUES ($1, $2, $3)
		RETURNING id
	`, offerID, userID, req.ReportReason).Scan(&reportID)

	if err != nil {
		fmt.Println("DEBUG erreur report:", err)
		http.Error(w, "report creation failed", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":      reportID,
		"message": "offer reported successfully",
	})
}
