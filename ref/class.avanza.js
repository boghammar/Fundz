'use strict';

class Avanza
{

	constructor( options = false )
	{	
		
		let config =
		{
			'dev': false, // output logs or not etc
			'sort_default': 'priceThreeMonthsAgo', // default sort (DESC)
				
			// NOTE: Proxies make things super-slow, set config to proxies: [] + use a plugin for a browser that can disable CORS for specific URI's instead
			'proxies': [
				'https://cors-anywhere.herokuapp.com/', // works but unstable
				'https://thingproxy.freeboard.io/fetch/', // works
				'https://corsian.herokuapp.com/', // works
				//'https://crossorigin.me/', // slow..
			],
			
			
			'urls': 
			{
				'base': 'https://www.avanza.se/',
				'nav': 'ab/component/highstockchart/getchart/orderbook',
				'info': '_mobile/market/orderbooklist/{id}', // allows list of ids e.g. 2801,2802,2803
				'query': '_mobile/market/search?query={query}&limit={limit}',
				
				'fund': '_mobile/market/fund/{id}',
				'stock': '_mobile/market/stock/{id}',
				'cert': '_mobile/market/certificate/{id}',
				'etf': '_mobile/market/exchange_traded_fund/{id}',
				'warrant': '_mobile/market/warrant/{id}',
				'index': '_mobile/market/stock/{id}',
			},
			
			'links':
			{
				'fund': 'fonder/om-fonden.html/',
				'etf': 'borshandlade-produkter/etf-torg/om-fonden.html/',
				'cert': 'borshandlade-produkter/certifikat-torg/om-certifikatet.html/',
				'warrant': 'borshandlade-produkter/warranter-torg/om-warranten.html/',
				'index': 'index/om-indexet.html/',
			},
			
			// localStorage caching
			'cache':
			{
				'caching': true, // not used now
				'cachePrefix': 'az_', // not used
				'cacheTime': 10, // not used now, caching is currently 'forever'
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
			
			// fields for the table, note: also affects order
			'table_fields':
			{
				'id': 'id',
				'name': 'Namn',
				'currency': 'Val.',
				'managementFee': 'Avg.',
				//'flagCode': 'flag',
				//'country': 'land',
				'changePercent': '+/-',
				'priceOneWeekAgo': '1v',
				'priceOneMonthAgo': '1m',
				'priceThreeMonthsAgo': '3m',
				'priceSixMonthsAgo': '6m',
				'priceOneYearAgo': '12m',
				'priceThreeYearsAgo': '3 år',
				'priceFiveYearsAgo': '5 år',
				'lastPriceUpdated': 'Upd',
			},
			
			'currencies':
			{
				'USD': 19000,
				'CAD': 108701,
				'EUR': 18998,
				'DKK': 53292,
				'NOK': 53293,
				'GBP': 108703,
				'CHF': 108704,
				'JPY': 108702,
				'AUD': 155736,
			},
			
		};
		
		// set default timeouts for all ajax requests
		$.ajaxSetup({
			timeout: 2000 
		});
		
		// options object on init
		// makes it possible to change config later via localStorage
		
		if( options && Object.keys(options).length > 0 )
		{			
			for( let key in options )
			{
				let val = options[key];
				
				// change the config
				if( key in config ){
					config[key] = val;
				}
				else {
					console.log('Config option "' + key + '" is not valid');
				}
				
			}
		}
		
		// register
		this.config = config;
		this.dev = config.dev;
		
		window.me = this;
		
	} // end constructor()

	
	log( str ) { if(this.dev) console.log(str); }
	
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
	
	// check if cached
	isCached( cacheKey )
	{
		return localStorage.getItem(cacheKey);
	}
	
	
	// generate cache strings using value in an object
	cacheKey( obj )
	{
		let str = '';
		for( let key in obj ){ str += obj[key]; }
		return str;
	}
	
	randomProxy()
	{
		let proxyArr = this.config.proxies;
		let rand = proxyArr[(Math.random() * proxyArr.length) | 0];
		return rand;
	}
	
	/*
		get info
		gets info for a lot of types at the same time
	*/
	info( ids, callback, retries )
	{
		retries = retries || 0;
		
		let uri = this.config.urls.base + this.config.urls.info;
		let cacheKey = 'info_' + ids;
		let isCached = this.isCached(cacheKey); // return null or result
		
		if( retries >= 4 ){
			console.log('Error getting info data from Avanza after 3 retries');
			return;
		}
		
		if( isCached )
		{
			callback(isCached);
		}
		else
		{			
			let uri = this.config.urls.base + this.config.urls.info;
			uri = uri.replace('{id}', ids);
			uri = this.randomProxy() + uri;
		
			$.get({
				url: uri
			})
			.done(function(data)
			{	
				// only save useful data
				let dataFilter = {};
				for( let key in data )
				{
					let cur = data[key];
					
					dataFilter[key] = {};
					dataFilter[key].id = cur.id;
					dataFilter[key].name = cur.name;
					dataFilter[key].instrumentType = cur.instrumentType;
					dataFilter[key].managementFee = cur.managementFee;
					//dataFilter[key].rating = cur.rating;
					//dataFilter[key].risk = cur.risk;				
				}

				let res = JSON.stringify(dataFilter);
				localStorage.setItem( cacheKey, res ); // write to cache
				callback(res);
			})
			.fail(function(data){
				console.log('fail');
				az.info( ids, callback, retries+1 );
			})
		}
	}
	
	
	/*
		get nav
		id: avanza id
		callback: func
		opts: object with options eg {'monthOffset': 16}
	*/
	nav( id, callback, opts )
	{
		
		if(!id) { console.log('no id set'); return; }
		let monthOffset = 13;
		if( opts && opts.monthOffset ) { monthOffset = opts.monthOffset; }
		
		// get default + modify
		let post = this.config.post_default;
		post.orderbookId = id;
		post.period = this.minusMonths( monthOffset );
		
		this.orderbook( post, function(data){
			callback(data, id);
		})
	
	}
	
	
	/* orderbook: ajax post request for series of data */
	orderbook( json, callback, retries )
	{
		retries = retries || 0;
	
		let d = new Date();
		let time = d.getTime();
		let cacheKey = this.cacheKey( json );
		cacheKey = 'orderbook_' + cacheKey;
		let isCached = this.isCached(cacheKey); // return null or result
		
		if( retries >= 4 ) {
			console.log('ERROR: could no fetch id after 3 retries ' + json.orderbookId);
			return;
		}
		
		if( isCached )
		{
			callback(isCached);
		}
		else
		{
			let url = this.config.urls.base + this.config.urls.nav;
			url = this.randomProxy() + url;
			let res;
			
			$.ajax({
				url: url,
				type: "POST",
				dataType: "json",
				data: JSON.stringify(json),
				headers: { 
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Credentials': 'true'
				}
			})
			.done(function(data)
			{	
				// only need dataPoints
				data = data.dataPoints;
				res = JSON.stringify(data);
				
				localStorage.setItem( cacheKey, res ); // write to cache
				callback(res); // return
			})
			.fail(function(data)
			{
				console.log('SLOW: id ' + json.orderbookId + ' was slow or could not fetch, retrying...');
				
				// retry
				az.orderbook( json, callback, retries+1 );
			})
			
		}
		
	}

	
	/* historical prices ie 3m, 6m, 12m etc */
	history( id, type, callback, retries )
	{
		type = type || 'stock';
		retries = retries || 0;
		
		if( retries >= 4 ){
			console.log('Error getting history data from Avanza after 3 retries');
			return;
		}
		
		let cacheKey = 'history_' + type + '_' + id;
		let isCached = this.isCached(cacheKey); // return null or result
		
		if( isCached )
		{
			this.log(id + ' is cached');
			callback(isCached);
		}
		else
		{
			this.log(id + ' not cached');
			
			let uri = this.config.urls.base + this.config.urls[type];
			uri = uri.replace('{id}', id);
			uri = this.randomProxy() + uri;
		
			$.get({
				url: uri
			})
			.done(function(data){
				
				// rm useless data
				delete data['relatedStocks'];
				delete data['latestTrades'];
				delete data['orderDepthLevels'];
				delete data['dividends'];
				
				let res = JSON.stringify(data);
				localStorage.setItem( cacheKey, res ); // write to cache
				callback(res);
			})
			.fail(function(data){
				az.history( id, type, callback, retries+1 );
			})
		}

	} // history()
	
	
	/* return id as a list with last data */
	list( id, sma, infos, callback )
	{
		
		callback = callback || null;
		infos = infos || false;
		
		this.nav(id, function(data, id)
		{
			data = JSON.parse(data);
			data = parent.sma(data, sma); // add sma
			
			let last = data[data.length-1]; // only need last
			let curNav = last[1];
			
			for(let key in sma){
				let val = sma[key];
				last['SMA'+val+'p'] = parent.toPercent(curNav, last['SMA'+val]);
			}
			
			// delete uneeded keys
			delete last[0];
			delete last[1];
			delete last.date;
			
			// if ETF get managementFee as well
			let type = null;
			if( infos ){
				
				//console.log(infos);
				for( let key in infos )
				{
					let cur = infos[key];
					if( cur.id === id )
					{
						let ins = cur.instrumentType;
						
						if( ins == 'FUND' ){
							type = 'fund';
						}
						if( ins == 'EXCHANGE_TRADED_FUND' ){
							type = 'etf';
						}
						else if( ins == 'CERTIFICATE' ){
							type = 'cert';
						}
						else if( ins == 'WARRANT' ){
							type = 'warrant';
						}
					}
				}
				
			}
			
			me.history( id, type, function(data)
			{
				data = JSON.parse(data);
				
				/*
					Must check funds
					Else data doesn't align with data from Avanza since we'll get live-quotes from AZ
					And not the delayed default versions that AZ show
				*/
				
				if( type == 'fund' ){
					
					let lastPrice = data.NAVLastUpdated;
					lastPrice = lastPrice.replace('T',' ').split('.')[0];
					lastPrice = lastPrice.substring(0, lastPrice.length - 9);
					
					data.lastPriceUpdated = lastPrice;
					data.changePercent = data.changeSinceOneDay;
					
					data.priceOneWeekAgo = data.changeSinceOneWeek;
					data.priceOneMonthAgo = data.changeSinceOneMonth;
					data.priceThreeMonthsAgo = data.changeSinceThreeMonths;
					data.priceSixMonthsAgo = data.changeSinceSixMonths;
					data.priceOneYearAgo = data.changeSinceOneYear;
					data.priceThreeYearsAgo = data.changeSinceThreeYears;
					data.priceFiveYearsAgo = data.changeSinceFiveYears;
					data.changePercent = data.changeSinceOneDay;
					
				}
				else
				{					
					// turn values into percent change relative to current nav (sellPrice)
					let lastPrice = data.lastPriceUpdated;
					lastPrice = data.lastPriceUpdated.replace('T',' ').split('.')[0];
					lastPrice = lastPrice.substring(0, lastPrice.length - 3);
					
					data.lastPriceUpdated = lastPrice;
					data.priceOneWeekAgo = parent.toPercent( curNav, data.priceOneWeekAgo );
					data.priceOneMonthAgo = parent.toPercent( curNav, data.priceOneMonthAgo );
					data.priceThreeMonthsAgo = parent.toPercent( curNav, data.priceThreeMonthsAgo );
					data.priceSixMonthsAgo = parent.toPercent( curNav, data.priceSixMonthsAgo );
					data.priceOneYearAgo = parent.toPercent( curNav, data.priceOneYearAgo );
					data.priceThreeYearsAgo = parent.toPercent( curNav, data.priceThreeYearsAgo );
					data.priceFiveYearsAgo = parent.toPercent( curNav, data.priceFiveYearsAgo );
					
				}
				
				
				// add managementFee
				for( let key in infos )
				{
					let cur = infos[key];
					if( cur.id === id )
					{
						let ins = cur.instrumentType;
						if( ins == 'FUND' )
						{
							data.managementFee = cur.managementFee;
						}
						else if( ins == 'CERTIFICATE' )
						{
							data.managementFee = data.administrationFee;
						}
							
						// add type
						data.instrumentType = ins;
					}
				}
				
				data.ma = last;
				
				for( let key in last )
				{
					data[key] = last[key];
				}
				
				last = null;
				
				if(callback)
				{
					callback(data);
				}

			})
			
		})
	}
	
	lists( ids, sma, callback )
	{
		callback = callback || false;
		
		var idList = [];
		var len = ids.length,
			i = 0,
			last = len-1,
			curCount = 0,
			max = len;
		
		var percentCount = $('#percentCount');
		percentCount.css('width', '10%');
		percentCount.removeClass('complete');
		
		// get infos for all ids
		// probem = we do not get managementFee here, only for funds
		this.info(ids.join(','), function(data){
			
			let infos = JSON.parse(data);
			
			// loop all ids and get historical data
			for(i;i<len;i++)
			{
				let id = ids[i];
				me.list(id, sma, infos, function(data){
					
					idList[curCount] = data;

					curCount++;
					let calc = max-curCount; // calculate remaining calls
					let percent = ((curCount/max)*100).toFixed() + '%';
					percentCount.css('width', percent);
					
					// check if last and then trigger 'complete'
					if( calc == 0 && callback ){
						callback(idList);					
						percentCount.addClass('complete');
					}
				})
			}
			
		})
		
	} // lists()
	
	
	/* sort array/object desc */
	sort(arr, sort){
		
		sort = sort || this.config.sort_default; // priceThreeMonthsAgo
		
		let sortType = sort.split(' '),
			isSort = sortType.length > 1 ? true : false;
		
		if( isSort && sortType[1] == 'asc' ){
			sort = sortType[0];
			arr.sort(function(a, b) { return parseFloat(a[sort]) - parseFloat(b[sort]) });
		}
		else {
			if( isSort ) { sort = sortType[0]; }
			arr.sort(function(a, b) { return parseFloat(b[sort]) - parseFloat(a[sort]) });
		}
		
		return arr;
		
	}
	
	// create table from array
	table( arr, head = false, sort = false, callback )
	{
	
		if( sort ){
			arr = this.sort(arr);
		}
		
		let tableStart = " \
			<table id='tbl' data-sortable> \
				<thead> \
				<tr> \
		";
	
		// set headers + the fields we want later in loop
		let headers = head;
		if( !headers ){			
			headers = this.config.table_fields; // use default
		}
		
		// check what col is sorted by
		let whatSort = this.config.sort_default;
		
		for(let key in headers)
		{
			if( key == whatSort )
			{
				tableStart += '<th class="'+ key +'" data-sorted="true" data-sorted-direction="descending">'+ headers[key] +'</th>';
			}
			else
			{
				tableStart += '<th class="'+ key +'">'+ headers[key] +'</th>';
			}
		}
		
		// check for ma array in first arr
		if( arr[0]['ma'] )
		{
			let maHeaders = arr[0]['ma'];
			for( let key in maHeaders )
			{
				if( !headers[key] ) {
					tableStart += '<th class="'+ key +'">'+ key +'</th>';
					headers[key] = key;
				}
			}
		}
		
		tableStart += '</tr></thead>';
		let tableBody = '<tbody>';
		
		// loop arr
		let i=0, len= arr.length;
		for( i; i < len; i++ )
		{
			tableBody += '<tr>';
			let cur = arr[i]; // 0, 1, 2 etc..
			for( let key in headers )
			{
				
				let val = cur[key],
					css = key;
					
				// add negative class
				if( String(val).charAt(0) == '-' ) { css += ' negative'; } // add negative class
				else if( !val || val == 'NaN') { val = '-'; }
				else {}
				
				// add % for certain keys
				if( key.indexOf('managementFee') > -1 || key.indexOf('changePercent') > -1 || key.indexOf('Ago') > -1 || key.slice(-1) == 'p' )
				{
					if( val !== '-' )
					{
						val += '%';
					}
				}
				
				// add links to name
				if( key === 'name' )
				{
					let type = cur.instrumentType,
						uri = this.config.urls.base;
						
					if( type === 'FUND' ){ uri += this.config.links.fund + cur.id; }
					else if( type === 'EXCHANGE_TRADED_FUND' ){ uri += this.config.links.etf + cur.id; }
					else if( type === 'CERTIFICATE' ){ uri += this.config.links.cert + cur.id; }
					else if( type === 'WARRANT' ){ uri += this.config.links.warrant + cur.id; }
					else { uri += this.config.links.index + cur.id + '/' + cur.name; }
					
					val = '<a href="'+ uri +'" target="_blank">'+ val +'</a>';
				}

				tableBody += '<td class="'+ css +'">'+ val +'</td>';
				
			}
			tableBody += '</tr>';
		} // for
		
		tableBody += '</tbody></table>';
		
		// return
		callback( tableStart + tableBody );
		
	} // table()

} // class Avanza



function ymd( date ){
	let a = new Date(date);	
	let y = a.getFullYear(),
		m = a.getMonth() + 1, // zero based index
		d = a.getDate();
	
	if(m<10) m = '0' + m; // fix padding
	if(d<10) d = '0' + d;
	
	return y + '-' + m + '-' + d;
}


/* toPercent */
function toPercent(first, last){
	let calc = (first/last)-1;
	calc = calc * 100;
	calc = calc.toFixed(2);
	return calc;
}


/*
	SMA
	use: sma( <array>, <sma-value>, <key where nav is>)
*/

function sma( arr, ma, navKey ){
	
	if( Array.isArray(ma) ){
		var i=0, len=ma.length, ret;
		for(i;i<len;i++)
		{
			ret = smaLoop( arr, ma[i], navKey);
			arr = ret;
		}
	}
	else {
		arr = smaLoop( arr, ma, navKey );
	}
	
	return arr;	
}

// sma-loop, used for sma()
function smaLoop( arr, sma, navKey )
{
	sma = sma || 10;
	navKey = navKey || 1;
	
	let curSma,
		range,
		curNum = 0,
		i=0,
		arrLen = arr.length;

	for(i;i<arrLen;i++)
	{
		curSma = 0;
		
		// check if applicable (can calculate sma)
		if( i-sma > -2 ){
			
			range = arr.slice( curNum, sma+curNum );
			
			var ri=0, tot=0;
			
			// calculate total in range
			for(ri;ri<sma;ri++){
				let cur = range[ri][navKey];
				if( cur === null )  cur = undefined; // set undefined (NaN)
				tot += cur;
			}
			
			// calculate ma
			curSma = (tot/sma).toFixed(2);

			curNum++;	
		}
		
		arr[i]['date'] = ymd( arr[i][0] ); // temp: add dates
		arr[i]['SMA'+sma] = curSma;
		
	}
	
	return arr;
	
}
