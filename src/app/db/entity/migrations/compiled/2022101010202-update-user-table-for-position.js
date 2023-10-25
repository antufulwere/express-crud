"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("users", "userPosition", {
      type: 'INTEGER USING CAST ("userPosition" as INTEGER)',
    });
  },
  async down(queryInterface) {
    await queryInterface.changeColumn("users", "userPosition", {
      type: Sequelize.STRING,
    });
  }
};