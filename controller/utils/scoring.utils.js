//This function calculates a score for a specific Followup (opportunity) to qualify it as Hot / Warm / Cold 
// based on recent interactions & activity. 

exports.computeFollowupScore = async (followupId) => {
  const followup = await Followup.findByPk(followupId);
  if (!followup) return null;

  let score = 0;

  // Activities for Followup
  const activitiesCount = await Activity.count({
    where: {
      Followup_idFollowup: followupId,
      createdAt: { [db.Sequelize.Op.gt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      is_archived: false
    }
  });
  score += Math.min(activitiesCount * 10, 50);

  // Meetings for Followup
  const meetingsCount = await Meeting.count({
    where: {
      Followup_idFollowup: followupId,
      createdAt: { [db.Sequelize.Op.gt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      is_archived: false
    }
  });
  score += Math.min(meetingsCount * 15, 60);

  // Followup next_action_date upcoming
  if (followup.next_action_date && followup.next_action_date > new Date()) {
    score += 20;
  }

  // Overdue Followup penalty
  if (followup.next_action_date && followup.next_action_date < new Date()) {
    score -= 10;
  }

  // Determine status
  let status = 'Cold';
  if (score >= 100) status = 'Hot';
  else if (score >= 50) status = 'Warm';

  // Update Followup
  await followup.update({ lead_score: score, followup_status: status });

  return { followupId, score, status };
};
