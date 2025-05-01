const Sequelize = require('sequelize')
const ENV = require("./index");

console.log('Initialization of connection to mysql')

const db = new Sequelize(ENV.DATABASE,ENV.USER,ENV.PASSWORD,{
host: ENV.HOST,
dialect: ENV.DIALECT,
port: ENV.PORT_DATABASE,
logging: false
})

//connection function

const connection = async()=>{
    try {
       
        console.log(`Connection Attempt`)
        await db.authenticate();
        console.log(`👌Connection to mysql succeeded`)

    
    } catch (error) {
        console.log(`X Error connecting to db:`, error.message)
    }
}

connection();

module.exports = db;