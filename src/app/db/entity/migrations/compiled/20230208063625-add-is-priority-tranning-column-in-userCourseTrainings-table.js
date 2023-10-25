"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userCourseTrainings", "isPriorityTraining", {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("userCourseTrainings", "isPriorityTraining");
  },
};
