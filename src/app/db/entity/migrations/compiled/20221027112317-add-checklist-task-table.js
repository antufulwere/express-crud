
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('checklistTasks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      taskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tasks', key: 'id' }
      },
      checklistId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'checklists', key: 'id' }
      },
      sequence: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('checklistTasks');
  }
};