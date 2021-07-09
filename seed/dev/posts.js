const { Knex } = require("knex");

const mockData = require("../mock_data_posts.json");

/**
 *
 * @param {Knex} knex
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("posts")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("posts").insert([...mockData]);
    });
};
