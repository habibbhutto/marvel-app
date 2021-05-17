const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../../docs');

const router = express.Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

module.exports = router;
