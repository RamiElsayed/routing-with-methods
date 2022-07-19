const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const connection = require('../config/connection');

class User extends Model {
  checkPassword(userPassword) {
    // TODO: Complete the instance method
  }
}


const schema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8],
    },
  },
};

const options =  {
  hooks: {
    beforeCreate: async (newUserData) => {
      newUserData.password = await bcrypt.hash(newUserData.password, 10);
      return newUserData;
    },
    beforeUpdate: async (updatedUserData) => {
      updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
      return updatedUserData;
    },
  },
  connection,
  timestamps: false,
  freezeTableName: true,
  underscored: true,
  modelName: 'user',
}
User.init( schema, options );

module.exports = User;
