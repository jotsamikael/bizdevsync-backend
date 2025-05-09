const cron = require('node-cron');
const User = require('../models/User');
const Plan = require('../models/Plan');

cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  const expiredUsers = await User.findAll({
    where: {
      will_expire: {
        [Op.lt]: now
      }
    }
  });

  for (const user of expiredUsers) {
    user.plan_id = null; // Or downgrade to "free" plan
    await user.save();
    // optionally send an email
  }

  console.log(`Checked and downgraded ${expiredUsers.length} expired users.`);
});
