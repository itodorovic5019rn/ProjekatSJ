'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Serijas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({SerijaPosts}) {
      // define association here
      this.hasMany(SerijaPosts, {foreignKey: "serijaId", as: "serijaPost", onDelete: "cascade", hooks: true});
    }
  };
  Serijas.init({
    naziv: DataTypes.STRING,
    prosecnaOcena: DataTypes.FLOAT,
    reziser: DataTypes.STRING,
    sezone: DataTypes.INTEGER,
    godina: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Serijas',
  });
  return Serijas;
};