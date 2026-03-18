import json 

import os

CONFIG_PATH = os.path.expanduser("~/.lanora_config.json")

def login():
    print("Lanora Login")

    email = input("enter your email : ")
    password = input("enter your password : ")


    token = "dummy_token_123"

    save_config({"token": token})

    print("Login Successful")


def save_config(data):
    with open(CONFIG_PATH, "w") as f:
        json.dump(data, f)
        