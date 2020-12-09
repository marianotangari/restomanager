const Sequelize = require("sequelize");
const host = "localhost";
const port = "3306";
const username = "root";
const password = "";

const path = `mysql://${username}:${password}@${host}:${port}/` + name;

const sequelize = new Sequelize(path);
const dependencies = { Sequelize: Sequelize,
    sequelize: sequelize };


module.exports = dependencies;