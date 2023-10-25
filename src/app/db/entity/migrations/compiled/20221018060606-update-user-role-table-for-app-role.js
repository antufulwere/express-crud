"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('userRoles', 'isAppRole', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('userRoles ', 'isAppRole')
    ])
  }
};