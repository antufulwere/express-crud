"use strict";

module.exports = {
  async up (queryInterface,Sequelize) {
    await queryInterface.addColumn("users", "estIdentifyingKey", Sequelize.BIGINT,);
  },

  async down (queryInterface) {
    await  queryInterface.removeColumn("users", "estIdentifyingKey");
  }
};