import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Post.hasMany(models.Comment, { foreignKey: "postId" });
      Post.hasMany(models.PostLike, { foreignKey: "postId" });
    }
  }
  Post.init(
    {
      title: DataTypes.STRING,
      snippet: DataTypes.STRING,
      body: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
