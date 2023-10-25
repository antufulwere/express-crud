"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("userAnswers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      questionId: {
        allowNull: false, // fk
        type: Sequelize.INTEGER,
        references: { model: "securityQuestions", key: "id" },
      },
      userId: {
        allowNull: false, // fk
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
      },
      answer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdOn: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("userAnswers");
  },
};
