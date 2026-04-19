package services

import (
	"context"
	"os/exec"
	"time"
	"errors"
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