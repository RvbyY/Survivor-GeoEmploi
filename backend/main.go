package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
    "github.com/golang-jwt/jwt/v5"
	"backend/handlers"
	"backend/middleware"
	"golang.org/x/crypto/bcrypt"
)

const (
	defaultDBHost     = "localhost"
	defaultDBPort     = 5432
	defaultDBUser     = "postgres"
	defaultDBPassword = "motdepasse123"
	defaultDBName     = "mydb"
	defaultServerPort = 8080
)

const appVersion = "0.2"

const (
	contentTypeHeader = "Content-Type"
	jsonContentType   = "application/json"
)

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
	dbHost := envString("DB_HOST", defaultDBHost)
	dbPort := envInt("DB_PORT", defaultDBPort)
	dbUser := envString("DB_USER", defaultDBUser)
	dbPassword := envString("DB_PASSWORD", defaultDBPassword)
	dbName := envString("DB_NAME", defaultDBName)
	dbSSLMode := envString("DB_SSLMODE", "disable")
	serverPort := envInt("SERVER_PORT", defaultServerPort)
	pgConnStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s", dbHost, dbPort, dbUser, dbPassword, dbName, dbSSLMode)

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
	http.HandleFunc("/candidacy", middleware.AuthCheck(handlers.GetCandidacies))
	http.HandleFunc("/candidacy/add", middleware.AuthCheck(handlers.AddCandidacy))
	http.HandleFunc("/candidacy/update", middleware.AuthCheck(handlers.UpdateCandidacy))
	http.HandleFunc("/candidacy/delete", middleware.AuthCheck(handlers.DeleteCandidacy))
	http.HandleFunc("/health", Health)
	http.HandleFunc("/auth/login", loginHandler)
	http.HandleFunc("/auth/register", registerHandler)
	fmt.Println("Server is listening on port 8080")
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", serverPort), withCORS(http.DefaultServeMux)))
}

func envString(name, fallback string) string {
	if value := os.Getenv(name); value != "" {
		return value
	}
	return fallback
}

func envInt(name string, fallback int) int {
	value, err := strconv.Atoi(os.Getenv(name))
	if err != nil || value <= 0 {
		return fallback
	}
	return value
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
	w.Header().Set(contentTypeHeader, jsonContentType)

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
	rows, err := db.Query("SELECT id, name, email, account_type, company_name FROM users")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.AccountType, &user.CompanyName)
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

	w.Header().Set(contentTypeHeader, jsonContentType)
	json.NewEncoder(w).Encode(users)
}

func addUser(w http.ResponseWriter, r *http.Request) {
	var registration struct {
		Name        string  `json:"name"`
		Email       string  `json:"email"`
		Password    string  `json:"password"`
		AccountType string  `json:"accountType"`
		CompanyName *string `json:"companyName"`
	}
	err := json.NewDecoder(r.Body).Decode(&registration)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(registration.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "could not secure password", http.StatusInternalServerError)
		return
	}

	_, err = db.Exec(
		"INSERT INTO users (name, email, password_hash, account_type, company_name) VALUES ($1, $2, $3, $4, $5)",
		registration.Name,
		registration.Email,
		string(passwordHash),
		registration.AccountType,
		registration.CompanyName,
	)
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

	var updatedUser User
	err = db.QueryRow(
		"UPDATE users SET name=$1, email=$2, company_name=$3 WHERE id=$4 RETURNING id, name, email, account_type, company_name",
		user.Name,
		user.Email,
		user.CompanyName,
		userID,
	).Scan(&updatedUser.ID, &updatedUser.Name, &updatedUser.Email, &updatedUser.AccountType, &updatedUser.CompanyName)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "user not found", http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set(contentTypeHeader, jsonContentType)
	json.NewEncoder(w).Encode(updatedUser)
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

	var user User

	rows, err := db.Query(
		"SELECT id, name, email, account_type, company_name, password_hash FROM users WHERE email = $1",
		credentials.Email,
	)
	if err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	defer rows.Close()

	matched := false
	for rows.Next() {
		var passwordHash string
		var candidate User
		if err := rows.Scan(&candidate.ID, &candidate.Name, &candidate.Email,
			&candidate.AccountType, &candidate.CompanyName, &passwordHash); err != nil {
			http.Error(w, "could not read account", http.StatusInternalServerError)
			return
		}
		if bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(credentials.Password)) == nil {
			user = candidate
			matched = true
			break
		}
	}
	if err := rows.Err(); err != nil {
		http.Error(w, "could not read account", http.StatusInternalServerError)
		return
	}
	if !matched {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	token, err := middleware.CreateToken(user.ID, user.AccountType)
	if err != nil {
		http.Error(w, "could not create session", http.StatusInternalServerError)
		return
	}

	w.Header().Set(contentTypeHeader, jsonContentType)
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

	var emailExists bool
	if err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", registration.Email).Scan(&emailExists); err != nil {
		http.Error(w, "could not check account", http.StatusInternalServerError)
		return
	}
	if emailExists {
		http.Error(w, "email already registered", http.StatusConflict)
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

	w.Header().Set(contentTypeHeader, jsonContentType)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{"user": user, "token": token})
}
