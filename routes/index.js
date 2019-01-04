var express = require('express');
var router = express.Router();
var az = require('../app/avanza');
var config = require('../config');

var ids = config.fundids; //[1933, 2801, 482298, 181108];

var funds = [];

ids.forEach( function(id) {
  let fund = {id: id};
  az.history(id, function (data, err) { // Change to promise
    if (err) {console.log("Error getting history for id="+id + ": "+ err);return;}
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
   // , funddata: funds
/*     [
      {id: 1933, name: 'Swedbank Robur Ny Teknik', type: 'Index SWE', fee: '0.3%' , threeMonths: '12%', updated: '2018-06-20', sma6: '3%', sma10: '2%'}
      ,{id: 2801, name: 'AMF Aktiefond Småbolag',  type: 'Index US', fee: '0.2%' , threeMonths: '14%', updated: '2018-06-21', sma6: '3.3%', sma10: '6%'}
    ]
 */  
    , funddata : [
      {id: 1933, name: 'Swedbank Robur Ny Teknik', history: {"sellable":true,"description":"Fonden placerar huvudsakligen i aktier i svenska och nordiska mindre och medelstora bolag. Placeringarna koncentreras till bolag vars produkter och/eller tjänster har ett högt teknikinnehåll. Exempel på branscher där fonden placerar är IT/telekommunikation, läkemedel/medicinsk teknik, miljöteknik och industriteknik. Fonden kan placera upp till 30 procent av fondförmögenheten på marknader utanför Norden. Fonden får använda sig av derivatinstrument i strävan att öka fondens avkastning. Fonden har en långsiktig placeringshorisont och en aktiv investeringsstrategi som fokuserar på bolagsval inom ovan nämnda placeringsinriktning. Fonden följer även fondbolagets policy för ansvarsfulla investeringar, läs mer om policyn i fondens informationsbroschyr. Fonden lämnar normalt ingen utdelning, utan vinster återinvesteras i fonden.","administrators":"Ingemar Syhrén, Johan Söderström, Carl Armfelt","standardDeviation":16.72,"domicile":"Sverige","isin":"SE0000709123","risk":5,"loanFactor":70.00,"sharpeRatio":1.28,"tradingCurrency":"SEK","managementFee":1.25,"prospectus":"https://secure.msse.se/se/SimplifiedProspectus/generate_pdf.aspx?u=aciuDiPYm3A=&ip=CL00010051","buyFee":0.00,"capital":15310980000.00,"normanAmount":10796.00,"rating":5,"sellFee":0.00,"startDate":"1996-11-11","buyable":true,"riskLevel":"MIDDLE","hasInvestmentFees":true,"name":"Swedbank Robur Ny Teknik A","id":"1933","NAV":719.86,"NAVLastUpdated":"2019-01-03T00:00:00.000+0100","changeSinceOneDay":-0.63,"changeSinceOneWeek":1.81,"changeSinceOneMonth":-5.62,"changeSinceThreeMonths":-18.23,"changeSinceSixMonths":-15.50,"changeSinceTurnOfTheYear":0.31,"changeSinceOneYear":1.26,"changeSinceThreeYears":69.55,"changeSinceFiveYears":221.96,"changeSinceTenYears":883.10,"relatedFunds":[{"changeSinceOneYear":4.23,"name":"BGF World Technology A2","id":"431"},{"changeSinceOneYear":-7.73,"name":"Threadneedle (Lux) Global Tech AU USD","id":"289977"},{"changeSinceOneYear":3.28,"name":"Öhman Global Growth","id":"372"},{"changeSinceOneYear":-9.95,"name":"CS (Lux) Sm and Md Cp Germany Eq B EUR","id":"947"},{"changeSinceOneYear":11.30,"name":"MS INVF US Growth A","id":"70331"}],"fundCompany":{"homePage":"www.swedbankrobur.se","name":"Swedbank Robur"},"numberOfOwners":75498,"autoPortfolio":false,"otherFees":"","subCategory":"Branschfond, ny teknik","type":"Branschfond"}
      },
      {id: 2801, name: 'AMF Aktiefond Småbolag', history: {"sellable":true,"description":"Fonden investerar i mindre och medelstora börsnoterade företag. Placeringarna sker huvudsakligen i svenska aktier men upp till 25 procent kan även investeras på övriga nordiska börser. Fonden är inte branschinriktad utan strävar efter att balansera placeringarna mellan olika typer av företag för att få en god riskspridning. Vi förvaltar fonden aktivt och vår målsättning är att avkastningen ska bli högre än index. Den relativt höga risknivån gör att en placering i denna fond ska ses som ett långsiktigt sparande.","administrators":"Angelica Hanson","standardDeviation":12.97,"domicile":"Sverige","isin":"SE0001185000","risk":5,"loanFactor":80.00,"sharpeRatio":0.75,"tradingCurrency":"SEK","managementFee":0.40,"prospectus":"https://secure.msse.se/se/SimplifiedProspectus/generate_pdf.aspx?u=aciuDiPYm3A=&ip=JWMAY00356","buyFee":0.00,"capital":7156470000.00,"normanAmount":3558.00,"rating":3,"sellFee":0.00,"startDate":"2004-05-17","buyable":true,"riskLevel":"MIDDLE","hasInvestmentFees":true,"name":"AMF Aktiefond Småbolag","id":"2801","NAV":579.15,"NAVLastUpdated":"2019-01-03T00:00:00.000+0100","changeSinceOneDay":-0.74,"changeSinceOneWeek":1.78,"changeSinceOneMonth":-7.15,"changeSinceThreeMonths":-15.35,"changeSinceSixMonths":-9.14,"changeSinceTurnOfTheYear":-0.45,"changeSinceOneYear":-3.73,"changeSinceThreeYears":20.61,"changeSinceFiveYears":80.43,"changeSinceTenYears":439.49,"relatedFunds":[{"changeSinceOneYear":-8.17,"name":"Danske Invest Tillväxtmarknadsobl SEK h","id":"454936"},{"changeSinceOneYear":-0.90,"name":"Quesada Bond Opportunity B","id":"595176"},{"changeSinceOneYear":-1.65,"name":"Nordic Cross Stable Return R SEK","id":"817893"},{"changeSinceOneYear":7.22,"name":"IKC Fastighetsfond A","id":"551035"},{"changeSinceOneYear":-5.82,"name":"AMF Aktiefond Sverige","id":"1949"}],"fundCompany":{"homePage":"www.amf.se","name":"AMF"},"numberOfOwners":9466,"autoPortfolio":false,"otherFees":"","subCategory":"Sverige, små-/medelstora bolag","type":"Aktiefond"}
      }
    ]
  });
});

module.exports = router;
