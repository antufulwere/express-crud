"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("trainingLanguages", "language", {
      type: 'INTEGER USING CAST ("language" as INTEGER)',
    });
  },
  async down(queryInterface) {
    await queryInterface.changeColumn("trainingLanguages", "language", {
      type: Sequelize.STRING,
    });
  }
};
