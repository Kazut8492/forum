package src

import (
	"database/sql"
	"log"
)

func InsertChat(db *sql.DB, message Message) {

	statement, err := db.Prepare(`
		INSERT INTO chat_history (
			type,
			body,
			creator_username,
			receiver_username
		) VALUES (?, ?, ?, ?)
	`)
	if err != nil {
		log.Fatal(err.Error())
	}
	defer statement.Close()
	// number of variables have to be matched with INSERTed variables
	statement.Exec(message.Type, message.Body, message.CreatorUsrName, message.ReceiverUsrName)
}
