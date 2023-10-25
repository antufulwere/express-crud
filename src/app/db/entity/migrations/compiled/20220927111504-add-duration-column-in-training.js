"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("trainings", "duration",  {
      allowNull: true,
      type: Sequelize.STRING
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("trainings", "duration");
  }
};