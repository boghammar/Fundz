'use strict';
/* avanza.js
 *
 * Access fund data from Avanza
 * 
 */
const request = require('request-promise');
var HttpsProxyAgent = require('https-proxy-agent');
var Url = require('url');
var config = require('../config');

class Avanza {

    // ------------------------------------------------------------------------
	constructor( options = false ) {
        config.urls= {
            'base': 'https://www.avanza.se/',
            'fund': '_mobile/market/fund/{id}', // GET Get all info on an instrument including latest NAV, description, various changes etz
            'nav': 'ab/component/highstockchart/getchart/orderbook', // POST Retreives NAV over a period specified by the POST body
        };
        config.post_default = {
            'orderbookId': 2801,
            'chartResolution':  "DAY", // MONTH, DAY, WEEK, QUARTER
            'navigator': false,
            'percentage':  false, // 'true' show returns in percent
            'timePeriod':  "year", // month, year, three_years, ten_years
            'chartType':  "AREA",
            'owners': false,
            'volume': false,
            'ta': [], // can be omitted, else *must* contain array
            'period': false, // false -OR- max
        };
        //'proxy': 'https://gia.sebank.se:8080', // http://gia.sebank.se:8080',

        this.config = config;

    }

    // ------------------------------------------------------------------------
    history(id, callback, opts) {
        let url = this.config.urls.base + this.config.urls.fund;
        url = url.replace('{id}', id);

        let opt = {
            method: 'GET',
            uri: url,
            json: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true'
            },
        }
        log('Calling ' + url);

        if (this.config.proxy !== undefined) {
            var xx = Url.parse(this.config.proxy);
            opt.agent = new HttpsProxyAgent(xx);
            log('Using proxy ' + this.config.proxy);
        }

        request(opt)
            .then(function (data){
                callback(data);
            })
            .catch(function (err){
                log('Problems: ' + err);
                callback(undefined, err);
            });
    }

    // ------------------------------------------------------------------------
    nav(id, callback, opts) {
		let monthOffset = 13;
		let post = this.config.post_default;
		post.orderbookId = id;
		post.period = this.minusMonths( monthOffset );

        let url = this.config.urls.base + this.config.urls.nav;

        let opt = {
            method: 'POST',
            uri: url,
            json: true,
            body: post,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true'
            },
        }

        request(opt)
            .then(function (data){
                data = data.dataPoints;
                callback(data);
            })
            .catch(function (err){

            });
    }

    // ------------------------------------------------------------------------
    // UTILITIES
    // ------------------------------------------------------------------------
	/* today minus X months, returns Y-m-d string */
	minusMonths( months )
	{
		let d = new Date();
		d.setMonth( d.getMonth() - months );
		
		let month = d.getMonth(),
			day = d.getDate();
			
		if( month<10 ) month = '0' + month;
		if( day<10 ) day = '0' + day;
		
		return d.getFullYear() + '-' + month + '-' + day;
	}
}

// --------------------------------------- At beginning of log entries
function logStart() {
    return (new Date(Date.now())).toLocaleTimeString() + " Avanza: ";
}

// --------------------------------------- Logging
function log(msg) {
    console.log(logStart() + msg);
}
// --------------------------------------- Debugging
function debug(msg) {
    if (debugMe) log(msg);
}

var az = new Avanza()

module.exports = az;
