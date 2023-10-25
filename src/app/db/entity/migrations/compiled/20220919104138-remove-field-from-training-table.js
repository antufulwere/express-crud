"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("trainings", "isMandatory");
  },

  async down(queryInterface) {
    await queryInterface.addColumn("trainings", "isMandatory", Sequelize.BOOLEAN);
  }
};