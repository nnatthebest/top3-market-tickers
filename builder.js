var request = require('request');
var models = require('./server/models/index');


class Tickers {
	
	constructor(urlInfo = '', urlApi = '',	tickerBuy = 'buy',
				tickerSell = 'sell', marketName = ''){
			
		this.urlInfo = urlInfo;
		this.urlApi = urlApi;
		this.tickerBuy = tickerBuy;
		this.tickerSell = tickerSell;
		this.marketName = marketName;
		this.lines = [];
	}
	
	getAllExistTickers () {	
		
		request(this.urlInfo, this, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				let data = JSON.parse(body);
				let keys = Object.keys(data.pairs);
				let apiUrl = keys.join('-');
				//Сформированная строка запроса
				this.UrlApi = this.urlApi + apiUrl+'?ignore_invalid=1';
				return this.UrlApi;
			}
		});
	}

	getTickersValue() { 
		request(this.urlApi, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				let data = JSON.parse(body);
				//console.log(data);
				const keys = Object.keys(data);
				let dt = new Date()
				const createdTime = (dt.getTime()/1000);
				this.lines = [];
				for (let k of keys) {
					let obj = data[k];
					this.lines.push({'marketName':this.marketName, 
								'tickerPair':k, 
								'tickerBuy':obj[this.tickerBuy], 
								'tickerSell':obj[this.tickerSell], 
								'createdTime':createdTime});
				}				
				//console.log(this.lines);
			}
		});
	}

	writeToDatabase(){
		this.lines ? '': console.log('Выполните функцию getTickersValue()');
		for (line of this.lines) {
			models.Tickers.create({
				marketName: line.marketName,
				tickerPair: line.tickerPair,
				tickerBuy: line.tickerBuy,
				tickerSell: line.tickerSell,
				createdTime: line.createdTime  
			});		
		}
	}
	
	
	get Lines(){
		console.log(this.lines);
		
	}
	get UrlApi(){
		console.log(`${this.urlApi}`);
		
	}
	set UrlApi(value){
		this.urlApi = value;
	}
}


const tic = new Tickers('https://btc-e.nz/api/3/info','https://btc-e.nz/api/3/ticker/',
				'buy','sell', 'btc-e');

tic.UrlApi;


tic.getAllExistTickers();
tic.getTickersValue();
tic.UrlApi;
