'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      comment.belongsTo(models.article, {
        as: "article",
        foreignKey: {
          name: "idArticle",
        },
      });
      comment.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });
    }
  }
  comment.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};