import os
import json

CONFIG_DIR = os.path.expanduser("~/.lanora")
CONFIG_PATH = os.path.json(CONFIG_DIR, "config.json")

def save_session(token, email=None):
    os.makedirs(CONFIG_DIR, exist_ok = True)

    data = {
        "token": token
        "user" : {
            "email": email
        }
    }

    with open(CONFIG_PATH, "w") as f:
        json.dump(data, f)

def load_session():
    if not os.path.exists(CONFIG_PATH):
        return None

    with open(CONFIG_PATH, "r") as f:
        return json.load(f)

def get_token():
    data = load_session()
    if data:
        return data.get("token")
    return None

def is_logged_in():
    return get_token() is not None


def clear_session():
    if os.path.exists(CONFIG_PATH):
        os.remove(CONFIG_PATH)
        