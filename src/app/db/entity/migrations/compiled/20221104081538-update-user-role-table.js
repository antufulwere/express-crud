"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('userRoles', 'isLocationSpecific', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      })
    ],
      [
        queryInterface.addColumn('userRoles', 'slug', {
          type: Sequelize.STRING,
          defaultValue: "",
        })
      ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('userRoles ', 'isLocationSpecific'),
      queryInterface.removeColumn('userRoles ', 'slug')
    ])
  }
};