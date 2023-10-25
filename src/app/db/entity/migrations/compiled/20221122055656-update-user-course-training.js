"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userCourseTrainings", "resumeSession",  {
      allowNull: true,
      type: Sequelize.JSON
    })
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("userCourseTrainings", "resumeSession");
  }
};