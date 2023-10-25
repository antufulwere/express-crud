
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('establishmentCourseInfos', {
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      estId: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      courseId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdOn: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('establishmentCourseInfos');
  }
};