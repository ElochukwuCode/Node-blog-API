"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommentLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CommentLike.belongsTo(models.Comment, {
        onDelete: "CASCADE",
        foreignKey: "commentId",
      });
    }
  }
  CommentLike.init(
    {
      userId: DataTypes.ARRAY(DataTypes.INTEGER),
      commentId: DataTypes.INTEGER,
      likeCount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CommentLike",
    }
  );
  return CommentLike;
};
