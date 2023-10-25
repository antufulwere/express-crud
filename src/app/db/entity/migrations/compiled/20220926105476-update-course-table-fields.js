"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('courses');
    await queryInterface.createTable('courses', {
      courseName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        default: false
      },
      createdOn: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('courses');
    await queryInterface.createTable('courses', {
      courseId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      courseName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      courseType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dueBeforeDays: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      createdOn: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  }
};