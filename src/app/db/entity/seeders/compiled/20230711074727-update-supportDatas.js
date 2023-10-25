'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate('supportDatas', {
      value: 'Comprehensive',
      slug: 'comprehensive'
    }, {
      id: 6,
    });
    await queryInterface.bulkUpdate('supportDatas', {
      value: 'Quick',
      slug: 'quick'
    }, {
      id: 7,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove all support data records
    await queryInterface.bulkDelete('supportDatas', null, {});
  }
};
