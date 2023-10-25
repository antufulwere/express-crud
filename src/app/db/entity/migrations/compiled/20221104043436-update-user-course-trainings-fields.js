"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userCourseTrainings", "trainingSequence", {
      allowNull: true,
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn("userCourseTrainings", "dueBeforeDays", {
      allowNull: true,
      type: Sequelize.INTEGER
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("userCourseTrainings", "trainingSequence");
    await queryInterface.removeColumn("userCourseTrainings", "dueBeforeDays");
  }
};