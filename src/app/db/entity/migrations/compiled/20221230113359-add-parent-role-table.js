module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('parentRoles', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true
            },
            parentId: {
                allowNull: true, // fk
                type: Sequelize.INTEGER,
                references: {
                    model: 'parentEstablishments',
                    key: 'estParentId'
                }
            },
            userRoleId: {
                allowNull: true, // fk
                type: Sequelize.INTEGER,
                references: {
                    model: 'userRoles',
                    key: 'id'
                }
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('parentRoles');
    }
};