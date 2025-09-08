const User = require('../models/User');

/**
 * GET /api/users/years
 * Returns distinct registration years sorted desc
 */
exports.getYears = async (req, res) => {
    try {
        const years = await User.aggregate([
            {
                $project: {
                    year: { $year: "$registrationDate" }
                }
            },
            { $group: { _id: "$year" } },
            { $sort: { _id: -1 } }
        ]);
        const yearList = years.map(y => y._id);
        res.json({ years: yearList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * GET /api/users/stats?year=YYYY
 * Returns monthly counts (array of 12 ints) and users of that year
 */
exports.getStatsByYear = async (req, res) => {
    try {
        const year = parseInt(req.query.year, 10);
        if (isNaN(year)) return res.status(400).json({ message: 'Invalid year' });

        // aggregate counts per month (1..12)
        const counts = await User.aggregate([
            {
                $match: {
                    registrationDate: {
                        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                        $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
                    }
                }
            },
            {
                $project: {
                    month: { $month: "$registrationDate" }
                }
            },
            {
                $group: {
                    _id: "$month",
                    count: { $sum: 1 }
                }
            }
        ]);

        // transform to array of 12 months (index 0 = Jan)
        const monthlyCounts = new Array(12).fill(0);
        counts.forEach(c => {
            monthlyCounts[c._id - 1] = c.count;
        });

        res.json({ year, monthlyCounts });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};