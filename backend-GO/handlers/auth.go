package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"lanora-backend/database"

	"golang.org/x/crypto/bcrypt"
)

// request strucute

type RegsiterRequest struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

func Register(w http.ResponseWriter, r *http.Request) {

	fmt.Println("register API hit")

	var req RegsiterRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
	fmt.Println("Decode error:", err)
	http.Error(w, "Invalid JSON", 400)
	return
}

	//hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 10)
	if err != nil {
		http.Error(w, "Error hashing password", 500)
		return 
	}

	// insert into DB
	_, err = database.DB.Exec(
		"INSERT INTO users (email, password) VALUES ($1, $2)",
		req.Email,
		string(hashedPassword),
	)

	if err != nil {
		http.Error(w, "user already exists", 400)
		return 
	}

	w.Write([]byte("User registered successfully"))


}