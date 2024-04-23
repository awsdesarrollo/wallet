'use strict';

const moment = require('moment');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const timestamp = { created_at: now, updated_at: now };
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkDelete('config');
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await queryInterface.sequelize.query('ALTER TABLE config AUTO_INCREMENT = 1');

    const items = [
      {
        id: 1,
        app_android_version: '0.1.0',
        app_ios_version: '0.1.0',
        ...timestamp,
      },
    ];

    return queryInterface.bulkInsert('config',items);
  },

  down: async (queryInterface, Sequelize) => {}
};
