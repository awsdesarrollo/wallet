'use strict';

const moment = require('moment');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const timestamp = { created_at: now, updated_at: now };
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkDelete('payment_methods');
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await queryInterface.sequelize.query('ALTER TABLE payment_methods AUTO_INCREMENT = 1');

    const items = [
      {
        id: 1,
        name: 'Efectivo',
        currency_id: 2,
        order: 1,
        ...timestamp,
      },
      {
        id: 2,
        name: 'Wallet',
        currency_id: 1,
        order: 2,
        ...timestamp,
      },
    ];

    return queryInterface.bulkInsert('payment_methods',items);
  },

  down: async (queryInterface, Sequelize) => {}
};
