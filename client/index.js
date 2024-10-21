const Docker = require('dockerode');

// Function to generate a unique client ID
function generateClientId() {
  return Math.random().toString(36).substring(7);
}

let clientId = generateClientId();
let requestCount = 0;

// Function to create a new Docker client with the current client ID
function createDockerClient() {
  return new Docker({
    host: process.env.DOCKER_HOST || 'http://localhost:2375',
    headers: {
      'X-Docker-Client-ID': clientId
    }
  });
}

let docker = createDockerClient();

async function getDockerInfo() {
  try {
    const info = await docker.info();
    console.log(`Request #: ${requestCount + 1}`);
    console.log(`Client ID: ${clientId}`);
    console.log(`Docker Daemon ID: ${info.ID}`);
    console.log(`Name: ${info.Name}`);
    console.log(`Operating System: ${info.OperatingSystem}`);
    console.log(`Kernel Version: ${info.KernelVersion}`);
    console.log(`---`);

    requestCount++;

    // Change client ID every 4 requests
    if (requestCount % 4 === 0) {
      clientId = generateClientId();
      console.log(`\nChanging to new Client ID: ${clientId}\n`);
      docker = createDockerClient();
    }
  } catch (error) {
    console.error('Error getting Docker info:', error);
  }
}

async function main() {
  console.log(`Starting Docker client with initial ID: ${clientId}`);
  
  // Run getDockerInfo every 2 seconds
  setInterval(getDockerInfo, 2000);
}

main().catch(console.error);