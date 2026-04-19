package services

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
)

func BuildDockerImage(fp string) (string, error) {
	reader, err := zip.OpenReader(fp)

	if err != nil {
		return "", err
	}

	defer reader.Close()

	id := uuid.NewString()
	dest, err := filepath.Abs(fp)
	if err != nil {
		return "", err
	}

	d := filepath.Join(dest, id)
	err = os.MkdirAll(d, 0755)
	if err != nil {
		return "", err
	}

	var totalSize uint64
	const maxTotalSize = 500 << 20

	for _, f := range reader.File {
		totalSize += f.UncompressedSize64
		if totalSize > maxTotalSize {
			return "", fmt.Errorf("Archive too large")
		}

		err = unzipFile(f, dest)
		if err != nil {
			return "", err
		}
	}

	imageName, err := buildImage(dest, id)
	if err != nil {
		return "", err
	}

	return imageName, nil

}

func buildImage(d string, id string) (string, error) {
	//yet to build
	return "", nil
}

func unzipFile(file *zip.File, d string) error {

	const maxSize = 100 << 20
	if file.UncompressedSize64 > maxSize {
		return fmt.Errorf("File too large: %s", file.Name)
	}

	cleanDest := filepath.Clean(d)

	if filepath.IsAbs(file.Name) {
		return fmt.Errorf("Invalid path: %s", file.Name)
	}

	filePath := filepath.Join(cleanDest, file.Name)

	rel, err := filepath.Rel(cleanDest, filePath)

	if err != nil || strings.HasPrefix(rel, "..") {
		return fmt.Errorf("Invalid file path: %s", filePath)
	}

	if file.Mode()&os.ModeSymlink != 0 {
		return fmt.Errorf("symlink not allowed: %s", file.Name)
	}

	if file.FileInfo().IsDir() {
		return os.MkdirAll(filePath, 0755)
	}

	if err := os.MkdirAll(filepath.Dir(filePath), 0755); err != nil {
		return err
	}

	destFile, err := os.OpenFile(filePath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		return err
	}

	defer destFile.Close()

	srcFile, err := file.Open()
	if err != nil {
		return err
	}
	defer srcFile.Close()

	_, err = io.Copy(destFile, srcFile)
	return err

}
