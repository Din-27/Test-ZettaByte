'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      article.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "idUser",
        },
      });
      article.hasMany(models.comment, {
        as: "comment",
        foreignKey: {
          name: "idArticle",
        },
      });
    }
  }
  article.init({
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    published: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'article',
  });
  return article;
};