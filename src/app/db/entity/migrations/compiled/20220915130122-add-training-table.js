
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trainings', {
      trainingId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      trainingName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      trainingDescription: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      trainingType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      trainingURL: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      trainingThumbnail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      trainingDuration: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      trainingDuration: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      location: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isMandatory: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('trainings');
  }
};