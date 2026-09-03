package handlers

import (
	"backend/models"
	"encoding/json"
	"net/http"
)

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