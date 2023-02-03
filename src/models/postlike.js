const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostLike.belongsTo(models.Post, {
        onDelete: "CASCADE",
        foreignKey: "postId",
      });
    }
  }
  PostLike.init(
    {
      userId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PostLike",
    }
  );
  return PostLike;
};
