import requests
import webbrowser
from lanora.config import save_session, clear_session

API_URL = "http://localhost:5000" # jev

def register():
    print("Opening the browser for the registration...")
    webbrowser.open("http://localhost:5173/register") ## Prashanth
    

def login():
   # print("Lanora Login")

    email = input("enter your email : ").strip()
    password = input("enter your password : ").strip()

    try:
        res = requests.post(f"{API_URL}/auth/login", json={
            "email": email,
            "password": password
        })

        if res.status_code != 200:
            print(f"Login Failed: {res.text}")
            return
        
        data = res.json()
        token = data.get("token")

        if not token:
            print("No token received from the server")
            return 
        
        save_session(token, email)

        print("Logged successfully")

    except requests.exceptions.ConnectionError:
        print("Cannot connect the backend. Is server running?")

    except Exception as e:
        print("error:", e)

def logout():
    clear_session()
    print("logged out")

