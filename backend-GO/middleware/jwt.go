package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

var SECRET_KEY = []byte("secret_key")

func VerifyJWT(next http.HandlerFunc) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")

		fmt.Println("HEADER:", authHeader)

		if authHeader == "" {

			http.Error(
				w,
				"Missing token",
				http.StatusUnauthorized,
			)

			return
		}

		//----------------------------------
		// Expect:
		// Authorization: Bearer TOKEN
		//----------------------------------

		parts := strings.Split(authHeader, " ")

		if len(parts) != 2 || parts[0] != "Bearer" {

			http.Error(
				w,
				"Invalid token format",
				http.StatusUnauthorized,
			)

			return
		}

		tokenString := parts[1]

		fmt.Println("TOKEN:", tokenString)

		//----------------------------------
		// Parse JWT
		//----------------------------------

		token, err := jwt.Parse(
			tokenString,

			func(token *jwt.Token) (
				interface{},
				error,
			) {

				// Verify expected signing method
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {

					return nil,
						fmt.Errorf(
							"unexpected signing method: %v",
							token.Header["alg"],
						)
				}

				return SECRET_KEY, nil
			},
		)

		//----------------------------------
		// Replace generic error block
		//----------------------------------

		if err != nil {

			fmt.Println(
				"JWT ERROR:",
				err.Error(),
			)

			http.Error(
				w,
				err.Error(),
				http.StatusUnauthorized,
			)

			return
		}

		if !token.Valid {

			fmt.Println(
				"TOKEN INVALID",
			)

			http.Error(
				w,
				"Token invalid",
				http.StatusUnauthorized,
			)

			return
		}

		fmt.Println(
			"JWT VERIFIED SUCCESS",
		)

		//----------------------------------
		// Passed auth
		//----------------------------------

		next(w, r)
	}
}