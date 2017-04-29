'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tickers = require('./tickers.js');

setInterval(begineInterval, 3000);

function begineInterval() {
    return Promise.resolve().then(function () {
        var btc_e = new marketBtcE();
        btc_e.make();

        var poloniex = new marketPolonex();
        poloniex.make();

        var exmo = new marketExmo();
        exmo.make();
    });
}

var marketExmo = function (_Tickers) {
    _inherits(marketExmo, _Tickers);

    function marketExmo() {
        _classCallCheck(this, marketExmo);

        var urlApi = 'https://api.exmo.com/v1/ticker/';
        var tickerBuy = 'buy_price';
        var tickerSell = 'sell_price';
        var marketName = 'exmo';

        return _possibleConstructorReturn(this, (marketExmo.__proto__ || Object.getPrototypeOf(marketExmo)).call(this, '', urlApi, tickerBuy, tickerSell, marketName));
    }

    _createClass(marketExmo, [{
        key: 'make',
        value: function make() {
            var _this2 = this;

            this.getTickersValue().then(function (result) {
                _this2.writeToDatabase(result);
            });
        }
    }]);

    return marketExmo;
}(Tickers);

var marketPolonex = function (_Tickers2) {
    _inherits(marketPolonex, _Tickers2);

    function marketPolonex() {
        _classCallCheck(this, marketPolonex);

        var urlApi = 'https://poloniex.com/public?command=returnTicker';
        var tickerBuy = 'lowestAsk';
        var tickerSell = 'highestBid';
        var marketName = 'poloniex';

        return _possibleConstructorReturn(this, (marketPolonex.__proto__ || Object.getPrototypeOf(marketPolonex)).call(this, '', urlApi, tickerBuy, tickerSell, marketName));
    }

    _createClass(marketPolonex, [{
        key: 'make',
        value: function make() {
            var _this4 = this;

            this.getTickersValue().then(function (result) {
                _this4.writeToDatabase(result);
            });
        }
    }]);

    return marketPolonex;
}(Tickers);

var marketBtcE = function (_Tickers3) {
    _inherits(marketBtcE, _Tickers3);

    function marketBtcE() {
        _classCallCheck(this, marketBtcE);

        var urlInfo = 'https://btc-e.nz/api/3/info';
        var urlApi = 'https://btc-e.nz/api/3/ticker/';
        var tickerBuy = 'buy';
        var tickerSell = 'sell';
        var marketName = 'btc-e';

        return _possibleConstructorReturn(this, (marketBtcE.__proto__ || Object.getPrototypeOf(marketBtcE)).call(this, urlInfo, urlApi, tickerBuy, tickerSell, marketName));
    }

    _createClass(marketBtcE, [{
        key: 'make',
        value: function make() {
            var _this6 = this;

            this.getAllExistTickers().then(function (result) {
                _this6.getTickersValue().then(function (result) {
                    _this6.writeToDatabase(result);
                });
            });
        }
    }]);

    return marketBtcE;
}(Tickers);