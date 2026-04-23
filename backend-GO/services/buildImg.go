package services

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
)


// main build function


func BuildDockerImage(zipPath string) (string, error) {

	reader, err := zip.OpenReader(zipPath)
	if err != nil {
		return "", err
	}
	defer reader.Close()

	id := uuid.NewString()

	baseDir := filepath.Dir(zipPath)

	extractDir := filepath.Join(baseDir, id)

	err = os.MkdirAll(extractDir, 0755)
	if err != nil {
		return "", err
	}

	// extracting the zip file here

	var totalSize uint64
	const maxTotalSize = 500 << 20

	for _, f := range reader.File {

		totalSize += f.UncompressedSize64

		if totalSize > maxTotalSize {
			return "", fmt.Errorf("archive too large")
		}

		err = unzipFile(f, extractDir)

		if err != nil {
			return "", err
		}
	}

	// this will detect the actual path file 

	projectDir := findProjectRoot(extractDir)

	// building the docker image

	imageName, err := buildImage(projectDir, id)

	if err != nil {
		return "", err
	}

	return imageName, nil
}


// finds the project root and validates the project directory

func findProjectRoot(extractDir string) string {

	// Files directly at root
	if _, err := os.Stat(
		filepath.Join(extractDir, "requirements.txt"),
	); err == nil {

		return extractDir
	}

	entries, err := os.ReadDir(extractDir)

	if err != nil {
		return extractDir
	}

	for _, e := range entries {

		if e.IsDir() {

			candidate := filepath.Join(
				extractDir,
				e.Name(),
			)

			if _, err := os.Stat(
				filepath.Join(
					candidate,
					"requirements.txt",
				),
			); err == nil {

				return candidate
			}
		}
	}

	return extractDir
}

// actual process of the building the docker image

func buildImage(projectDir string, id string) (string, error) {

	imageName := "agent-" + id

	// here the validation happens checks if the required files are present or not 

	if _, err := os.Stat(
		filepath.Join(
			projectDir,
			"requirements.txt",
		),
	); os.IsNotExist(err) {

		return "",
			fmt.Errorf(
				"requirements.txt missing",
			)
	}

	if _, err := os.Stat(
		filepath.Join(
			projectDir,
			"main.py",
		),
	); os.IsNotExist(err) {

		return "",
			fmt.Errorf(
				"agent.py missing",
			)
	}

	// imp part this will create the docker file 

	dockerfile := `
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python","main.py"]
`

	dockerfilePath := filepath.Join(
		projectDir,
		"Dockerfile",
	)

	err := os.WriteFile(
		dockerfilePath,
		[]byte(dockerfile),
		0644,
	)

	if err != nil {
		return "", err
	}

	// using the following commands we will build the docker image 

	cmd := exec.Command(
		"docker",
		"build",
		"-t",
		imageName,
		".",
	)

	cmd.Dir = projectDir

	output, err := cmd.CombinedOutput()

	if err != nil {

		return "",
			fmt.Errorf(
				"docker build failed:\n%s",
				string(output),
			)
	}

	return imageName, nil
}


// unziping function

func unzipFile(
	file *zip.File,
	extractDir string,
) error {

	const maxFileSize = 100 << 20

	if file.UncompressedSize64 > maxFileSize {

		return fmt.Errorf(
			"file too large: %s",
			file.Name,
		)
	}

	cleanDest := filepath.Clean(
		extractDir,
	)

	if filepath.IsAbs(
		file.Name,
	) {

		return fmt.Errorf(
			"invalid path: %s",
			file.Name,
		)
	}

	filePath := filepath.Join(
		cleanDest,
		file.Name,
	)

	// prevents the zip slip (makes the new folder before creating the zip file)

	rel, err := filepath.Rel(
		cleanDest,
		filePath,
	)

	if err != nil ||
		strings.HasPrefix(
			rel,
			"..",
		) {

		return fmt.Errorf(
			"invalid zip path: %s",
			file.Name,
		)
	}

	// symlinks

	if file.Mode()&
		os.ModeSymlink != 0 {

		return fmt.Errorf(
			"symlink not allowed: %s",
			file.Name,
		)
	}

	// new directories for the new execution 


	if file.FileInfo().IsDir() {

		return os.MkdirAll(
			filePath,
			0755,
		)
	}

	err = os.MkdirAll(
		filepath.Dir(filePath),
		0755,
	)

	if err != nil {
		return err
	}

	destFile, err := os.OpenFile(
		filePath,
		os.O_CREATE|
			os.O_WRONLY|
			os.O_TRUNC,
		0644,
	)

	if err != nil {
		return err
	}

	defer destFile.Close()

	srcFile, err := file.Open()

	if err != nil {
		return err
	}

	defer srcFile.Close()

	_, err = io.Copy(
		destFile,
		srcFile,
	)

	return err
}