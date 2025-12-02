const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { spawn } = require('child_process');

let httpServer;
let apiServer;
let driver;

beforeAll(async () => {
  // Start http-server for frontend
  httpServer = spawn('npx', ['http-server', './www', '-p', '8080'], {
    stdio: 'ignore',
    detached: true
  });

  // Start API server
  apiServer = spawn('node', ['src/server.js'], {
    stdio: 'ignore',
    detached: true
  });

  // Wait for servers to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Setup Chrome driver
  const options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  driver = await new Builder()
    .setChromeService(new chrome.ServiceBuilder('chromedriver'))
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  // Increase timeouts
  await driver.manage().setTimeouts({ script: 60000, pageLoad: 60000 });
}, 30000);

afterAll(async () => {
  // Close browser
  if (driver) {
    await driver.quit();
  }

  // Stop servers
  if (httpServer) httpServer.kill();
  if (apiServer) apiServer.kill();
});

describe('Rideshare App E2E Tests', () => {
  test('should load the page', async () => {
    await driver.get('http://localhost:8080/rideshare.html');
    const title = await driver.getTitle();
    expect(title).toContain('Rideshare');
  });
}, 60000);