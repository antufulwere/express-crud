
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('courseTrainings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      trainingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      trainingSequence: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dueBeforeDays: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        default: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('courseTrainings');
  }
};