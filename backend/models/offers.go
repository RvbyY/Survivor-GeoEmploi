package models

import "time"

type Offer struct {
	ID 			  int       `json:"id"`
	OfferName     string    `json:"offer_name"`
	Description   string    `json:"description"`
	Address       string    `json:"address"`
	CompanyName   string    `json:"company_name"`
	CompanyId 	  int       `json:"company_id"`
	Salary        float64   `json:"salaire"`
	Latitude      float64   `json:"latitude"`
	Longitude     float64   `json:"longitude"`
	Date 		  time.Time `json:"date"`
	MaxDistance   float64   `json:"max_distance"`
}