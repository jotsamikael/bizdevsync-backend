// utils/logger.js
const pino = require("pino");
const ENV = require("../../config");
const token = ENV.BETTERSTACK_TOKEN;
const path = require("path");
const fs = require("fs");


// Function to get daily log file path
const getDailyLogPath = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const logsDir = path.join(__dirname, '../../logs');
    const filename = `server-${year}-${month}-${day}.log`;
    
    // Ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    return path.join(logsDir, filename);
  };


const transport = pino.transport({
  targets: [
    {
      target: "pino/file",
      options: {
        destination: getDailyLogPath(),
        mkdir: true,
        append: true,
        sync: true,
      },
      level: "info",
    },
    /*{
      target: "@logtail/pino",
      options: {
        sourceToken: token,
      },
    },*/
  ],
  // Add error handling
  onError: (err) => {
    console.error("Logtail transport error:", err);
    // Optionally fall back to file logging only
  }
});

const logger = pino({ level: "info" }, transport);
module.exports = logger;
