
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parentEstablishments', {
      estParentId: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      estParentName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdOn: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('parentEstablishments');
  }
};