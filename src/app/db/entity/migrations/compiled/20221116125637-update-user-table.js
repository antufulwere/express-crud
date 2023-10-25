"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'resetPasswordToken', {
        type: Sequelize.STRING,
        defaultValue: "",
      })
    ],
      [
        queryInterface.addColumn('users', 'resetPasswordSentAt', {
          type: Sequelize.DATE        })
      ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users ', 'resetPasswordToken'),
      queryInterface.removeColumn('users ', 'resetPasswordSentAt')
    ])
  }
};