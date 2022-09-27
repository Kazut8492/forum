package src

import (
	"database/sql"
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
)

func InsertUser(db *sql.DB, user User) {

	PasswordEncrypt := func(password string) (string, error) {
		hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		return string(hash), err
	}

	encryptedPass, _ := PasswordEncrypt(user.Password)
	user.Password = encryptedPass

	statement, err := db.Prepare(`
		INSERT INTO user (
			username,
			user_email,
			user_pass,
			age,
			gender,
			firstname,
			lastname
		) VALUES (?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		fmt.Println(err.Error())
		log.Fatal(1)
	}
	defer statement.Close()
	statement.Exec(
		user.Username,
		user.Email,
		user.Password,
		user.Age,
		user.Gender,
		user.FirstName,
		user.LastName,
	)
}
