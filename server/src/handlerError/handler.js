const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'error.log');
const logDirPath = path.join(__dirname, 'Log');

if (!fs.existsSync(logDirPath)) {
  fs.mkdirSync(logDirPath);
}

const copyLogsDaily = () => {
  const currentTimestamp = Date.now();
  const targetFile = path.join(logDirPath, `${currentTimestamp}.log`);

  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Failed read log file:', err);
      return;
    }

    const formattedData = data.split('\n').map(line => {
      if (line.trim()) {
        const logData = JSON.parse(line);
        return JSON.stringify({
          message: logData.message,
          time: logData.time,
          code: logData.code
        });
      }
      return '';
    }).join('\n');

    fs.writeFile(targetFile, formattedData, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Failed to write to target file:', writeErr);
      } else {
        console.log(`Error data written to ${targetFile}`);
      }
    });

    fs.truncate(logFilePath, 0, (err) => {
      if (err) {
        console.error('Failed to clear log file:', err);
      } else {
        console.log('error.log has been cleared');
      }
    });
  });
};

setInterval(copyLogsDaily, 86400000);

module.exports = (err, req, res, next) => {
  const logObject = {
    message: err.message || 'Unknown Error',
    time: Date.now(),
    code: err.code || 500,
    stackTrace: err.stack || 'No stack trace',
  };

  fs.appendFile(logFilePath, JSON.stringify(logObject) + '\n', (fileErr) => {
    if (fileErr) {
      console.error('Failed to write to log file:', fileErr);
    } else {
      console.log('Error logged in error.log');
    }
  });

  if (
    err.message ===
      'new row for relation "Banks" violates check constraint "Banks_balance_ck"' ||
    err.message ===
      'new row for relation "Users" violates check constraint "Users_balance_ck"'
  ) {
    err.message = 'Not Enough money';
    err.code = 406;
  }

  if (!err.message || !err.code) {
    res.status(500).send('Server Error');
  } else {
    res.status(err.code).send(err.message);
  }
};
