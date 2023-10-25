
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('establishmentFormInfos', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      parentId: {
        allowNull: true,// fk
        type: Sequelize.INTEGER,
        references: { model: 'parentEstablishments', key: 'estParentId' }
      },
      estId: {
        allowNull: true,// fk
        type: Sequelize.BIGINT,
        references: { model: 'establishments', key: 'estIdentifyingKey' }
      },
      formId: {
        allowNull: true,// fk
        type: Sequelize.INTEGER,
        references: { model: 'forms', key: 'formId' }
      },
      dueDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      formData: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      completionDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      formUrl: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      completedBy: {
        allowNull: true,// fk
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('establishmentFormInfos');
  }
};