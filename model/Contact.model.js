const {DataTypes} = require('sequelize')
const db = require('../config/db')


//Define model using sequelize
const Contact = db.define('Contact',{
    assignedToUser:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    first_name:{
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    last_name:{
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    email:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    position:{ //position held by contact within company
        type: DataTypes.STRING, 
        allowNull: true,
    },
    language:{
        type: DataTypes.STRING, //json object to possibly store multiple languages
        allowNull: false
    },
    notes:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
   

},{
    timestamps:true, //add the created date and updated date
  tableName: 'contact',
})

module.exports = Contact