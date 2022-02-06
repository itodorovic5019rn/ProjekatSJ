'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Films extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({FilmPosts}) {
      // define association here
      this.hasMany(FilmPosts, {foreignKey: "filmId", as: "filmPost", onDelete: "cascade", hooks: true});
    }
  };
  Films.init({
    naziv: DataTypes.STRING,
    prosecnaOcena: DataTypes.FLOAT,
    reziser: DataTypes.STRING,
    trajanje: DataTypes.INTEGER,
    godina: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Films',
  });
  return Films;
};