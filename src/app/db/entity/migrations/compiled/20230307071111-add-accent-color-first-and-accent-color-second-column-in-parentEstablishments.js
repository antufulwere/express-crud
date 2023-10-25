"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("parentEstablishments", "accentColorFirst", {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "#0568ff",
      }),
      queryInterface.addColumn("parentEstablishments", "accentColorSecond", {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "#eb6b6b",
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn("parentEstablishments ", "accentColorFirst"),
      queryInterface.removeColumn("parentEstablishments ", "accentColorSecond"),
    ]);
  },
};
