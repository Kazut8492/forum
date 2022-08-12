package src

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func InitiateSession(context *gin.Context, db *sql.DB, user User) {
	uuid := uuid.New()
	db.Exec("DELETE FROM session WHERE user_id = ?", user.ID)

	context.SetCookie("cookie", user.Username, 3600, "/", "localhost", false, true)

	statement, err := db.Prepare("INSERT INTO session (username ,uuid) VALUES (?, ?)")
	if err != nil {
		return
	}
	defer statement.Close()
	statement.Exec(user.Username, uuid)
}
