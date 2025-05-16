const {DataTypes} = require('sequelize')
const db = require('../config/db')


//Define model using sequelize
const Lead = db.define('Lead',{
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    logo:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'placeholder'
    },
    activitySector:{
        type: DataTypes.STRING,
        allowNull: false
    },
    is_private:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
    },

    is_archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }   
},

{
    timeTemps:true, //add the created date and updated date
    underscored: true //enables snake case
})

module.exports = Lead