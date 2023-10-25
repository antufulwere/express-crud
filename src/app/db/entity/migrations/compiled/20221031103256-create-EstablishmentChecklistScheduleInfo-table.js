
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('establishmentChecklistScheduleInfos', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      parentId: {
        allowNull: false,// fk
        type: Sequelize.INTEGER,
        references: { model: 'parentEstablishments', key: 'estParentId' }
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
      role: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'userRoles', key: 'id' }
      },
      createdOn: {
        type: Sequelize.DATE,
        default: new Date(),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('establishmentChecklistScheduleInfos');
  }
};