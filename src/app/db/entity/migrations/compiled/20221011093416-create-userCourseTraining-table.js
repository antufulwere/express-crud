
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userCourseTrainings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      userId: {
        allowNull: false,// fk
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }
      },
      estId: {
        allowNull: true,// fk
        type: Sequelize.BIGINT,
        references: { model: 'establishments', key: 'estIdentifyingKey' }
      },
      courseId: {
        allowNull: false,// fk
        type: Sequelize.INTEGER,
        references: { model: 'courses', key: 'id' }
      },
      trainingId: {
        allowNull: false,// fk
        type: Sequelize.INTEGER,
        references: { model: 'trainings', key: 'trainingId' }
      },
      scheduledStartDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      scheduledEndDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      isCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      startedOn: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      completedOn: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      lastAccessedOn: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      durationCompleted: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      trainingmonth: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      updatedOn: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      trainingStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      modifiedBy: {
        allowNull: true,// fk
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('userCourseTrainings');
  }
};