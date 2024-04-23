'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'wallet', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'amount',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders','wallet');
  }
};
