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
Enterprise.belongsTo(Country,{foreignKey:'_idCountry'})
Country.hasMany(Enterprise,{foreignKey:'_idCountry'})


// ===============
// Country Relationships
// ===============
Country.belongsTo(Region,{foreignKey: '_idRegion'});
Region.hasMany(Country,{foreignKey: '_idRegion'})


// ===============
// User Relationships
// ===============

// User belongs to Enterprise (nullable for solobizdevs)
User.belongsTo(Enterprise, { foreignKey: '_idEnterprise' });
Enterprise.hasMany(User, { foreignKey: '_idEnterprise' });

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
Lead.belongsTo(Enterprise, { foreignKey: '_idEnterprise' });
Enterprise.hasMany(Lead, { foreignKey: '_idEnterprise' });

// Lead belongs to Country
Lead.belongsTo(Country, { foreignKey: '_idCountry' });
Country.hasMany(Lead, { foreignKey: '_idCountry' });

// ===============
// Contact Relationships
// ===============

// Contact belongs to Lead
Contact.belongsTo(Lead, { foreignKey: '_idLead' });
Lead.hasMany(Contact, { foreignKey: '_idLead' });

// Contact belongs to Country
Contact.belongsTo(Country, { foreignKey: '_idCountry' });
Country.hasMany(Contact, { foreignKey: '_idCountry' });

// ===============
// Followup Relationships
// ===============

// Followup belongs to Lead
Followup.belongsTo(Lead, { foreignKey: '_idLead' });
Lead.hasMany(Followup, { foreignKey: '_idLead' });

// Followup can have multiple Activities
Followup.hasMany(Activity, { foreignKey: '_idFollowup' });
Activity.belongsTo(Followup, { foreignKey: '_idFollowup' });

// Followup can have multiple Meetings
Followup.hasMany(Meeting, { foreignKey: '_idFollowup' });
Meeting.belongsTo(Followup, { foreignKey: '_idFollowup' });

// ===============
// Business Relationships
// ===============

// Business is created from Lead
Business.belongsTo(Lead, { foreignKey: '_idLead' });
Lead.hasOne(Business, { foreignKey: '_idLead' });

// Business belongs to User (creator/owner)
Business.belongsTo(User, { foreignKey: 'created_by_user_id' });
User.hasMany(Business, { foreignKey: 'created_by_user_id' });

// Business has many Activities
Business.hasMany(Activity, { foreignKey: '_idBusiness' });
Activity.belongsTo(Business, { foreignKey: '_idBusiness' });

// Business has many Meetings
Business.hasMany(Meeting, { foreignKey: '_idBusiness' });
Meeting.belongsTo(Business, { foreignKey: '_idBusiness' });

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

ContactHasMeeting.belongsTo(Meeting, {
  foreignKey: 'meeting_idMeeting'
});

ContactHasMeeting.belongsTo(Contact, {
  foreignKey: 'contact_idContact'
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
Product.belongsTo(ProductCategory, { foreignKey: '_idProductCategory' });
ProductCategory.hasMany(Product, { foreignKey: '_idProductCategory' });

// Product belongs to User
ProductCategory.belongsTo(User, { foreignKey: '_idUser' });
User.hasMany(ProductCategory, { foreignKey: '_idUser' });

// Product belongs to User
Product.belongsTo(User, { foreignKey: '_idUser' });
User.hasMany(Product, { foreignKey: '_idUser' });

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
Region,
Gateway,
Plan,
Order,
PasswordReset,
Source 

}