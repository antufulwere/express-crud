'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.renameColumn('schedules', 'createdAt', 'createdOn');
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.renameColumn('schedules', 'createdOn', 'createdAt');
  }
};
