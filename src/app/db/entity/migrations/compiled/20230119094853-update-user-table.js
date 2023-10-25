"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
        queryInterface.addColumn('users', 'textBox', {
          type: Sequelize.STRING,
          defaultValue: "",
        })
      ],
      [
        queryInterface.addColumn('users', 'isChecked', {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        })
      ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users ', 'textBox'),
      queryInterface.removeColumn('users ', 'isChecked')
    ])
  }
};