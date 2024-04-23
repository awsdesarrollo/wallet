'use strict';

const moment = require('moment');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const timestamp = { created_at: now, updated_at: now };
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkDelete('levels');
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await queryInterface.sequelize.query('ALTER TABLE levels AUTO_INCREMENT = 1');

    const items = [
      {
        id: 1,
        name: 'Administrador',
        ...timestamp,
      },
      {
        id: 2,
        name: 'Titular',
        ...timestamp,
      },
      {
        id: 3,
        name: 'Beneficiario',
        ...timestamp,
      }
    ];

    return queryInterface.bulkInsert('levels',items);
  },

  down: async (queryInterface, Sequelize) => {}
};
