package src

// import (
// 	"database/sql"
// )

// func ReadOnlineUsers(db *sql.DB) []string {
// 	userRows, err := db.Query(`
// 		SELECT username FROM online_users
// 	`)
// 	if err != nil {
// 		panic(err.Error())
// 	}
// 	defer userRows.Close()

// 	var result []string
// 	for userRows.Next() {
// 		var user string
// 		err = userRows.Scan(&user)
// 		if err != nil {
// 			panic(err.Error())
// 		}
// 		result = append(result, user)
// 	}
// 	return result
// }
