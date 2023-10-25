"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("trainings", "trainingURL");
    await queryInterface.removeColumn("trainings", "trainingThumbnail");
    await queryInterface.removeColumn("trainings", "duration");
    await queryInterface.removeColumn("trainings", "language");
  },
  async down(queryInterface) {
    await queryInterface.addColumn("trainings", "trainingURL", {
      allowNull: false,
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("trainings", "trainingThumbnail", {
      allowNull: true,
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("trainings", "duration", {
      allowNull: true,
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("trainings", "language", {
      allowNull: true,
      type: Sequelize.STRING
    });
  }
};