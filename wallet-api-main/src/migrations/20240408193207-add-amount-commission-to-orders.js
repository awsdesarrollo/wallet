'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('orders','amount_commission', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true,
      after: 'amount',
    });

    await queryInterface.sequelize.query(`UPDATE orders SET amount_commission = (amount * 0.98) WHERE payment_method_id = 1`);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders','amount_commission');
  }
};
