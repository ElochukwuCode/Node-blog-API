import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {
        onDelete: "CASCADE",
        foreignKey: "userId",
      });
      Comment.belongsTo(models.Post, {
        onDelete: "CASCADE",
        foreignKey: "postId",
      });
      Comment.hasMany(models.CommentLike, { foreignKey: "commentId" });
    }
  }
  Comment.init(
    {
      comment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
