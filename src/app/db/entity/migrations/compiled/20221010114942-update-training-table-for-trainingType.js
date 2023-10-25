"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("trainings", "trainingType", {
      type: 'INTEGER USING CAST ("trainingType" as INTEGER)',
    });
  },
  async down(queryInterface) {
    await queryInterface.changeColumn("trainings", "trainingType", {
      type: Sequelize.STRING,
    });
  }
};