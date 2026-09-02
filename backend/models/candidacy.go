package handlers

type Candidacy struct {
	ID          int `json:"id"`
	OfferId     int `json:"offer_id"`
	CandidateID int `json:"candidate_id"`
}