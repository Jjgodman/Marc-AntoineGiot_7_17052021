'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Post);
      models.User.hasMany(models.Commentaire)
    }
  };
  User.init({
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    admin: { type: DataTypes.BOOLEAN, default: false }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};