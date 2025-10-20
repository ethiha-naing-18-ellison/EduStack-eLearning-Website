const { Sequelize } = require("sequelize");
require("dotenv").config();

// Use SQLite for development if PostgreSQL is not available
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
  define: {
    timestamps: true,
    underscored: false
  }
});

module.exports = sequelize;
