const { Router } = require('express');

const router = Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

module.exports = router;
