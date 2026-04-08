package database

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

const (
	host = "localhost"
	port = 5432
	user = "jevita"
	password = "jevita@12345"
	dbname = "lanora"
)

var DB *sql.DB

func Connect() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s " + "password=%s dbname=%s sslmode=disable",host, port,user,password, dbname)

	var err error

	DB, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	defer DB.Close()

	err = DB.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected")

}
