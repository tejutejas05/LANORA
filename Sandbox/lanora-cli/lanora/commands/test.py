import os
import zipfile

def run_test():
    print("Running the Lanora Test.....")

    project_path = os.getcwd()
    print(f"Project detected: {project_path}")

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
                file_path = os.path.join(root,file)

                relative_path = os.path.relpath(file_path, project_path)

                arcname = os.path.join(folder_name, relative_path)

                zipf.write(file_path, arcname)

    print(f"Zip created successfully: {zip_name}")


