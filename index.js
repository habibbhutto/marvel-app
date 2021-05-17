const app = require('./app');
const logger = require('./utils/logger');
const config = require('./config');
const PORT = config.server().PORT;
const HOST = config.server().HOST;

const server = app.listen(PORT, () => {
  console.log(`Marvel app listening at http://${HOST}:${PORT}`);
});

const exitHandler = () => {
  const context = {
    fileName: __filename,
    operationName: 'exitHandler',
  };

  if (server) {
    server.close(() => {
      logger.info('Server closed', context);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  const context = {
    fileName: __filename,
    operationName: 'unexpectedErrorHandler',
  };

  logger.error(error, context);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  const context = {
    fileName: __filename,
    operationName: 'SIGTERM',
  };

  logger.info('SIGTERM received', context);
  if (server) {
    server.close();
  }
});
