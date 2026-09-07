package handlers

import (
	"backend/models"
	"encoding/json"
	"net/http"
	"github.com/golang-jwt/jwt/v5"
	"backend/middleware"
)

type CreateOfferRequest struct {
	OfferName   string  `json:"offer_name"`
	CompanyName string  `json:"company_name"`
	Salary      float64 `json:"salary"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	MaxDistance float64 `json:"max_distance"`
}

func GetOffer(w http.ResponseWriter, r *http.Request) {
	rows, err := DB.Query("SELECT id, offer_name, company_name, company_id, salary, latitude, longitude, date, max_distance FROM offers")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

	var offers []models.Offer
	for rows.Next() {
		var o models.Offer
		err := rows.Scan(&o.ID, &o.OfferName, &o.CompanyName, &o.CompanyId, &o.Salary, &o.Latitude, &o.Longitude, &o.Date, &o.MaxDistance)
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
	err = DB.QueryRow(`INSERT INTO offers (offer_name, company_name, company_id, salary, latitude, longitude, max_distance)
					   VALUES ($1, $2, $3, $4, $5, $6, $7)
					   RETURNING id`,
					   offerForm.OfferName, offerForm.CompanyName, userID, offerForm.Salary, offerForm.Latitude, offerForm.Longitude, offerForm.MaxDistance).Scan(&offerID)
	if err != nil {
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