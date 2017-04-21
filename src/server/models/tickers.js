'use strict';
module.exports = function(sequelize, DataTypes) {
  var Tickers = sequelize.define('Tickers', {
    marketName: DataTypes.STRING,
    tickerPair: DataTypes.STRING,
    tickerBuy: DataTypes.NUMERIC,
    tickerSell: DataTypes.NUMERIC,
    createdTime: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Tickers;
};