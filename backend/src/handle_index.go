package src

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func PasswordEncrypt(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hash), err
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	// if r.URL.Path != "/" {
	// 	w.WriteHeader(404)
	// 	return
	// }
	db, err := sql.Open("sqlite3", "./example.db")
	if err != nil {
		w.WriteHeader(500)
		fmt.Println(err.Error())
		log.Fatal(1)
	}
	defer db.Close()

	if r.Method == "POST" && r.URL.Path == "/new-post" {
		// 変数を定義
		var post Post
		// デコードして変数へ値を格納する
		if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
			log.Fatal(err)
		}
		fmt.Println("Received post: ", post)
		InsertPost(db, post)
	}

	if r.Method == "POST" && r.URL.Path == "/new-comment" {
		// 変数を定義
		var comment Comment
		// デコードして変数へ値を格納する
		if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
			log.Fatal(err)
		}
		fmt.Println("Received comment: ", comment)
		InsertComment(db, comment)
	}

	if r.Method == "POST" && r.URL.Path == "/new-user" {
		var user User
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			log.Fatal(err)
		}
		fmt.Println("Received user: ", user)
		encryptedPass, err := PasswordEncrypt(user.Password)
		user.Password = encryptedPass
		if err != nil {
			log.Fatal(err)
		}
		InsertUser(db, user)
		InitiateSession(w, r, db, user)
	}

	posts := ReadPosts(db)
	js, err := json.Marshal(posts)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// fmt.Println(string(js))
	// Two lines below are important to avoid CORS error.
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	// w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}
