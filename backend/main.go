package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	_ "github.com/lib/pq"
	"backend/handlers"
	"backend/middleware"

	"golang.org/x/crypto/bcrypt"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "motdepasse123"
	dbname   = "mydb"
)

const appVersion = "0.2"

var db *sql.DB

type User struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Email       string  `json:"email"`
	AccountType string  `json:"accountType"`
	CompanyName *string `json:"companyName"`
}

type HealthResponse struct {
	Status   string `json:"status"`
	Version  string `json:"version"`
	Database string `json:"database"`
}

func main() {
	pgConnStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	conn, err := sql.Open("postgres", pgConnStr)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}
	db = conn
	handlers.DB = conn
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatalf("Error connecting to the database: %v", err)
	}
	fmt.Println("Connected to the PostgreSQL database")

	http.HandleFunc("/users", getUsers)
	http.HandleFunc("/users/add", addUser)
	http.HandleFunc("/users/update", middleware.AuthCheck(updateUser))
	http.HandleFunc("/users/delete", middleware.AuthCheck(deleteUser))
	http.HandleFunc("/offer/get", handlers.GetOffer)
	http.HandleFunc("/offer/add", middleware.AuthCheck(handlers.AddOffer))
	http.HandleFunc("/offer/delete/{id}", middleware.AuthCheck(handlers.DeleteOffer))
	http.HandleFunc("/offer/report/{id}", middleware.AuthCheck(handlers.ReportsOffer))
	http.HandleFunc("/health", Health)
	http.HandleFunc("/auth/login", loginHandler)
	http.HandleFunc("/auth/register", registerHandler)
	fmt.Println("Server is listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", withCORS(http.DefaultServeMux)))
    fmt.Println("Server is listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func Health(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 150*time.Millisecond)
	defer cancel()

	dbStatus := "up"
	err := db.PingContext(ctx)
	if err != nil {
		dbStatus = "down"
	}
	overallStatus := "ok"
	if dbStatus == "down" {
		overallStatus = "degraded"
	}
	w.Header().Set("Content-Type", "application/json")

	if overallStatus != "ok" {
		w.WriteHeader(http.StatusServiceUnavailable)
	} else {
		w.WriteHeader(http.StatusOK)
	}
	json.NewEncoder(w).Encode(HealthResponse{
		Status:   overallStatus,
		Version:  appVersion,
		Database: dbStatus,
	})
}

func getUsers(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, name, email FROM users")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Name, &user.Email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func addUser(w http.ResponseWriter, r *http.Request) {
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	_, err = db.Exec("INSERT INTO users (name, email) VALUES ($1, $2)", user.Name, user.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "User added successfully")
}

func updateUser(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.ClaimsKey).(jwt.MapClaims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}
	userID := int(userIDFloat)

	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := db.Exec("UPDATE users SET name=$1, email=$2 WHERE id=$3", user.Name, user.Email, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	fmt.Fprint(w, "User updated successfully")
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.ClaimsKey).(jwt.MapClaims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}

	userID := int(userIDFloat)
	result, err := db.Exec("DELETE FROM users WHERE id=$1", userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	fmt.Fprintf(w, "User deleted successfully")
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	var passwordHash string
	var user User

	err := db.QueryRow(
		"SELECT id, name, email, account_type, company_name, password_hash FROM users WHERE email = $1",
		credentials.Email,
	).Scan(&user.ID, &user.Name, &user.Email,
		&user.AccountType, &user.CompanyName, &passwordHash)

	if err != nil || bcrypt.CompareHashAndPassword(
		[]byte(passwordHash),
		[]byte(credentials.Password),
	) != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	token, err := middleware.CreateToken(user.ID, user.AccountType)
	if err != nil {
		http.Error(w, "could not create session", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"user":  user,
		"token": token,
	})
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	var registration struct {
		Name        string `json:"name"`
		Email       string `json:"email"`
		Password    string `json:"password"`
		AccountType string `json:"accountType"`
		CompanyName string `json:"companyName"`
	}

	if err := json.NewDecoder(r.Body).Decode(&registration); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(registration.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "could not secure password", http.StatusInternalServerError)
		return
	}

	var user User
	err = db.QueryRow(
		`INSERT INTO users (name, email, password_hash, account_type, company_name)
		VALUES ($1, $2, $3, $4, NULLIF($5, ''))
		RETURNING id, name, email, account_type, company_name`,
		registration.Name,
		registration.Email,
		string(passwordHash),
		registration.AccountType,
		registration.CompanyName,
	).Scan(&user.ID, &user.Name, &user.Email, &user.AccountType, &user.CompanyName)
	if err != nil {
		http.Error(w, "could not create account",
			http.StatusConflict)
		return
	}
	token, err := middleware.CreateToken(user.ID, user.AccountType)
	if err != nil {
		http.Error(w, "could not create session", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{"user": user, "token": token})
}
