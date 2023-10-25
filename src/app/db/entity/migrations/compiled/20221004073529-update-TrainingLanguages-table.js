"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("trainingLanguages", "hostingUrl", {
      allowNull: true,
      type: Sequelize.STRING
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("trainingLanguages", "hostingUrl");
  }
};