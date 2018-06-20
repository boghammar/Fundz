var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Fundz', listName: 'Indexs' 
    , funddata: [
      {name: 'A', type: 'Index SWE', fee: '0.3%' , threeMonths: '12%', updated: '2018-06-20', sma6: '3%', sma10: '2%'}
      ,{name: 'B',  type: 'Index US', fee: '0.2%' , threeMonths: '14%', updated: '2018-06-21', sma6: '3.3%', sma10: '6%'}
    ]
  });
});

module.exports = router;
