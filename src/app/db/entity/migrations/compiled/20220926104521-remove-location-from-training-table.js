"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("trainings", "location",);
  },
  async down(queryInterface) {
    await queryInterface.addColumn("trainings", "location", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  }
};