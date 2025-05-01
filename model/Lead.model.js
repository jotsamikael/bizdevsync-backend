const {DataTypes} = require('sequelize')
const db = require('../config/db')


//Define model using sequelize
const Lead = db.define('Lead',{
    assignedToUser:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    descrption:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    logo:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'placeholder'
    },
    country:{
        type: DataTypes.STRING,
        allowNull: false
    },
    activitySector:{
        type: DataTypes.STRING,
        allowNull: false
    },
    is_private:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
    } 

},{
    timeTemps:true, //add the created date and updated date
    underscored: true //enables snake case
})

module.exports = Lead