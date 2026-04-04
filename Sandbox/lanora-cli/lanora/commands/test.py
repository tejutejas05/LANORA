import os
import zipfile
import requests # for the http requests to backend
from lanora.utils import require_auth


@require_auth
def run_test():

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

    url = "http://localhost:8080/test-agent"

    try:
        with open(zip_name, "rb") as f: # open zip file
            files = {"file": f}

            response = requests.post(url, files=files) # http request 

        print("Response from server:")
        print(response.text)
    
    # if fails this works
    except Exception as e: 
        print("Failed to connect")
        print(e)
