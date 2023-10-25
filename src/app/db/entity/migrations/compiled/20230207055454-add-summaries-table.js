'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('summaries', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      userId: {
        allowNull: false, // fk
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      field: {
        allowNull: true,
        type: Sequelize.STRING
      },
      updatedValue: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      createdOn: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('summaries');
  }
};
