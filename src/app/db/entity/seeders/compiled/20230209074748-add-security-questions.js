"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "securityQuestions",
      [
        {
          question: "In what city were you born?",
          isActive: "true",
        },
        {
          question: "What is the name of your favorite pet?",
          isActive: "true",
        },
        {
          question: "What was the make of your first car?",
          isActive: "true",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("securityQuestions", null, {});
  },
};