"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("securityQuestions", null, {
      truncate: true,
      cascade: true,
    });
    return await queryInterface.bulkInsert(
      "securityQuestions",
      [
        {
          id: 1,
          question: "What’s your mother’s maiden name?",
          isActive: "true",
        },
        {
          id: 2,
          question:
            "What was the name of your favorite stuffed animal as a child? ",
          isActive: "true",
        },
        {
          id: 3,
          question: "What city were you born in?",
          isActive: "true",
        },
        {
          id: 4,
          question: "What is your oldest sibling’s middle name?",
          isActive: "true",
        },
        {
          id: 5,
          question: "What was the first concert you attended?",
          isActive: "true",
        },
        {
          id: 6,
          question: "Who let the dogs out? ",
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
