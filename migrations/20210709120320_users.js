const { Knex } = require("knex");

/**
 *
 * @param {Knex} knex
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists("users", function (table) {
        table.increments();
        table.string("username").notNullable();
        table.string("email").notNullable();
        table.string("password").notNullable();
        table.boolean("isActive").notNullable();
        table.boolean("isAdmin").notNullable();
      });
};

/**
 *
 * @param {Knex} knex
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("users");
  
};
