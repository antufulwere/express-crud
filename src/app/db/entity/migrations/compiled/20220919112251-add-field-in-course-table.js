"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("courses", "type", Sequelize.STRING);
    await queryInterface.changeColumn("courses", "startDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("courses", "type");
    await queryInterface.changeColumn("courses", "startDate", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  }
};