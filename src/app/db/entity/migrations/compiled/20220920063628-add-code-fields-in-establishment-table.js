"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('establishments', 'estCountryIsoCode', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('establishments', 'estCountryIsdCode', {
        type: Sequelize.STRING,
        allowNull: true,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('establishments ', 'estCountryIsoCode'),
      queryInterface.removeColumn('establishments', 'estCountryIsdCode')
    ])
  }
};