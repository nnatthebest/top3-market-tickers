'use strict';

var request = require('request');
var models = require('./server/models/index');

var apiBtcE = { urlInfo: 'https://btc-e.nz/api/3/info',
	url: 'https://btc-e.nz/api/3/ticker/',
	tickerBuy: 'buy',
	tickerSell: 'sell',
	marketName: 'btc-e'
};
var apiPoloniex = { url: 'https://poloniex.com/public?command=returnTicker',
	tickerBuy: 'lowestAsk',
	tickerSell: 'highestBid',
	marketName: 'poloniex'
};
var apiExmo = { url: 'https://api.exmo.com/v1/ticker/',
	tickerBuy: 'buy_price',
	tickerSell: 'sell_price',
	marketName: 'exmo'
};

setInterval(begineInterval, 10000);

function begineInterval() {
	return new Promise(function (resolve, reject) {
		resolve(setData());
	});
};

function setData() {
	getTickersBtcE(apiBtcE, function (lines) {
		toDatabase(lines);
	});
	getTickersValue(apiExmo, function (lines) {
		toDatabase(lines);
	});

	getTickersValue(apiPoloniex, function (lines) {
		toDatabase(lines);
	});
};

function toDatabase(lines) {
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			line = _step.value;

			models.Tickers.create({
				marketName: line.marketName,
				tickerPair: line.tickerPair,
				tickerBuy: line.tickerBuy,
				tickerSell: line.tickerSell,
				createdTime: line.createdTime

			}).then(function (user) {
				res.json(user);
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

//������� ��� ������������ ������� API btc_e
function getTickersBtcE(api, callback) {
	request(api.urlInfo, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			var keys = Object.keys(info.pairs);
			var apiUrl = keys.join('-');
			//�������������� ������ �������
			api.url = api.url + apiUrl + '?ignore_invalid=1';
			getTickersValue(api, function (lines) {
				callback(lines);
			});
		}
	});
};

//������ ������� � ����������� ������� ��� ������ � ��
function getTickersValue(api, callback) {
	request(api.url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			var keys = Object.keys(info);
			var tickerBuy = api.tickerBuy;
			var tickerSell = api.tickerSell;
			var lines = [];
			var dt = new Date();
			var createdTime_ = dt.getTime() / 1000;

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var k = _step2.value;

					var obj = info[k];
					var marketName_ = api.marketName; //�������� �����
					var tickerPair_ = k; // ����
					var tickerBuy_ = obj[tickerBuy]; //���� �������
					var tickerSell_ = obj[tickerSell]; //���� �������
					lines.push({ 'marketName': marketName_,
						'tickerPair': tickerPair_,
						'tickerBuy': tickerBuy_,
						'tickerSell': tickerSell_,
						'createdTime': createdTime_ });
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

			callback(lines);
		}
	});
};