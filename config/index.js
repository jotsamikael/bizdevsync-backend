const dotenv = require('dotenv')

dotenv.config();

const ENV = {
    PORT: process.env.PORT,
    HOST:process.env.HOST,
    USER: process.env.USER,
    PASSWORD:process.env.PASSWORD,
    DATABASE:process.env.DATABASE,
    DIALECT: process.env.DIALECT,
    TOKEN:process.env.TOKEN,
    PORT_DATABASE: process.env.PORT_DATABASE,
    BETTERSTACK_TOKEN: process.env.BETTERSTACK_TOKEN

}

module.exports = ENV;