'use strict';

const moment = require('moment');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const timestamp = { created_at: now, updated_at: now };
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkDelete('users');
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await queryInterface.sequelize.query('ALTER TABLE users AUTO_INCREMENT = 1');

    const items = [
      {
        id: 1,
        email: 'admin@mail.com',
        password: bcrypt.hashSync('123456', salt),
        level_id: 1,
        verified: 1,
        status: 1,
        ...timestamp,
      },
    ];
    return queryInterface.bulkInsert('users',items);
  },

  down: async (queryInterface, Sequelize) => {}
};
