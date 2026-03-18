import argparse
from lanora.auth import login 
from lanora.commands.test import run_test

def main():
    parser = argparse.ArgumentParser(prog="lanora", description = "Lanora CLI")

    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("login", help="Login to Lanora") # For Login command

    subparsers.add_parser("test", help="Test your AI Agent")

    args = parser.parse_args()

    if args.command == "login":
        login()
    elif args.command == "test":
        run_test()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()

    

