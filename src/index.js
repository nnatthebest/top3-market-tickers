var Tickers = require('./tickers.js');

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
        //this.writeToDatabase(lines)  
        console.log('exmo');  
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
        //this.writeToDatabase(lines)  
        console.log('poloniex');  
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
        //this.writeToDatabase(lines);
        console.log('btc-e');
        });
      });
    
    }
  }

setInterval(begineInterval,3000);

function begineInterval() {
  return Promise.resolve().then( () => {
    let btc_e = new marketBtcE();
    btc_e.make();
    
    let poloniex = new marketPolonex();
    poloniex.make();
    
    let exmo = new marketExmo();
    exmo.make();
    });
};
