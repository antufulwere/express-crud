'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("userEstablishments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false, // fk
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
      },
      estId: {
        allowNull: false,// fk
        type: Sequelize.BIGINT,
        references: { model: 'establishments', key: 'estIdentifyingKey' }
      },
      createdOn: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("userEstablishments");
  }
};
