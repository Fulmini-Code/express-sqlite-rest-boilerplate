const { Knex } = require("knex");

/**
 *
 * @param {Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists("posts", function (table) {
    table.increments();
    table.string("title",100).notNullable();
    table.text('body');
    table.string("author",100).notNullable();
  });
};

/**
 *
 * @param {Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("posts");
};
