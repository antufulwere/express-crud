"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userCourseTrainings", "markAbsent",  {
      allowNull: true,
      type: Sequelize.BOOLEAN
    })
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("userCourseTrainings", "markAbsent");
  }
};