package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	//"time"

	"github.com/golang-jwt/jwt/v5"

	"lanora-backend/database"

	"golang.org/x/crypto/bcrypt"
)

// request strucute

type RegsiterRequest struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email	string `json:"email"`
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
	
	
	result, err := database.DB.Exec(
		"INSERT INTO users (email, password) VALUES ($1, $2)",
		req.Email,
		string(hashedPassword),
	)

	if err != nil {
		fmt.Println("DB ERROR:", err)
		http.Error(w, err.Error(), 400)
		return 
	}

	rows, err := result.RowsAffected()

	if err != nil {
		fmt.Println("rows error:", err)
	}

	fmt.Println("Rows inserted:", rows)

	w.Write([]byte("User registered successfully"))


}

func Login(w http.ResponseWriter, r *http.Request) {

	fmt.Println("Login API hit")

	var req LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)  //takes json and converts to struct
	if err != nil {
		http.Error(w, "invalid input", 400)
		return
	}

	var storePassword string

	err = database.DB.QueryRow("SELECT password FROM users WHERE email=$1",req.Email,).Scan(&storePassword)

	if err == sql.ErrNoRows {
		http.Error(w, "user not Found", 404)
		return 
	}else if err != nil {
		http.Error(w, "DB error", 500)
		return
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(storePassword),
		[]byte(req.Password),
	)

	if err != nil {
		http.Error(w, "invalid password", 401)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{		//jwt creation happens
		"email":req.Email,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte("secret_key"))
	if err != nil {
		http.Error(w, "token error", 500)
		return
	}

	response := map[string]string{
		"token": tokenString,
	}

	json.NewEncoder(w).Encode(response) //sends the token to CLI/Postman

}