
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      taskHeader: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      taskDescription: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      taskType:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      taskThumbnail:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      isDeleted:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
  }
};