package main

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    _ "github.com/lib/pq"
)

const (
    host     = "localhost"
    port     = 4242
    user     = "your_username"
    password = "your_password"
    dbname   = "mydb"
)

var db *sql.DB

type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}

func main() {
    pgConnStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

    conn, err := sql.Open("postgres", pgConnStr)
    if err != nil {
        log.Fatalf("Error opening database connection: %v", err)
    }
    db = conn
    defer db.Close()

    err = db.Ping()
    if err != nil {
        log.Fatalf("Error connecting to the database: %v", err)
    }
    fmt.Println("Connected to the PostgreSQL database")

    http.HandleFunc("/users", getUsers)
    http.HandleFunc("/users/add", addUser)
    http.HandleFunc("/users/update", updateUser)
    http.HandleFunc("/users/delete", deleteUser)

    fmt.Println("Server is listening on port 8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
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
    var user User
    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    _, err = db.Exec("UPDATE users SET name=$1, email=$2 WHERE id=$3", user.Name, user.Email, user.ID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    fmt.Fprintf(w, "User updated successfully")
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Query().Get("id")
    if id == "" {
        http.Error(w, "ID parameter is required", http.StatusBadRequest)
        return
    }

    _, err := db.Exec("DELETE FROM users WHERE id=$1", id)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    fmt.Fprintf(w, "User deleted successfully")
}