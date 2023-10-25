'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('forms', [{
        formName: 'I2P2'
      },
      {
        formName: 'Hazard'
      }
    ], {});
    await queryInterface.bulkInsert('supportDatas', [{
      key: 'formDueDays',
      value: '90',
      slug: "90"
    }], {});
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('forms', null, {});

  }
};