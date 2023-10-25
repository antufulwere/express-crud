"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("courses", "seqNumber",  {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    });
    await queryInterface.changeColumn("courses", "courseId",  {
      type: Sequelize.BIGINT
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("courses", "seqNumber");
    await queryInterface.changeColumn("courses", "courseId",  {
      type: Sequelize.INTEGER
    });
  }
};