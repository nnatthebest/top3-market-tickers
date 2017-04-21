'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Tickers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      marketName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tickerPair: {
        type: Sequelize.STRING
      },
      tickerBuy: {
        type: Sequelize.NUMERIC
      },
      tickerSell: {
        type: Sequelize.NUMERIC
      },
      createdTime: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Tickers');
  }
};