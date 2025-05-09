const {DataTypes} = require('sequelize')
const db = require('../config/db')
const { underscoredIf } = require('sequelize/lib/utils')


//Define model using sequelize
const User = db.define('User',{
    first_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name:{
        type: DataTypes.STRING,
        allowNull: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    avatar:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'placeholder'
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    is_activated:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
    },
    is_verified:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:'user',
        validate:{
            isIn:[['user','solo_biz_dev','enterprise_admin','admin','operator']]
        }
    },
    will_expire: {
        type: DataTypes.DATE,
        allowNull: true
    }

},{
    timeTemps:true, //add the created date and updated date
    underscored: true //enables snake case
})

module.exports = User