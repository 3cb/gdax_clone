package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
)

func main() {
	// create Gorilla mux router
	r := mux.NewRouter()

	// list routes here

	// use negroni to serve static files
	n := negroni.New(negroni.NewStatic(http.Dir("./static/")))
	n.UseHandler(r)

	log.Fatal(http.ListenAndServe(":3000", n))
}
