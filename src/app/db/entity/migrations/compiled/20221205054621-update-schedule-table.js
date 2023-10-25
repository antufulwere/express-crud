"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("schedules", "createdAt",  {
      allowNull: true,
      type: Sequelize.DATE
    })
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("schedules", "createdAt");
  }
};
