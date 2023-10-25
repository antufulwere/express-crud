
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('checklistSchedules', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      scheduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'schedules', key: 'id' }
      },
      checklistId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'checklists', key: 'id' }
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('checklistSchedules');
  }
};