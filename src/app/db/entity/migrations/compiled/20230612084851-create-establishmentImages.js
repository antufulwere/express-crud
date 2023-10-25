
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('establishmentImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      estId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      imageKey: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('establishmentImages');
  }
};