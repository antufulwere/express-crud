
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userChecklistInfos', {
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
      sequence:{
        allowNull: true,// fk
        type: Sequelize.INTEGER,
      },
      estId: {
        allowNull: true,// fk
        type: Sequelize.BIGINT,
        references: { model: 'establishments', key: 'estIdentifyingKey' }
      },
      scheduleId: {
        allowNull: false,// fk
        type: Sequelize.INTEGER,
        references: { model: 'schedules', key: 'id' }
      },
      checklistId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'checklists', key: 'id' }
      },
      scheduledStartDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      scheduledEndDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      taskId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'tasks', key: 'id' }
      },
      type:{
        allowNull: true,
        type: Sequelize.STRING,
      },
      updatedOn: {
        type: Sequelize.DATE,
        default: new Date(),
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        default: true,
      },
      checklistResponse: {
        type: Sequelize.STRING,
        default: "",
      },
      createdOn: {
        type: Sequelize.DATE,
        default: new Date(),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('userChecklistInfos');
  }
};