const UserActivity = require('../models/UserActivity'); 

const getUserBehaviorInsights = async (req, res) => {
    try {
        const frequentUsers = await UserActivity.aggregate([
            { $group: { _id: '$userId', actionCount: { $sum: 1 } } },
            { $sort: { actionCount: -1 } },
            { $limit: 5 },
        ]);
        
        const topActions = await UserActivity.aggregate([
            { $group: { _id: '$action', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        
        res.status(200).json({
            frequentUsers,
            topActions,
        });
    } catch (error) {
        console.error('Error fetching user behavior insights:', error);
        res.status(500).json({ message: 'Error fetching user behavior insights' });
    }
};


module.exports = { getUserBehaviorInsights };