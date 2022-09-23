package src

import (
	"database/sql"
	"log"
)

func InsertChat(db *sql.DB, chatInfo Message) {

	statement, err := db.Prepare(`
		INSERT INTO chat_history (
			type,
			body,
			creator_username
		) VALUES (?, ?, ?)
	`)
	if err != nil {
		log.Fatal(err.Error())
	}
	defer statement.Close()
	// number of variables have to be matched with INSERTed variables
	statement.Exec(chatInfo.Type, chatInfo.Body, chatInfo.CreatorUsrName)
}
