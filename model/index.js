const db = require('../config/db')

//import models
const User = require('./User.model');
const Activation = require('./Activation.model')
const Enterprise = require('./Enterprise.model');
const Lead = require('./Lead.model');
const Followup = require('./Followup.model');
const Business = require('./Business.model');
const Meeting = require('./Meeting.model');
const Contact = require('./Contact.model');
const Activity = require('./Activity.model');
const Competitor = require('./Competitor.model');
const CompetitorHasBusiness = require('./CompetitorHasBusiness.model');
const ContactHasMeeting = require('./ContactHasMeeting.model');
const Product = require('./Product.model');
const ProductCategory = require('./ProductCategory');
const Country = require('./Country.model');
const Region = require('./Region.model.js');
const Plan = require('./Plan.model.js')
const Order = require('./Oder.model.js')
const Gateway = require('./Gateway.model.js')
const PasswordReset = require('./ResetPassword.model.js')
const Source = require('./Source.model.js')




// ===============
// Activity Relationships
// ===============
Activity.belongsTo(User,{foreignKey:'_idUser'})
User.hasMany(Activity,{foreignKey:'_idUser'})


// ===============
// Source Relationships
// ===============
Lead.belongsTo(Source,{foreignKey:'_idSource'})
Source.hasMany(Lead,{foreignKey:'_idSource'})

Source.belongsTo(User,{foreignKey:'_idUser'})
User.hasMany(Source,{foreignKey:'_idUser'})

// ===============
// Enterprise Relationships
// ===============
Enterprise.belongsTo(Country,{foreignKey:'Country_idCountry'})
Country.hasMany(Enterprise,{foreignKey:'Country_idCountry'})


// ===============
// Country Relationships
// ===============
Country.belongsTo(Region,{foreignKey: 'Region_idRegion'});
Region.hasMany(Country,{foreignKey: 'Region_idRegion'})


// ===============
// User Relationships
// ===============

// User belongs to Enterprise (nullable for solobizdevs)
User.belongsTo(Enterprise, { foreignKey: 'Enterprise_idEnterprise' });
Enterprise.hasMany(User, { foreignKey: 'Enterprise_idEnterprise' });

User.hasMany(Activation, { foreignKey: 'user_id' });
Activation.belongsTo(User, { foreignKey: 'user_id' });

// ===============
// Lead Relationships
// ===============

// Lead created by User
Lead.belongsTo(User, { as: 'creator', foreignKey: 'created_by_user_id' });
User.hasMany(Lead, { as: 'createdLeads', foreignKey: 'created_by_user_id' });

// Lead assigned to User (bizdev)
Lead.belongsTo(User, { as: 'assignee', foreignKey: 'assigned_to_user_id' });
User.hasMany(Lead, { as: 'assignedLeads', foreignKey: 'assigned_to_user_id' });

// Lead belongs to Enterprise
Lead.belongsTo(Enterprise, { foreignKey: 'Enterprise_idEnterprise' });
Enterprise.hasMany(Lead, { foreignKey: 'Enterprise_idEnterprise' });

// Lead belongs to Country
Lead.belongsTo(Country, { foreignKey: 'Country_idCountry' });
Country.hasMany(Lead, { foreignKey: 'Country_idCountry' });

// ===============
// Contact Relationships
// ===============

// Contact belongs to Lead
Contact.belongsTo(Lead, { foreignKey: 'Lead_idLead' });
Lead.hasMany(Contact, { foreignKey: 'Lead_idLead' });

// Contact belongs to Country
Contact.belongsTo(Country, { foreignKey: 'Country_idCountry' });
Country.hasMany(Contact, { foreignKey: 'Country_idCountry' });

// ===============
// Followup Relationships
// ===============

// Followup belongs to Lead
Followup.belongsTo(Lead, { foreignKey: 'Lead_idLead' });
Lead.hasMany(Followup, { foreignKey: 'Lead_idLead' });

// Followup can have multiple Activities
Followup.hasMany(Activity, { foreignKey: 'Followup_idFollowup' });
Activity.belongsTo(Followup, { foreignKey: 'Followup_idFollowup' });

// Followup can have multiple Meetings
Followup.hasMany(Meeting, { foreignKey: 'Followup_idFollowup' });
Meeting.belongsTo(Followup, { foreignKey: 'Followup_idFollowup' });

// ===============
// Business Relationships
// ===============

// Business is created from Lead
Business.belongsTo(Lead, { foreignKey: 'Lead_idLead' });
Lead.hasOne(Business, { foreignKey: 'Lead_idLead' });

// Business belongs to User (creator/owner)
Business.belongsTo(User, { foreignKey: 'created_by_user_id' });
User.hasMany(Business, { foreignKey: 'created_by_user_id' });

// Business has many Activities
Business.hasMany(Activity, { foreignKey: 'Business_idBusiness' });
Activity.belongsTo(Business, { foreignKey: 'Business_idBusiness' });

// Business has many Meetings
Business.hasMany(Meeting, { foreignKey: 'Business_idBusiness' });
Meeting.belongsTo(Business, { foreignKey: 'Business_idBusiness' });

// ===============
// Meeting Relationships
// ===============

// Meeting has many Contacts (Many-to-Many)
Meeting.belongsToMany(Contact, {
  through: ContactHasMeeting,
  foreignKey: 'meeting_idMeeting',
  otherKey: 'contact_idContact'
});
Contact.belongsToMany(Meeting, {
  through: ContactHasMeeting,
  foreignKey: 'contact_idContact',
  otherKey: 'meeting_idMeeting'
});

//User can have many meetings
Meeting.belongsTo(User,{foreignKey: '_idUser'});
User.hasMany(Meeting,{foreignKey: '_idUser'});


// ===============
// Competitor Relationships
// ===============

//Competitor is created by user
Competitor.belongsTo(User,{foreignKey: '_idUser'})
User.hasMany(Competitor,{foreignKey: '_idUser'});


// Business has many Competitors (Many-to-Many)
Business.belongsToMany(Competitor, {
  through: CompetitorHasBusiness,
  foreignKey: 'Bus_idBusiness',
  otherKey: 'Compe_idCompetitor'
});
Competitor.belongsToMany(Business, {
  through: CompetitorHasBusiness,
  foreignKey: 'Compe_idCompetitor',
  otherKey: 'Bus_idBusiness'
});

// ===============
// Product Relationships (if applicable)
// ===============
// Product belongs to ProductCategory
Product.belongsTo(ProductCategory, { foreignKey: 'ProductCategory_idProductCategory' });
ProductCategory.hasMany(Product, { foreignKey: 'ProductCategory_idProductCategory' });

// Product belongs to User
ProductCategory.belongsTo(User, { foreignKey: 'User_idUser' });
User.hasMany(ProductCategory, { foreignKey: 'User_idUser' });

// Product belongs to User
Product.belongsTo(User, { foreignKey: 'User_idUser' });
User.hasMany(Product, { foreignKey: 'User_idUser' });

// Subscription and Orders
User.belongsTo(Plan, { foreignKey: 'plan_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.belongsTo(Gateway, { foreignKey: 'gateway_id' });
Order.belongsTo(Plan, { foreignKey: 'plan_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Plan.hasMany(Order, { foreignKey: 'plan_id' });
Gateway.hasMany(Order, { foreignKey: 'gateway_id' });


//Enterprise plan
Enterprise.belongsTo(Plan, { foreignKey: 'plan_id' });
Plan.hasMany(Enterprise, { foreignKey: 'plan_id' });


module.exports ={
    db,
    User,
Enterprise,
Activation,
Lead,
Followup,
Business,
Meeting,
Contact,
Activity,
Competitor,
CompetitorHasBusiness,
ContactHasMeeting,
Product,
ProductCategory,
Country,
Gateway,
Plan,
Order,
PasswordReset,
Source 

}