
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trainingLanguages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      trainingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      language: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      trainingThumbnail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      trainingURL: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('trainingLanguages');
  }
};