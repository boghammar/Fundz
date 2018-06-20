var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Fundz', tableName: 'Funds' 
    , funddata: [
      {name: 'A', fee: '0.2%' , threeMonths: '12%', updated: '2018-06-20', sma6: '3%', sma10: '2%'}
      ,{name: 'B', fee: '0.2%' , threeMonths: '12%', updated: '2018-06-20', sma6: '3%', sma10: '2%'}
    ]
  });
});

module.exports = router;
