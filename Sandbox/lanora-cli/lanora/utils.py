from lanora.config import is_logged_in

def require_auth(func):
    def wrapper(*args, **kwargs):
        if not is_logged_in():
            print("\n You are not logged in.")
            print("Run: Lanora login\n")
            return
        return func(*args, **kwargs)
    return wrapper

