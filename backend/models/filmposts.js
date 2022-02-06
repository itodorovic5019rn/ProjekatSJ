'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FilmPosts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({Users, Films}) {
           // define association here
           this.belongsTo(Users, {foreignKey: "userId", as: "user"});
           this.belongsTo(Films, {foreignKey: "filmId", as: "film"});
      }
  };
  FilmPosts.init({
    ocena: DataTypes.FLOAT,
    komentar: DataTypes.STRING,
    preporuka: DataTypes.BOOLEAN,
    lajk: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FilmPosts',
  });
  return FilmPosts;
};