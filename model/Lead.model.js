const {DataTypes} = require('sequelize')
const db = require('../config/db')


//Define model using sequelize
const Lead = db.define('Lead',{
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status:{
        type: DataTypes.STRING, //Enum: UNQUALIFIED, QUALIFIED, CONVERTED
        allowNull: false,
        defaultValue: 'UNQUALIFIED'
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    website:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    address:{
        type: DataTypes.STRING,
        allowNull: true,
    },
     town:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    tags:{
        type: DataTypes.STRING,
        allowNull: true,
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