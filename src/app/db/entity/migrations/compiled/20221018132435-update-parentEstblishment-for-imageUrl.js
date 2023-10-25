"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('parentEstablishments', 'imageLink', {
        type: Sequelize.STRING,
        defaultValue: true,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('parentEstablishments ', 'imageLink')
    ])
  }
};