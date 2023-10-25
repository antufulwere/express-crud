
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('forms', {
      formId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      formName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isDeleted: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('forms');
  }
};