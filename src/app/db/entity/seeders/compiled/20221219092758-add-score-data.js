'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('supportDatas', [{
      key: 'foundationWeightage',
      value: '1000',
      slug: "1000"
    }], {});
    await queryInterface.bulkInsert('supportDatas', [{
      key: 'microWeightage',
      value: '1000',
      slug: "1000"
    }], {});
    await queryInterface.bulkInsert('supportDatas', [{
      key: 'checklistWeightage',
      value: '1000',
      slug: "1000"
    }], {});
    await queryInterface.bulkInsert('supportDatas', [{
      key: 'formWeightage',
      value: '1000',
      slug: "1000"
    }], {});
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('supportDatas', null, {});

  }
};