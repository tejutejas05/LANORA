import os

def run_test():
    print(" Running Lanora Test...")

    # Check if main.py exists
    if not os.path.exists("main.py"):
        print(" Error: main.py not found in current directory")
        return

    print("Found main.py")

    # Simulate execution
    print(" Executing agent...")
    os.system("python main.py")

    print("Test completed!")