"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('userChecklistInfos', 'markAbsent', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('userChecklistInfos ', 'markAbsent')
    ])
  }
};