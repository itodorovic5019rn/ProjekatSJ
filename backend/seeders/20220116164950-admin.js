'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const bcrypt = require('bcrypt');

    await queryInterface.bulkInsert('Users', [{
        username: 'admin',
        firstname: 'admin',
        lastname: 'admin',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('admin',10),
        role: 'admin'
    }], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
