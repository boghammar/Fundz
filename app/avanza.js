'use strict';
/* avanza.js
 *
 * Access fund data from Avanza
 * 
 */
const request = require('request-promise');

class Avanza {

    // ------------------------------------------------------------------------
	constructor( options = false ) {
        let config = {
            'urls': {
                'base': 'https://www.avanza.se/',
				'fund': '_mobile/market/fund/{id}', // GET Get all info on an instrument including latest NAV, description, various changes etz
				'nav': 'ab/component/highstockchart/getchart/orderbook', // POST Retreives NAV over a period specified by the POST body
            },
			'post_default':
			{
				'orderbookId': 2801,
				'chartResolution':  "MONTH", // MONTH, DAY, WEEK, QUARTER
				'navigator': false,
				'percentage':  false, // 'true' show returns in percent
				'timePeriod':  "year", // month, year, three_years, ten_years
				'chartType':  "AREA",
				'owners': false,
				'volume': false,
				'ta': [], // can be omitted, else *must* contain array
				'period': false, // false -OR- max
			},
        }

        this.config = config;

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

var az = new Avanza()

module.exports = az;
