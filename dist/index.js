'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tickers = require('./tickers.js');

setInterval(marketsDirector, 30000);

function marketsDirector() {
    return Promise.resolve().then(function () {
        var btc_e = new marketBtcE();
        btc_e.builderTickers();

        var poloniex = new marketPolonex();
        poloniex.builderTickers();

        var exmo = new marketExmo();
        exmo.builderTickers();
    });
}

var marketExmo = function (_Tickers) {
    _inherits(marketExmo, _Tickers);

    function marketExmo() {
        _classCallCheck(this, marketExmo);

        var apiTicker = 'https://api.exmo.com/v1/ticker/';
        var tickerBuy = 'buy_price';
        var tickerSell = 'sell_price';
        var marketName = 'exmo';

        return _possibleConstructorReturn(this, (marketExmo.__proto__ || Object.getPrototypeOf(marketExmo)).call(this, apiTicker, tickerBuy, tickerSell, marketName));
    }

    _createClass(marketExmo, [{
        key: 'builderTickers',
        value: function builderTickers() {
            var _this2 = this;

            this.getDataFromApi(this.apiTicker).then(function (data) {
                var tickers = _this2.getTickersValue(data);
                _this2.writeToDatabase(tickers);
            });
        }
    }]);

    return marketExmo;
}(Tickers);

var marketPolonex = function (_Tickers2) {
    _inherits(marketPolonex, _Tickers2);

    function marketPolonex() {
        _classCallCheck(this, marketPolonex);

        var apiTicker = 'https://poloniex.com/public?command=returnTicker';
        var tickerBuy = 'lowestAsk';
        var tickerSell = 'highestBid';
        var marketName = 'poloniex';

        return _possibleConstructorReturn(this, (marketPolonex.__proto__ || Object.getPrototypeOf(marketPolonex)).call(this, apiTicker, tickerBuy, tickerSell, marketName));
    }

    _createClass(marketPolonex, [{
        key: 'builderTickers',
        value: function builderTickers() {
            var _this4 = this;

            this.getDataFromApi(this.apiTicker).then(function (data) {
                var tickers = _this4.getTickersValue(data);
                _this4.writeToDatabase(tickers);
            });
        }
    }]);

    return marketPolonex;
}(Tickers);

var marketBtcE = function (_Tickers3) {
    _inherits(marketBtcE, _Tickers3);

    function marketBtcE() {
        _classCallCheck(this, marketBtcE);

        var apiTicker = 'https://btc-e.nz/api/3/ticker/';
        var tickerBuy = 'buy';
        var tickerSell = 'sell';
        var marketName = 'btc-e';

        var _this5 = _possibleConstructorReturn(this, (marketBtcE.__proto__ || Object.getPrototypeOf(marketBtcE)).call(this, apiTicker, tickerBuy, tickerSell, marketName));

        _this5.urlInfo = 'https://btc-e.nz/api/3/info';
        return _this5;
    }

    _createClass(marketBtcE, [{
        key: 'builderTickers',
        value: function builderTickers() {
            var _this6 = this;

            this.getDataFromApi(this.urlInfo).then(function (data) {
                _this6.formUrlApiTicker(data);
                _this6.getDataFromApi(_this6.apiTicker).then(function (data) {
                    var tickers = _this6.getTickersValue(data);
                    _this6.writeToDatabase(tickers);
                });
            });
        }
    }, {
        key: 'formUrlApiTicker',
        value: function formUrlApiTicker(data) {
            var joinedTickers = this.joinGetTickers(this.getListKeyApiInfo(data));
            this.apiTicker = this.addTickersTailToUrl(this.apiTicker, joinedTickers);
        }
    }, {
        key: 'getListKeyApiInfo',
        value: function getListKeyApiInfo(data) {
            return Object.keys(data.pairs);
        }
    }, {
        key: 'joinGetTickers',
        value: function joinGetTickers(keys) {
            return keys.join('-');
        }
    }, {
        key: 'addTickersTailToUrl',
        value: function addTickersTailToUrl(urlApi, tail) {
            return urlApi = urlApi + tail + '?ignore_invalid=1';
        }
    }]);

    return marketBtcE;
}(Tickers);