'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SerijaPosts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({Users, Serijas}) {
      // define association here
      this.belongsTo(Users, {foreignKey: "userId", as: "user"});
      this.belongsTo(Serijas, {foreignKey: "serijaId", as: "serija"});
    }
  };
  SerijaPosts.init({
    ocena: DataTypes.FLOAT,
    komentar: DataTypes.STRING,
    preporuka: DataTypes.BOOLEAN,
    lajk: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SerijaPosts',
  });
  return SerijaPosts;
};