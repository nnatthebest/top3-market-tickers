'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request');
var models = require('./server/models/index');

module.exports = function () {
    function Tickers() {
        var urlInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var urlApi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var tickerBuy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        var tickerSell = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
        var marketName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

        _classCallCheck(this, Tickers);

        this.urlInfo = urlInfo;
        this.urlApi = urlApi;
        this.tickerBuy = tickerBuy;
        this.tickerSell = tickerSell;
        this.marketName = marketName;
    }

    _createClass(Tickers, [{
        key: 'getAllExistTickers',
        value: function getAllExistTickers() {
            var _this = this;

            return new Promise(function (resolve) {
                request(_this.urlInfo, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var data = JSON.parse(body);

                        var keys = Object.keys(data.pairs);
                        var apiUrl = keys.join('-');
                        _this.urlApi = _this.urlApi + apiUrl + '?ignore_invalid=1';
                    }
                    resolve(_this.urlApi);
                });
            });
        }
    }, {
        key: 'getTickersValue',
        value: function getTickersValue() {
            var _this2 = this;

            return new Promise(function (resolve) {
                request(_this2.urlApi, function (error, response, body) {
                    var lines = [];

                    if (!error && response.statusCode == 200) {
                        var data = JSON.parse(body);
                        var keysTickers = Object.keys(data);

                        var dateNow = new Date();
                        var createdTime = dateNow.getTime() / 1000;

                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = keysTickers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var k = _step.value;

                                var obj = data[k];

                                lines.push({ 'marketName': _this2.marketName,
                                    'tickerPair': k.toLowerCase(),
                                    'tickerBuy': obj[_this2.tickerBuy],
                                    'tickerSell': obj[_this2.tickerSell],
                                    'createdTime': createdTime
                                });
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
                    }
                    resolve(lines);
                });
            });
        }
    }, {
        key: 'writeToDatabase',
        value: function writeToDatabase(lines) {
            return new Promise(function () {
                lines ? '' : console.error('Get value isn\'t empty');

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = lines[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var line = _step2.value;

                        models.Tickers.create({
                            marketName: line.marketName,
                            tickerPair: line.tickerPair,
                            tickerBuy: line.tickerBuy,
                            tickerSell: line.tickerSell,
                            createdTime: line.createdTime
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
            });
        }
    }]);

    return Tickers;
}();