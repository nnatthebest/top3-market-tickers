'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request');
var models = require('./server/models/index');

module.exports = function () {
    function Tickers() {
        var apiTicker = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var tickerBuy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var tickerSell = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        var marketName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

        _classCallCheck(this, Tickers);

        this.apiTicker = apiTicker;
        this.tickerBuy = tickerBuy;
        this.tickerSell = tickerSell;
        this.marketName = marketName;
    }

    _createClass(Tickers, [{
        key: 'getDataFromApi',
        value: function getDataFromApi(apiUrl) {
            return new Promise(function (resolve) {
                request(apiUrl, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        resolve(JSON.parse(body));
                    }
                });
            });
        }
    }, {
        key: 'getTickersValue',
        value: function getTickersValue(data) {
            var lines = [];
            var keysTickers = this.getListKey(data);
            var createdTime = this.getNowTime();

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = keysTickers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var k = _step.value;

                    var obj = data[k];

                    var tickerBuy = obj[this.tickerBuy];
                    var tickerSell = obj[this.tickerSell];

                    lines.push(this.formTickersLine(this.marketName, k, tickerBuy, tickerSell, createdTime));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return lines;
        }
    }, {
        key: 'getListKey',
        value: function getListKey(data) {
            return Object.keys(data);
        }
    }, {
        key: 'getNowTime',
        value: function getNowTime() {
            var dateNow = new Date();
            return dateNow.getTime() / 1000;
        }
    }, {
        key: 'formTickersLine',
        value: function formTickersLine(marketName, tickerPair, tickerBuy, tickerSell, createdTime) {
            return {
                'marketName': marketName,
                'tickerPair': tickerPair.toLowerCase(),
                'tickerBuy': tickerBuy,
                'tickerSell': tickerSell,
                'createdTime': createdTime
            };
        }
    }, {
        key: 'writeToDatabase',
        value: function writeToDatabase(tickers) {
            tickers ? '' : console.error('Get value isn\'t empty');
            console.log(tickers[0]);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = tickers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var ticker = _step2.value;

                    models.Tickers.create({
                        marketName: ticker.marketName,
                        tickerPair: ticker.tickerPair,
                        tickerBuy: ticker.tickerBuy,
                        tickerSell: ticker.tickerSell,
                        createdTime: ticker.createdTime
                    });
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }]);

    return Tickers;
}();