var Tickers = require('./tickers.js');

setInterval(marketsDirector,30000);

function marketsDirector() {
    return Promise.resolve().then( () => {
        let btc_e = new marketBtcE();
        btc_e.builderTickers();
        
        let poloniex = new marketPolonex();
        poloniex.builderTickers();
    
        let exmo = new marketExmo();
        exmo.builderTickers();

    });
}

class marketExmo extends Tickers {
    constructor() {        
        let apiTicker = 'https://api.exmo.com/v1/ticker/';
        let tickerBuy = 'buy_price';
        let tickerSell ='sell_price';
        let marketName = 'exmo';

        super(apiTicker, tickerBuy, tickerSell, marketName);      
    }

    builderTickers() {
        this.getDataFromApi(this.apiTicker).then( data => {
            let tickers = this.getTickersValue(data);
            this.writeToDatabase(tickers);
        });    
    }
}


class marketPolonex extends Tickers {
    constructor() { 
        let apiTicker = 'https://poloniex.com/public?command=returnTicker';
        let tickerBuy = 'lowestAsk';
        let tickerSell ='highestBid';
        let marketName = 'poloniex';

        super(apiTicker, tickerBuy, tickerSell, marketName);      
    }

    builderTickers() {
        this.getDataFromApi(this.apiTicker).then( data => {
            let tickers = this.getTickersValue(data);
            this.writeToDatabase(tickers);
        });    
    }
}

class marketBtcE extends Tickers {
    constructor() { 
        let apiTicker = 'https://btc-e.nz/api/3/ticker/';
        let tickerBuy = 'buy';
        let tickerSell = 'sell';
        let marketName = 'btc-e';

        super(apiTicker, tickerBuy, tickerSell, marketName);

        this.urlInfo = 'https://btc-e.nz/api/3/info';        
    }    
    
    builderTickers() {
        this.getDataFromApi(this.urlInfo)

            .then( data => {
                this.formUrlApiTicker(data);
                this.getDataFromApi(this.apiTicker)

                    .then( data => {
                        let tickers = this.getTickersValue(data);
                        this.writeToDatabase(tickers);
                    });
            });   
    }

    formUrlApiTicker(data){
        let joinedTickers = this.joinGetTickers( this.getListKeyApiInfo(data) );
        this.apiTicker = this.addTickersTailToUrl(this.apiTicker, joinedTickers);
    }

    getListKeyApiInfo(data) {
        return Object.keys(data.pairs);
    }

    joinGetTickers(keys) {
        return keys.join('-');
    }

    addTickersTailToUrl(urlApi, tail){
        return urlApi = urlApi + tail +'?ignore_invalid=1';
    }
}
