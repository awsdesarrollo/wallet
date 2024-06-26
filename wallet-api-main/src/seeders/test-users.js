'use strict';

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkDelete('users');
    await queryInterface.bulkDelete('orders');
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await queryInterface.sequelize.query('ALTER TABLE users AUTO_INCREMENT = 1');
    await queryInterface.sequelize.query('ALTER TABLE orders AUTO_INCREMENT = 1');

    const defaultFields = {
      password: bcrypt.hashSync('123456', salt),
      level_id: 2,
      verified: 1,
      status: 1,
    };

    const users = [
      {
        id: 1,
        email: 'admin@mail.com',
        name: 'Admin',
        created_at: '2023-06-12 15:03:29',
        updated_at: '2023-06-12 15:03:29',
        ...defaultFields,
        level_id: 1,
      },
      {
        id: 2,
        email: 'quinten77@yahoo.com',
        name: 'Jeramy',
        last_name: 'Daugherty',
        phone: '04128498416',
        created_at: '2023-01-04 10:27:26',
        updated_at: '2023-01-04 10:27:26',
        ...defaultFields,
      },
      {
        id: 3,
        email: 'dessie1@yahoo.com',
        name: 'Macie',
        last_name: 'Abbott',
        phone: '04145541847',
        created_at: '2023-07-22 07:56:16',
        updated_at: '2023-07-22 07:56:16',
        ...defaultFields,
      },
      {
        id: 4,
        email: 'dallas.tremblay@gmail.com',
        name: 'Reed',
        last_name: 'Gerhold',
        phone: '04147864511',
        created_at: '2023-09-04 01:28:20',
        updated_at: '2023-09-04 01:28:20',
        ...defaultFields,
      },
      {
        id: 5,
        email: 'nickolas_stark10@gmail.com',
        name: 'Guy',
        last_name: 'Torphy',
        phone: '04248198621',
        created_at: '2023-11-13 11:30:26',
        updated_at: '2023-11-13 11:30:26',
        ...defaultFields,
      },
      {
        id: 6,
        email: 'hudson7@hotmail.com',
        name: 'Elena',
        last_name: 'Bruen',
        phone: '04248188348',
        created_at: '2023-02-08 18:23:57',
        updated_at: '2023-02-08 18:23:57',
        ...defaultFields,
      },
      {
        id: 7,
        email: 'coby.weber@yahoo.com',
        name: 'Gia',
        last_name: 'Rempel',
        phone: '04242309964',
        created_at: '2023-11-24 10:05:11',
        updated_at: '2023-11-24 10:05:11',
        ...defaultFields,
      },
      {
        id: 8,
        email: 'caleb_willms@gmail.com',
        name: 'Lillie',
        last_name: 'Reichert',
        phone: '04144880477',
        created_at: '2023-02-10 08:14:54',
        updated_at: '2023-02-10 08:14:54',
        ...defaultFields,
      },
      {
        id: 9,
        email: 'marty_ohara37@gmail.com',
        name: 'Cory',
        last_name: 'Wolf',
        phone: '04144711460',
        created_at: '2023-06-11 10:27:19',
        updated_at: '2023-06-11 10:27:19',
        ...defaultFields,
      },
      {
        id: 10,
        email: 'abby_kohler60@yahoo.com',
        name: 'Collin',
        last_name: 'Barton',
        phone: '04241981613',
        created_at: '2023-07-27 00:28:54',
        updated_at: '2023-07-27 00:28:54',
        ...defaultFields,
      },
      {
        id: 11,
        email: 'dusty_feeney70@gmail.com',
        name: 'Bridget',
        last_name: 'Mann',
        phone: '04146009145',
        created_at: '2023-04-06 11:01:43',
        updated_at: '2023-04-06 11:01:43',
        ...defaultFields,
      },
      {
        id: 12,
        email: 'susana.dubuque51@hotmail.com',
        name: 'Aglae',
        last_name: 'Bayer',
        phone: '04149048976',
        created_at: '2023-11-19 16:49:04',
        updated_at: '2023-11-19 16:49:04',
        ...defaultFields,
      },
      {
        id: 13,
        email: 'morris_lehner99@yahoo.com',
        name: 'Marge',
        last_name: 'Muller',
        phone: '04244762852',
        created_at: '2023-12-28 06:35:46',
        updated_at: '2023-12-28 06:35:46',
        ...defaultFields,
      },
      {
        id: 14,
        email: 'arlene_bartoletti@gmail.com',
        name: 'Mia',
        last_name: 'O\'Keefe',
        phone: '04242219542',
        created_at: '2023-03-04 11:50:15',
        updated_at: '2023-03-04 11:50:15',
        ...defaultFields,
      },
      {
        id: 15,
        email: 'fatima5@gmail.com',
        name: 'Rossie',
        last_name: 'Williamson',
        phone: '04245266729',
        created_at: '2023-06-22 07:03:14',
        updated_at: '2023-06-22 07:03:14',
        ...defaultFields,
      },
      {
        id: 16,
        email: 'enos.pfeffer@yahoo.com',
        name: 'Reinhold',
        last_name: 'Crooks',
        phone: '04247491674',
        created_at: '2023-02-22 17:41:24',
        updated_at: '2023-02-22 17:41:24',
        ...defaultFields,
      },
      {
        id: 17,
        email: 'zaria75@hotmail.com',
        name: 'Cary',
        last_name: 'Ferry',
        phone: '04244500890',
        created_at: '2023-03-07 20:45:53',
        updated_at: '2023-03-07 20:45:53',
        ...defaultFields,
      },
      {
        id: 18,
        email: 'verdie_gutmann68@gmail.com',
        name: 'Haylie',
        last_name: 'Thompson',
        phone: '04248518696',
        created_at: '2023-07-16 12:40:11',
        updated_at: '2023-07-16 12:40:11',
        ...defaultFields,
      },
      {
        id: 19,
        email: 'nakia20@gmail.com',
        name: 'Arnold',
        last_name: 'Daugherty',
        phone: '04144129107',
        created_at: '2023-08-18 08:09:27',
        updated_at: '2023-08-18 08:09:27',
        ...defaultFields,
      },
      {
        id: 20,
        email: 'wilson.leuschke46@yahoo.com',
        name: 'Twila',
        last_name: 'Gusikowski',
        phone: '04246750890',
        created_at: '2023-01-03 18:56:55',
        updated_at: '2023-01-03 18:56:55',
        ...defaultFields,
      },
      {
        id: 21,
        email: 'nathen_dicki@yahoo.com',
        name: 'Aniyah',
        last_name: 'Quigley',
        phone: '04243724845',
        created_at: '2023-07-19 02:35:58',
        updated_at: '2023-07-19 02:35:58',
        ...defaultFields,
      },
      {
        id: 22,
        email: 'ethelyn_jacobs90@yahoo.com',
        name: 'Forrest',
        last_name: 'Prohaska',
        phone: '04143727422',
        created_at: '2023-01-15 09:12:09',
        updated_at: '2023-01-15 09:12:09',
        ...defaultFields,
      },
      {
        id: 23,
        email: 'tevin_howell@yahoo.com',
        name: 'Justice',
        last_name: 'Fisher',
        phone: '04244377895',
        created_at: '2023-01-05 21:32:00',
        updated_at: '2023-01-05 21:32:00',
        ...defaultFields,
      },
    ];
    await queryInterface.bulkInsert('users',users);
  },

  down: async (queryInterface, Sequelize) => {}
};
