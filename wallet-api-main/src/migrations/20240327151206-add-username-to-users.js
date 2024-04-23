'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'username', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'email',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users','username');
  }
};
