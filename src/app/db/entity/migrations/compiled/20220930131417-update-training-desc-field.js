"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("trainings", "trainingDescription", {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },
  async down(queryInterface) {
    await queryInterface.changeColumn("trainings", "trainingDescription", {
      allowNull: false,
      type: Sequelize.STRING,
    });
  }
};