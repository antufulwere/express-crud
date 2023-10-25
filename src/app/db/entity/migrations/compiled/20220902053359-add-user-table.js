
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userFirstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userLastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userEmailId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userContactNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userPosition: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
      },
      userDateOfJoining: {
        allowNull: true,
        type: Sequelize.DATE
      },
      isActive: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      isDeleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      createdOn: {
        allowNull: true,
        type: Sequelize.DATE
      },
      userRoleId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};