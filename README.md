# Dockerode Sticky Sessions Proof of Concept

This project demonstrates using Dockerode with custom headers to maintain sticky sessions to Docker daemons through HAProxy.

## Components

1. Four Docker daemons running in separate containers
2. HAProxy for load balancing and maintaining sticky sessions
3. Node.js client using Dockerode with custom headers

## Setup and Running

1. Ensure you have Docker installed on your system.

2. Clone this repository and navigate to the project directory.

3. Build and start the Docker Compose stack:

   ```shell
   docker compose up sut --build
   ```

4. The Node.js client will automatically start and attempt to list containers every 5 seconds.

5. You should see in the logs that each client consistently connects to the same Docker daemon.

## How it works

- The Node.js client generates a unique client ID and sends it as a custom header (`X-Balena-Build-ID`) with each request.
- The Node.js client selects a build group, either A or B, and sends it as a custom header (`X-Balena-Build-Group`) with each request.
- HAProxy uses the build group header to select a backend group, like a subset of Docker daemons.
- HAProxy uses the build ID header to maintain sticky sessions, ensuring that each client always connects to the same Docker daemon.
- You can verify this by checking the logs and seeing that each client ID consistently lists the same server.

## Modifying the setup

You can modify the `nodejs-client/index.js` file to perform different Docker operations or change the frequency of requests. After making changes, rebuild and restart the stack:

```shell
docker compose up sut --build
```

This setup demonstrates that HAProxy can maintain sticky connections between Dockerode clients and Docker daemons based on a custom header.
