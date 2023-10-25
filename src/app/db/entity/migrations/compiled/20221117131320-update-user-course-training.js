"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userCourseTrainings", "chapterCompleted",  {
      allowNull: true,
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn("userCourseTrainings", "chapterAssign",  {
      allowNull: true,
      type: Sequelize.INTEGER
    })
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("userCourseTrainings", "chapterCompleted");
    await queryInterface.removeColumn("userCourseTrainings", "chapterAssign");
  }
};