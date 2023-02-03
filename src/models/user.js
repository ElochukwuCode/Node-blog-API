import bcrypt from "bcrypt";
import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, { foreignKey: "userId" });
      User.hasMany(models.Comment, { foreignKey: "userId" });
      User.hasMany(models.Follow, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      hooks: {
        afterCreate: (user, options) => {
          delete user.dataValues.password;
        },
        afterUpdate: (user, options) => {
          delete user.dataValues.password;
        },
      },
      sequelize,
      modelName: "User",
    }
  );

  User.beforeSave(async (user, options) => {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
  });

  return User;
};
