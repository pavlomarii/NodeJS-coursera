// Modules needed
const express = require('express');
const router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Export this router to app.js
module.exports = router;
