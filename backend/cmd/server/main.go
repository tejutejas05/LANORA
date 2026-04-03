package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func run(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Running the sandbox...")
	// r.ParseMultipartForm()

}

func home(w http.ResponseWriter, r *http.Request) {
	// fmt.Fprint(w, "This is home page")
	http.ServeFile(w, r, "test_ui/html/form.html")
	// r.ParseMultipartForm()
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/", home)
	r.HandleFunc("/run", run)

	db, err := sql.Open("postgres", "host=localhost dbname=lanora user=jevita password=jevita@12345")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err = db.Ping(); err != nil {
		log.Printf("Database not connected properly %v", err)
	} else {
		fmt.Println("Database pingged")
	}

	fmt.Println("Listening on port 8080...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}
