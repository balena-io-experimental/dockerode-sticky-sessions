const Docker = require('dockerode');

function generateBuildId() {
  return Math.random().toString(36).substring(7);
}

function changeGroup(currentGroup) {
  return currentGroup === 'A' ? 'B' : 'A';
}

let buildId = generateBuildId();
let buildGroup = 'A';
let requestCount = 0;

function createDockerClient() {
  return new Docker({
    host: process.env.DOCKER_HOST || 'http://localhost:2375',
    headers: {
      'X-Balena-Build-ID': buildId,
      'X-Balena-Build-Group': buildGroup
    }
  });
}

let docker = createDockerClient();

async function getDockerInfo() {
  try {
    const info = await docker.info();
    
    console.log(`Request #: ${requestCount + 1}`);
    console.log(`Build ID: ${buildId}`);
    console.log(`Build Group: ${buildGroup}`);
    console.log(`Docker Daemon Name: ${info.Name}`);
    console.log(`---`);

    requestCount++;

    // Change Build ID every 4 requests
    if (requestCount % 4 === 0) {
      buildId = generateBuildId();
      // Also randomly change the group sometimes
      if (Math.random() < 0.5) {
        buildGroup = changeGroup(buildGroup);
        console.log(`\nChanging to new Group: ${buildGroup}`);
      }
      console.log(`\nChanging to new Build ID: ${buildId}\n`);
      docker = createDockerClient();
    }
  } catch (error) {
    console.error('Error getting Docker info:', error);
    console.error('Current headers:', docker.modem.headers);
  }
}

async function main() {
  console.log(`Starting Docker client with initial Build ID: ${buildId} and Group: ${buildGroup}`);
  // Add a delay before starting requests
  await new Promise(resolve => setTimeout(resolve, 8000));
  setInterval(getDockerInfo, 2000);
}

main().catch(console.error);
