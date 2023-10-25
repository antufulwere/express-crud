"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('userChecklistInfos', 'completedOn', {
        type: Sequelize.DATE,
        allowNull: true,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('userChecklistInfos ', 'completedOn')
    ])
  }
};