package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	// create Gorilla mux router
	r := mux.NewRouter()

	// serve static files
	r.Handle("/", http.FileServer(http.Dir("./static/")))
	r.PathPrefix("/dist/").Handler(http.FileServer(http.Dir("./static/")))

	log.Fatal(http.ListenAndServe(":3000", r))
}
