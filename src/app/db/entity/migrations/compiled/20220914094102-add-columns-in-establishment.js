"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("establishments", "estFeedbackEmailId", Sequelize.STRING,);
    await queryInterface.addColumn("establishments", "estBrandName", Sequelize.STRING);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("establishments", "estFeedbackEmailId");
    await queryInterface.removeColumn("establishments", "estBrandName");
  }
};