var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.resolve('./','public/home_page.html'));
});

/* GET statistics page. */
router.get('/statistics', function(req, res, next) {
  res.sendFile(path.resolve('./','public/statistics_page.html'));
});
/* GET detail page. */
router.get('/detail', function(req, res, next) {
  res.sendFile(path.resolve('./','public/detail_page.html'));
});

/* GET analyze page. */
router.get('/analyze', function(req, res, next) {
  res.sendFile(path.resolve('./','public/analyze_page.html'));
});

/* GET news page. */
router.get('/news', function(req, res, next) {
  res.sendFile(path.resolve('./','public/news.html'));
});

/* GET report page. */
router.get('/report', function(req, res, next) {
    res.sendFile(path.resolve('./','public/report_page.html'));
});

/* GET report_detail page. */
router.get('/report_detail', function(req, res, next) {
  res.sendFile(path.resolve('./','public/report_detail_page.html'));
});


/* GET 404 page. */
router.get('/404', function(req, res, next) {
  res.sendFile(path.resolve('./','public/404.html'));
});


module.exports = router;
 