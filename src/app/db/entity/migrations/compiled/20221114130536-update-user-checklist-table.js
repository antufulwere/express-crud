"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userChecklistInfos", "isCompleted", {
      allowNull: true,
      type: Sequelize.BOOLEAN
    })
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("userChecklistInfos", "isCompleted");
  }
};