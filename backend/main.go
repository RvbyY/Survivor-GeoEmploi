package main

import (
	"backend/handlers"
	"backend/middleware"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
	_ "github.com/lib/pq"
    "github.com/golang-jwt/jwt/v5"
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
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
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
	http.HandleFunc("/health", Health)

    fmt.Println("Server is listening on port 8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func Health(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 150*time.Millisecond)
	defer cancel()

	dbStatus := "up"
	err := db.PingContext(ctx)
	if err != nil{
		dbStatus = "down"
	}
	overallStatus := "ok"
	if dbStatus == "down"{
		overallStatus = "degraded"
	}
	w.Header().Set("Content-Type", "application/json")

	if overallStatus != "ok"{
		w.WriteHeader(http.StatusServiceUnavailable)
	} else {
		w.WriteHeader(http.StatusOK)
	}
	json.NewEncoder(w).Encode(HealthResponse{
		Status: overallStatus,
		Version: appVersion,
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
