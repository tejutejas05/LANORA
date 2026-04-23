package services

import (
	"context"
	"os/exec"
	"time"
	"errors"
	"io"
)

func RunDockerContainer(image string) (string, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	cmd := exec.CommandContext(
		ctx,

		"docker", "run",
														// check through this
		"--rm",

		"--memory=256m",
		"--cpus=0.5",
		"--pids-limit=100",

		"--network=none",
		"--read-only",
		"--cap-drop=ALL",
		"--security-opt=no-new-privileges",

		"--user=1000:1000",

		image,
	)

	output, err := cmd.CombinedOutput()

	// Detect timeout
	if ctx.Err() == context.DeadlineExceeded {
		return string(output),
			errors.New("Container killed: execution timeout exceeded")
	}

	if err != nil {
		return string(output), err
	}

	return string(output), nil
}

func RunDockerContainerStream(image string, send func(string)) error {

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	cmd := exec.CommandContext(
		ctx,
		"docker", "run",
		"--rm",
		"--memory=256m",
		"--cpus=0.5",
		"--pids-limit=100",
		"--network=none",
		"--read-only",
		"--cap-drop=ALL",
		"--security-opt=no-new-privileges",
		"--user=1000:1000",
		image,
	)
	// code for streaming

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return err
	}

	// starting the container

	err = cmd.Start()
	if err != nil {
		send("[ERROR] Failed to start container\n")
		return err
	}

	// streaming 

	stream := func(pipe io.ReadCloser) {
		buf := make([]byte, 1024)

		for {
			n, err := pipe.Read(buf)

			if n > 0 {
				send(string(buf[:n]))  // through the send we are sending logs
			}

			if err != nil {
				break
			}
		}
	}

	go stream(stdout)
	go stream(stderr)

	// waits for the completion 

	
	err = cmd.Wait()

	if ctx.Err() == context.DeadlineExceeded {
		send("\n[ERROR] Timeout exceeded\n")
		return errors.New("timeout")
	}

	if err != nil {
		send("\n[ERROR] Container failed\n")
		return err
	}

	send("\n[SUCCESS] Execution completed\n")

	return nil
}