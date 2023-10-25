"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("supportDatas", "slug",  {
      allowNull: true,
      type: Sequelize.STRING
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("supportDatas", "slug");
  }
};