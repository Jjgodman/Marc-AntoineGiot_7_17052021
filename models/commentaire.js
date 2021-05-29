'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commentaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Commentaire.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      })
      models.Commentaire.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  };
  Commentaire.init({
    message: DataTypes.STRING,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Commentaire',
  });
  return Commentaire;
};