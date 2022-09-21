package src

import (
	"database/sql"
	"log"
)

func InsertChat(db *sql.DB, chatInfo ChatHistory) {

	statement, err := db.Prepare(`
		INSERT INTO chat_history (
			content,
			creator_username
		) VALUES (?, ?)
	`)
	if err != nil {
		log.Fatal(err.Error())
	}
	defer statement.Close()
	// number of variables have to be matched with INSERTed variables
	statement.Exec(chatInfo.Content, chatInfo.CreatorUsrName)
}
