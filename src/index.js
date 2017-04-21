var request = require('request');
var models = require('./server/models/index');

const apiBtcE ={urlInfo:'https://btc-e.nz/api/3/info',
				url:'https://btc-e.nz/api/3/ticker/',
				tickerBuy:'buy',
				tickerSell:'sell',
				marketName:'btc-e' 
				};
const apiPoloniex ={url:'https://poloniex.com/public?command=returnTicker',
				tickerBuy:'lowestAsk',
				tickerSell:'highestBid',
				marketName:'poloniex' 
				};
const apiExmo ={url:'https://api.exmo.com/v1/ticker/',
				tickerBuy:'buy_price',
				tickerSell:'sell_price',
				marketName:'exmo' 
				};

setInterval(begineInterval,30000);


function begineInterval() {
  return new Promise(function (resolve, reject) {
    resolve(setData());
  })
};

function setData(){
	getTickersBtcE(apiBtcE,function(lines){
		toDatabase(lines)
	});		
	getTickersValue(apiExmo,function(lines){
		toDatabase(lines)
	});

	getTickersValue(apiPoloniex,function(lines){
		toDatabase(lines)
	});	

};		

function toDatabase(lines){
	for (line of lines) {
		models.Tickers.create({
			marketName: line.marketName,
			tickerPair: line.tickerPair,
			tickerBuy: line.tickerBuy,
			tickerSell: line.tickerSell,
			createdTime: line.createdTime
			
						}).then(function(user) {
						res.json(user);
						});		
	}

}

//Îáåðòêà äëÿ ôîðìèðîâàíèÿ çàïðîñà API btc_e
function getTickersBtcE(api,callback){	
	request(api.urlInfo, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);
			let keys = Object.keys(info.pairs);
			let apiUrl = keys.join('-');
			//Ñôîðìèðîâàííàÿ ñòðîêà çàïðîñà
			api.url = api.url + apiUrl+'?ignore_invalid=1';
			getTickersValue(api,function(lines){
				callback(lines)
			});	
				
			
		}
	});
};

//Ïàðñåð òèêåðîâ ñ ïîäãîòîâêîé ìàññèâà äëÿ çàïèñè â ÁÄ
function getTickersValue(api,callback) { 
	request(api.url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);
			const keys = Object.keys(info);
			const tickerBuy = api.tickerBuy;
			const tickerSell = api.tickerSell;
			const lines=[];
			let dt = new Date()
			const createdTime_ = (dt.getTime()/1000);
			
			for (let k of keys) {
				let obj = info[k];
				let marketName_ = api.marketName; //Íàçâàíèå ðûíêà
				let tickerPair_ = k;          // Ïàðà
				let tickerBuy_ = obj[tickerBuy];    //Öåíà ïîêóïêè
				let tickerSell_ = obj[tickerSell];  //Öåíà ïðîäàæè
				lines.push({'marketName':marketName_, 
							'tickerPair':tickerPair_, 
							'tickerBuy':tickerBuy_, 
							'tickerSell':tickerSell_, 
							'createdTime':createdTime_});
			}
		callback(lines);
			
		}
	});
};



