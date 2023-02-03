import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Follow.belongsTo(models.User, {
        onDelete: "CASCADE",
        foreignKey: "userId",
      });
    }
  }
  Follow.init(
    {
      userId: DataTypes.INTEGER,
      followedId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Follow",
    }
  );
  return Follow;
};
