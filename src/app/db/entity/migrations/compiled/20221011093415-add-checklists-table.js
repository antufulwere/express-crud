
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('checklists', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true 
      },
      checklistName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdOn:{
        type: Sequelize.DATE,
        allowNull: false,
      },
      isDeleted:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('checklists');
  }
};