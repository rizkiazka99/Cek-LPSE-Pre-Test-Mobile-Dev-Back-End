'use strict';
const {
  Model
} = require('sequelize');
const { encryptPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        user.password = encryptPassword(user.password),
        user.profile_picture = user.gender == 'Male' 
              ? 'https://cdn-icons-png.flaticon.com/512/5556/5556468.png'
              : 'https://cdn-icons-png.flaticon.com/512/7127/7127281.png'
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};