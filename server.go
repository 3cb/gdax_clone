package main

import (
	"log"
	"net/http"

	"github.com/boltdb/bolt"
	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
)

func main() {
	// Open the my.db file in current directory
	// It will be created if it doesn't exist
	db, err := bolt.Open("my.db", 0600, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// create Gorilla mux router
	r := mux.NewRouter()

	// list routes here

	// use negroni to serve static files
	n := negroni.New(negroni.NewStatic(http.Dir("./static/")))
	n.UseHandler(r)
	log.Fatal(http.ListenAndServe(":3000", n))
}
