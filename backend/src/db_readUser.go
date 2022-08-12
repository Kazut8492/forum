package src

import (
	"database/sql"
	"fmt"
)

func ReadUser(db *sql.DB, loginUser User) User {
	statement, _ := db.Query("SELECT * FROM user WHERE username = ?", loginUser.Username)
	defer statement.Close()

	user := User{}
	for statement.Next() {
		err := statement.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Age, &user.Gender, &user.FirstName, &user.LastName)
		if err != nil {
			fmt.Println(err.Error())
			return User{}
		}
	}
	return user
}
