"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn('users', '2FAKey', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: false
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn('users', '2FAKey', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
      })
    ])
  }
};