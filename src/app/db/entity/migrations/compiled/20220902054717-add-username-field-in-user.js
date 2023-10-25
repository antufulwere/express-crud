'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("users", "userName", {
      allowNull: true,
        type: Sequelize.STRING,
    });
  },

  async down(queryInterface) {
    return queryInterface.removeColumn("users", "userName");
  }
};