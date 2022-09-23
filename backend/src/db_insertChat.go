package src

import (
	"database/sql"
	"fmt"
	"log"
)

func InsertChat(db *sql.DB, chatInfo Message) {

	fmt.Println("TEST3")

	statement, err := db.Prepare(`
		INSERT INTO chat_history (
			body
		) VALUES (?)
	`)
	if err != nil {
		log.Fatal(err.Error())
	}
	defer statement.Close()
	// number of variables have to be matched with INSERTed variables
	statement.Exec(chatInfo.Body)
	fmt.Println("TEST4")
}
