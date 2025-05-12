const express = require("express");
const ENV = require("./config");
const {db} = require("./model/index");
const cookieParser = require('cookie-parser');
const path = require('path');
const pinoHttp = require("pino-http");
const logger = require("./controller/utils/logger.utils");



const app = express();

//import routes
const userRouter = require('./router/User.router')
const leadRouter = require('./router/Lead.router');

const planRouter =  require('./router/Plan.router');
const gatewayRouter = require('./router/Gateway.router');
const orderRouter = require('./router/Order.router');
const ProductCategoryRouter =  require('./router/ProductCategory.router');
const ProductRouter =  require('./router/Product.router');
const EnterpriseRouter =  require('./router/Enterprise.router');
const ContactRouter =  require('./router/Contact.router');
const MeetingRouter =  require('./router/Meeting.router');
const ActivityRouter =  require('./router/Activity.router');
const FollowupRouter =  require('./router/Followup.router');








//port
const PORT = ENV.PORT || 8889;

app.use(express.json())
app.use(cookieParser());
app.use('/storage', express.static(path.join(__dirname, 'storage')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));


// Load swagger
const setupSwagger = require('./controller/utils/swagger');
setupSwagger(app);


//log http requests
//app.use(pinoHttp({ logger }));

//Prefix
app.use('/api/user', userRouter)
app.use('/api/plans', planRouter);
app.use('/api/gateways', gatewayRouter);
app.use('/api/orders', orderRouter);
app.use('/api/leads', leadRouter);
app.use('/api/productCategories', ProductCategoryRouter);

app.use('/api/products', ProductRouter);
app.use('/api/enterprises', EnterpriseRouter);
app.use('/api/contacts', ContactRouter);

app.use('/api/meetings', MeetingRouter);
app.use('/api/activities', ActivityRouter);
app.use('/api/followups', FollowupRouter);









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
    logger.info("✅  Database synced successfully");


    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Error starting db:`, error.message);
    logger.info(`Error starting db ${error.message}`);

  }
};

startServer();
