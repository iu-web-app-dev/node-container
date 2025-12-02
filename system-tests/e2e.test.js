const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chromium');
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
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}, 30000);

afterAll(async () => {
  // Close browser
  if (driver) {
    await driver.quit();
  }
  // TODO Stop servers
});

describe('Rideshare App E2E Tests', () => {
  test('should load the page', async () => {
    await driver.get('http://localhost:8080/rideshare.html');
    const title = await driver.getTitle();
    expect(title).toContain('Rideshare');
  });

  test('should add a new ride', async () => {
    await driver.get('http://localhost:8080/rideshare.html');
    
    // Fill out the form
    await driver.findElement(By.id('contactName')).sendKeys('Max Mustermann');
    await driver.findElement(By.id('contactEmail')).sendKeys('max@example.com');
    await driver.findElement(By.id('startDateTime')).sendKeys('2026-05-20T09:00');
    await driver.findElement(By.id('startTown')).sendKeys('Berlin');
    await driver.findElement(By.id('destinationTown')).sendKeys('Hamburg');
    await driver.findElement(By.id('availableSeats')).sendKeys('4');
    
    // Submit form
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Wait for success message
    await driver.wait(until.elementLocated(By.css('.alert-success')), 5000);
    
    const successMsg = await driver.findElement(By.css('.alert-success')).getText();
    expect(successMsg).toContain('successfully');
  });
}, 60000);