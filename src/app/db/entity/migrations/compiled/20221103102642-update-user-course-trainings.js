"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userCourseTrainings", "courseTrainingType",  {
      allowNull: true,
      type: Sequelize.STRING
    });
    await queryInterface.addColumn("userCourseTrainings", "trainingType",  {
      allowNull: true,
      type: Sequelize.STRING
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("userCourseTrainings", "courseTrainingType");
    await queryInterface.removeColumn("userCourseTrainings", "trainingType");
  }
};