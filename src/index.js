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
	
	
	getAllExistTickers (callback) {			
		request(this.urlInfo, (error, response, body) => {
			if (!error && response.statusCode == 200) {
				let data = JSON.parse(body);
				let keys = Object.keys(data.pairs);
				let apiUrl = keys.join('-');
				//Сформированная строка запроса
				this.urlApi = this.urlApi + apiUrl+'?ignore_invalid=1';
			}
			callback('next');
		});
	}

	getTickersValue(callback) { 
	var self = this;
		request(this.urlApi, function (error, response, body) {
			let lines = [];
			if (!error && response.statusCode == 200) {
				let data = JSON.parse(body);
				const keys = Object.keys(data);
				let dt = new Date()
				const createdTime = (dt.getTime()/1000);
				for (let k of keys) {
					let obj = data[k];
					lines.push({'marketName':self.marketName, 
								'tickerPair':k.toLowerCase(), 
								'tickerBuy':obj[self.tickerBuy], 
								'tickerSell':obj[self.tickerSell], 
								'createdTime':createdTime});
				}		
			}
			callback(lines);
		});
	}

	writeToDatabase(lines){
		lines ? '': console.log('Get value is\'t empty');
		for (let line of lines) {
			models.Tickers.create({
				marketName: line.marketName,
				tickerPair: line.tickerPair,
				tickerBuy: line.tickerBuy,
				tickerSell: line.tickerSell,
				createdTime: line.createdTime  
			});		
		}
	}
}



class marketExmo extends Tickers {
	constructor() {				
		let urlApi = 'https://api.exmo.com/v1/ticker/';
		let tickerBuy = 'buy_price';
		let tickerSell ='sell_price';
		let marketName = 'exmo';
		super('', urlApi, tickerBuy, tickerSell, marketName);			
		}
	
	make (){
		this.getTickersValue((lines)=>{
				this.writeToDatabase(lines)		
			});		
		}
	}
	
	
class marketPolonex extends Tickers {
	constructor() {				
		let urlApi = 'https://poloniex.com/public?command=returnTicker';
		let tickerBuy = 'lowestAsk';
		let tickerSell ='highestBid';
		let marketName = 'poloniex';
		super('', urlApi, tickerBuy, tickerSell, marketName);			
		}
	
	make (){
		this.getTickersValue((lines)=>{
				this.writeToDatabase(lines)		
			});		
		}
	}
	
	
class marketBtcE extends Tickers {
	constructor() {				
			let urlInfo = 'https://btc-e.nz/api/3/info';
			let urlApi = 'https://btc-e.nz/api/3/ticker/';
			let tickerBuy = 'buy';
			let tickerSell = 'sell';
			let marketName = 'btc-e';
		super(urlInfo, urlApi, tickerBuy, tickerSell, marketName);			
		}
	
	make (){
		this.getAllExistTickers(()=>{
			this.getTickersValue((lines)=>{
				this.writeToDatabase(lines);		
				});
			});
		
		}
	}

setInterval(begineInterval,30000);

function begineInterval() {
	return Promise.resolve().then(()=>{
		let btc_e = new marketBtcE();
		let poloniex = new marketPolonex();
		let exmo = new marketExmo();
		btc_e.make();
		poloniex.make();
		exmo.make();
		});
};
