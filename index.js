const express = require("express");
const ENV = require("./config");
const {db} = require("./model/index");

const app = express();

//import routes
const userRouter = require('./router/User.router')

//port
const PORT = ENV.PORT || 8889;

//Middleware
app.use(express.json())

//Prefix
app.use('/api/user', userRouter)

//Error handeling middleware
app.use((err,req,res,next)=>{
  const status = err.status || 500;
  const message = err.message || "An error occured";
  const details = err.details || null;

  res.status(status).json({
    status,
    message,
    details
  })


})

//server
const startServer = async () => {
  try {
    //sync db
    await db.sync({force: false})
    console.log(`✅ Database synced successfully`);


    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Error starting db:`, error.message);
  }
};

startServer();
