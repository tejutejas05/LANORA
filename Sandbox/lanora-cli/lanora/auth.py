import requests
import webbrowser
from lanora.config import save_session, clear_session

API_URL = "http://localhost:5000" # jev

def register():
    print("Opening the browser for the registration...")
    webbrowser.open("http://localhost:5173") ## Prashanth
    

def login():
   # print("Lanora Login")

    email = input("enter your email : ")
    password = input("enter your password : ")

    try:
        res = requests.post(f"{API_URL}/auth/login", json={
            "email": email,
            "password": password
        })

        if res.status_code == 200:
            data = res.json()
            token = data.get("token")

            save_session(token, email)
            print("Logged success")

        else:
            print(" invaild details")

    except Exception as e:
        print("error:", e)

def logout():
    clear_session()
    print("logged out")

