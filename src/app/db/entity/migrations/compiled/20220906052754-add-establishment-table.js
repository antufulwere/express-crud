
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('establishments', {
      estIdentifyingKey: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      estName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estEmailId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      estContactNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      addressLine1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      deletedOn: {
        type: Sequelize.DATE,
        allowNull: true
      },
      addressLine2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdOn: {
        type: Sequelize.DATE,
        allowNull: true
      },
      zipcode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      estParentId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('establishments');
  }
};