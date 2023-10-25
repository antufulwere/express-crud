'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('userRoles', [{
                roleName: 'Super Admin',
                passwordType: 'password',
                isActive: true,
                isAppRole: false,
                isLocationSpecific: false,
                slug: "SUPERADMIN"
            },
            {
                roleName: 'Employee',
                passwordType: 'pin',
                isActive: true,
                isAppRole: true,
                isLocationSpecific: true,
                slug: "EMPLOYEE"
            },
            {
                roleName: 'Broker',
                passwordType: 'password',
                isActive: true,
                isAppRole: false,
                isLocationSpecific: false,
                slug: "BROKER"
            },
            {
                roleName: 'Administrator',
                passwordType: 'password',
                isActive: true,
                isAppRole: false,
                isLocationSpecific: true,
                slug: "ADMINISTRATOR"
            },
            {
                roleName: 'Supervisor',
                passwordType: 'pin',
                isActive: true,
                isAppRole: true,
                isLocationSpecific: true,
                slug: "SUPERVISOR"
            },
            {
                roleName: 'Safety Lead',
                passwordType: 'password',
                isActive: true,
                isAppRole: true,
                isLocationSpecific: true,
                slug: "SAFTEYLEAD"
            },
        ], {});
    },

    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('userRoles', null, {});

    }
};