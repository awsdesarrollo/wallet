'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('movements', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      type_id: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0,
      },
      date: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addColumn('users', 'performance', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0,
      after: 'balance_date',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('movements');
    await queryInterface.removeColumn('users','performance');
  }
};
