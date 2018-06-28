var express = require('express');
var router = express.Router();
var az = require('../app/avanza');

var ids = [1933, 2801, 482298, 181108];

var funds = [];

ids.forEach( function(id) {
  let fund = {id: id};
  az.history(id, function (data, err) { // Change to promise
    if (err) {console.log("Error getting history for id="+id + ": ");return;}
    fund.name = data.name;
    fund.history = data;
    funds.push(fund);
    az.nav(id, function (nav, err) { // Change to promise
      if (err) {console.log("Error getting nav for id="+id + ": ");return;}
      fund.nav = nav;
    });
  });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Fundz'
    , listName: 'Indexs' 
    , funddata: funds
/*     [
      {id: 1933, name: 'Swedbank Robur Ny Teknik', type: 'Index SWE', fee: '0.3%' , threeMonths: '12%', updated: '2018-06-20', sma6: '3%', sma10: '2%'}
      ,{id: 2801, name: 'AMF Aktiefond Småbolag',  type: 'Index US', fee: '0.2%' , threeMonths: '14%', updated: '2018-06-21', sma6: '3.3%', sma10: '6%'}
    ]
 */  });
});

module.exports = router;
