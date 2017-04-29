var request = require('request');
var models = require('./server/models/index');

module.exports = class Tickers {
    constructor(urlInfo = '', urlApi = '',  tickerBuy = '',
        tickerSell = '', marketName = '') {
      
        this.urlInfo = urlInfo;
        this.urlApi = urlApi;
        this.tickerBuy = tickerBuy;
        this.tickerSell = tickerSell;
        this.marketName = marketName;
    }
  
    getAllExistTickers() {      
        return new Promise( (resolve, reject) => {   
            request(this.urlInfo, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let data = JSON.parse(body);

                    let keys = Object.keys(data.pairs);
                    let apiUrl = keys.join('-');
                    this.urlApi = this.urlApi + apiUrl +'?ignore_invalid=1';
                }
                resolve(this.urlApi);
            });
        });
    }

    getTickersValue() {
        return new Promise( (resolve, reject) => { 
            request(this.urlApi,  (error, response, body) => {
                let lines = [];

                if (!error && response.statusCode == 200) {
                    let data = JSON.parse(body);
                    const keysTickers = Object.keys(data);

                    let dateNow = new Date();
                    const createdTime = (dateNow.getTime()/1000);

                    for (let k of keysTickers) {
                        let obj = data[k];

                        lines.push({ 'marketName' : this.marketName, 
                            'tickerPair' : k.toLowerCase(), 
                            'tickerBuy' : obj[ this.tickerBuy ], 
                            'tickerSell' : obj[ this.tickerSell ], 
                            'createdTime': createdTime
                        });
                    }    
                }
                resolve(lines);
            });
        });

    }

    writeToDatabase(lines) {
        return new Promise( (resolve, reject) => { 
            lines ? '': console.error('Get value isn\'t empty');
            console.log(lines[0]);;

            for (let line of lines) {
                    models.Tickers.create({
                   marketName: line.marketName,
                    tickerPair: line.tickerPair,
                    tickerBuy: line.tickerBuy,
                    tickerSell: line.tickerSell,
                    createdTime: line.createdTime  
                });    
            }
        });

    }

};