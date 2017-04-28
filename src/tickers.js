var request = require('request');
var models = require('./server/models/index');

module.exports = class Tickers {
  constructor(urlInfo = '', urlApi = '',  tickerBuy = '',
        tickerSell = '', marketName = ''){
      
    this.urlInfo = urlInfo;
    this.urlApi = urlApi;
    this.tickerBuy = tickerBuy;
    this.tickerSell = tickerSell;
    this.marketName = marketName;
  }
  
  
  getAllExistTickers(callback) {      
    request(this.urlInfo, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let data = JSON.parse(body);
        let keys = Object.keys(data.pairs);
        let apiUrl = keys.join('-');
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
        const keysTickers = Object.keys(data);
        let dateNow = new Date()
        const createdTime = (dateNow.getTime()/1000);
        for (let k of keysTickers) {
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