'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request');
var models = require('./server/models/index');

var Tickers = function () {
	function Tickers() {
		var urlInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
		var urlApi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
		var tickerBuy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'buy';
		var tickerSell = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'sell';
		var marketName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

		_classCallCheck(this, Tickers);

		this.urlInfo = urlInfo;
		this.urlApi = urlApi;
		this.tickerBuy = tickerBuy;
		this.tickerSell = tickerSell;
		this.marketName = marketName;
		this.lines = [];
	}

	_createClass(Tickers, [{
		key: 'getAllExistTickers',
		value: function getAllExistTickers(callback) {
			var _this = this;

			request(this.urlInfo, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var data = JSON.parse(body);
					var keys = Object.keys(data.pairs);
					var apiUrl = keys.join('-');
					//Сформированная строка запроса
					_this.urlApi = _this.urlApi + apiUrl + '?ignore_invalid=1';
				}
				callback('next');
			});
		}
	}, {
		key: 'getTickersValue',
		value: function getTickersValue(callback) {
			var self = this;
			request(this.urlApi, function (error, response, body) {
				var lines = [];
				if (!error && response.statusCode == 200) {
					var data = JSON.parse(body);
					var keys = Object.keys(data);
					var dt = new Date();
					var createdTime = dt.getTime() / 1000;
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var k = _step.value;

							var obj = data[k];
							lines.push({ 'marketName': self.marketName,
								'tickerPair': k.toLowerCase(),
								'tickerBuy': obj[self.tickerBuy],
								'tickerSell': obj[self.tickerSell],
								'createdTime': createdTime });
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
				callback(lines);
			});
		}
	}, {
		key: 'writeToDatabase',
		value: function writeToDatabase(lines) {
			lines ? '' : console.log('Get value is\'t empty');
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
		}
	}]);

	return Tickers;
}();

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
			var _this3 = this;

			this.getTickersValue(function (lines) {
				_this3.writeToDatabase(lines);
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
			var _this5 = this;

			this.getTickersValue(function (lines) {
				_this5.writeToDatabase(lines);
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
			var _this7 = this;

			this.getAllExistTickers(function () {
				_this7.getTickersValue(function (lines) {
					_this7.writeToDatabase(lines);
				});
			});
		}
	}]);

	return marketBtcE;
}(Tickers);

setInterval(begineInterval, 30000);

function begineInterval() {
	return Promise.resolve().then(function () {
		var btc_e = new marketBtcE();
		var poloniex = new marketPolonex();
		var exmo = new marketExmo();
		btc_e.make();
		poloniex.make();
		exmo.make();
	});
};