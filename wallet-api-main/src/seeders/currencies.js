'use strict';

const moment = require('moment');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const timestamp = { created_at: now, updated_at: now };
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkDelete('currencies');
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await queryInterface.sequelize.query('ALTER TABLE currencies AUTO_INCREMENT = 1');

    const items = [
      {
        id: 1,
        name: 'Bolívar',
        name_plural: 'Bolívares',
        symbol: 'Bs.',
        is_local: 1,
        order: 1,
        ...timestamp,
      },
      {
        id: 2,
        name: 'Dólar',
        name_plural: 'Dólares',
        symbol: '$',
        is_local: 0,
        order: 2,
        ...timestamp,
      },
    ];

    return queryInterface.bulkInsert('currencies',items);
  },

  down: async (queryInterface, Sequelize) => {}
};
