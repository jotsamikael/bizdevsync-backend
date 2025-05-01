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
    weight:{ //how decisive is he/she on a scale of 0-5
        type: DataTypes.FLOAT,
        allowNull: true,
      
    },
    position:{ //position held by contact within company
        type: DataTypes.STRING, 
        allowNull: true,
       
    },
    language:{
        type: DataTypes.JSON, //json object to possibly store multiple languages
        allowNull: false
    },
    notes:{
        type: DataTypes.TEXT,
        allowNull: true
    },
   

},{
    timeTemps:true, //add the created date and updated date
    underscored: true //enables snake case
})

module.exports = Contact