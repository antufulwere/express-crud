'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('users', [{
            "userFirstName": "Admin",
            "userLastName": "Systango",
            "userEmailId": "admin@arrowup.com",
            "userPosition": 4,
            "userRoleId": 1,
            "password": "$2b$10$PtsOtzKerVQnbqtCZVnoG.tEvaiRiQYhBpps0rWzW1kVrSB9Qh7/a",
            "countryIsoCode": "US",
            "countryIsdCode": "+1",
            "isActive": true,
            "createdOn": new Date(),
            "userName": "Admin-Systango-admin@arrowup.com",
            "isDeleted": false
        }], {});
    },
    async down(queryInterface, Sequelize) {

        await queryInterface.bulkDelete('users', null, {});

    }
};