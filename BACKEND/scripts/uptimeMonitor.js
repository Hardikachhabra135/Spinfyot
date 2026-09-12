const https = require('https');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: __dirname + '/../.env' });

// Configuration
const INTERVAL_MS = parseInt(process.env.MONITOR_INTERVAL_MS) || 5 * 60 * 1000; // Default: 5 minutes
const TIMEOUT_MS = parseInt(process.env.MONITOR_TIMEOUT_MS) || 10000; // Default: 10 seconds
const RETRY_DELAY_MS = 30000; // 30 seconds before retrying a failed ping

// URLs to monitor
const urlsToMonitor = [
  { name: 'Frontend', url: process.env.FRONTEND_URL || 'https://spinfyot-frontend.vercel.app' },
  { name: 'Admin Panel', url: process.env.ADMIN_URL || 'https://spinfyot-admin.vercel.app' },
  { name: 'Backend API Health', url: (process.env.BACKEND_URL || 'https://spinfyot-api.onrender.com') + '/api/health' }
];

// Alert Configuration
const ALERT_EMAIL = process.env.MONITOR_ALERT_EMAIL;
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// State to prevent spamming alerts
const serviceState = {};
urlsToMonitor.forEach(s => {
  serviceState[s.name] = { isDown: false, lastAlert: null };
});

/**
 * Pings a URL and returns true if status is 200-299
 */
const pingUrl = (url) => {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: TIMEOUT_MS }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
};

/**
 * Sends an email alert
 */
const sendAlert = async (serviceName, url, isDown) => {
  if (!ALERT_EMAIL || !process.env.SMTP_USER) {
    console.warn(`[!] Skipping email alert for ${serviceName} because SMTP/Email is not configured in .env.`);
    return;
  }

  const subject = isDown 
    ? `🚨 UPTIME ALERT: ${serviceName} is DOWN` 
    : `✅ UPTIME RECOVERY: ${serviceName} is UP`;
    
  const text = isDown
    ? `The service ${serviceName} (${url}) has failed the health check and appears to be down.`
    : `The service ${serviceName} (${url}) is back online and responding successfully.`;

  try {
    await transporter.sendMail({
      from: `"Spinfyot Monitor" <${process.env.SMTP_USER}>`,
      to: ALERT_EMAIL,
      subject,
      text,
    });
    console.log(`[ALERT] Sent ${isDown ? 'downtime' : 'recovery'} email for ${serviceName}.`);
  } catch (error) {
    console.error(`[ERROR] Failed to send alert email:`, error.message);
  }
};

/**
 * Checks all URLs
 */
const checkServices = async () => {
  console.log(`\n[${new Date().toISOString()}] Running uptime checks...`);

  for (const service of urlsToMonitor) {
    const isUp = await pingUrl(service.url);
    const state = serviceState[service.name];

    if (isUp) {
      console.log(`[OK] ${service.name} is UP.`);
      if (state.isDown) {
        state.isDown = false;
        await sendAlert(service.name, service.url, false);
      }
    } else {
      console.log(`[FAIL] ${service.name} failed first check. Retrying in ${RETRY_DELAY_MS/1000}s...`);
      
      // Wait and retry to avoid false positives (e.g. temporary network blips)
      await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
      const isUpRetry = await pingUrl(service.url);

      if (isUpRetry) {
        console.log(`[OK] ${service.name} recovered on retry.`);
      } else {
        console.log(`[FAIL] ${service.name} is CONFIRMED DOWN.`);
        if (!state.isDown) {
          state.isDown = true;
          await sendAlert(service.name, service.url, true);
        }
      }
    }
  }
};

// Start the monitor
console.log('=================================');
console.log('SPINFYOT UPTIME MONITOR STARTED');
console.log(`Interval: ${INTERVAL_MS / 1000} seconds`);
console.log(`Monitoring ${urlsToMonitor.length} endpoints.`);
console.log('=================================');

checkServices(); // Run immediately
setInterval(checkServices, INTERVAL_MS);
