package services

import (
	"context"
	"os/exec"
	"time"
)

func RunDockerContainer(image string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cmd := exec.CommandContext(
		ctx,
		"docker", "run",				// check through this
		"--rm",
		"--memory=256m",
		"--cpus=0.5",
		"--network=none",
		"--pids-limit=100",
		image,
	)

	output, err := cmd.CombinedOutput()

	return string(output), err
}