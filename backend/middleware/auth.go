package main

import (
	"log"
	"net/http"
)

func middlewareAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.URL.Path, "executing middlewareAuth")
		next.ServeHTTP(w, r)
		log.Println(r.URL.Path, "executing middlewareAuth again")
	})
}

func fooHandler(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL.Path, "executing fooHandler")
	w.Write([]byte("OK"))
}
