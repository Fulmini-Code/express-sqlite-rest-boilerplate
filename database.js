const knex = require('knex');

const knexFile = require('./knexfile').development;

const db = knex.knex(knexFile);

module.exports = db;
