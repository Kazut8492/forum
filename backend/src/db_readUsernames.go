package src

import (
	"database/sql"
)

func ReadUsernames(db *sql.DB) []User {
	userRows, err := db.Query(`
		SELECT username FROM user
	`)
	if err != nil {
		panic(err.Error())
	}
	defer userRows.Close()

	var result []User
	for userRows.Next() {
		user := User{}
		err = userRows.Scan(&user.Username)
		if err != nil {
			panic(err.Error())
		}
		result = append(result, user)
	}
	return result
}
