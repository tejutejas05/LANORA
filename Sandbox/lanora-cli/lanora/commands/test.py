import os
import zipfile
import requests # for the http requests to backend
from lanora.utils import require_auth


@require_auth
def run_test(token):

    print("Running the Lanora Test.....")

    # here the path will be detected 
    project_path = os.getcwd()
    print(f"Project detected: {project_path}") # path will be displayed

    # checks the main.py in the folder structure
    main_file = os.path.join(project_path, "main.py")
    if not os.path.exists(main_file):
        print("Error: main.py not found in this directory")
        return

    # the folder name will be taken from the path to create the zipfile name 
    folder_name = os.path.basename(project_path)

    # zip name creation 
    zip_name = f"{folder_name}.zip"
    print("Creating the Zip...")

    #here it will ignore the files below mentioned
    ignore = [".git", "__pycache__", ".venv", ".env"]

    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zipf:  #write the zip file

        for root, dirs, files in os.walk(project_path):

            dirs[:] = [d for d in dirs if d not in ignore]

            #checks through the folder and make the zip
            for file in files:
                file_path = os.path.join(root,file)

                relative_path = os.path.relpath(file_path, project_path)

                arcname = os.path.join(folder_name, relative_path)

                zipf.write(file_path, arcname)

    print(f"Zip created successfully: {zip_name}")

    print("file sending to backend")

    url = "http://localhost:5000/test-agent"

    try:
        with open(zip_name, "rb") as f: # open zip file
            files = {"file": f}

            #new line code for token auth(jwt)
            headers = {
                "Authorization":f"Bearer {token}"
            }

            response = requests.post(url, files=files, headers=headers) # http request 

        print("Response from server:")
        print(response.text)
    
    # if fails this works
    except Exception as e: 
        print("Failed to connect")
        print(e)


@require_auth    
def run_deploy(token):

    print(" Deploying with Lanora...")

    # detect project path
    project_path = os.getcwd()
    print(f"Project detected: {project_path}")

    # check main.py
    main_file = os.path.join(project_path, "main.py")
    if not os.path.exists(main_file):
        print("Error: main.py not found in this directory")
        return

    folder_name = os.path.basename(project_path)
    zip_name = f"{folder_name}.zip"

    print("Creating the Zip...")

    ignore = [".git", "__pycache__", ".venv", ".env"]

    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(project_path):

            dirs[:] = [d for d in dirs if d not in ignore]

            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, project_path)

                # IMPORTANT: keep folder structure
                arcname = os.path.join(folder_name, relative_path)

                zipf.write(file_path, arcname)

    print(f"Zip created successfully: {zip_name}")
    print("Sending project to backend for deployment...")

    #  DEPLOY ENDPOINT
    url = "http://localhost:5000/deploy-agent"

    try:
        with open(zip_name, "rb") as f:
            files = {"file": f}

            headers = {
                "Authorization": f"Bearer {token}"
            }

            response = requests.post(url, files=files, headers=headers)

        print("\n Server Response:")
        print(response.text)

        #  TRY TO PARSE JSON
        try:
            data = response.json()

            if data.get("status") == "deployed":
                print("\n Deployment Successful!")
                print(f" Public URL: {data.get('url')}")
                print(f" Agent ID: {data.get('agent_id')}")
            else:
                print("\n Deployment Failed")
                print(data)

        except Exception:
            print("\n Server did not return valid JSON")

    except Exception as e:
        print(" Failed to connect to backend")
        print(e)