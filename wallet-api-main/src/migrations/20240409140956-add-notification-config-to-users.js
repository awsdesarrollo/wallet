'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'notification_config', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'default',
      after: 'photo',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users','notification_config');
  }
};
