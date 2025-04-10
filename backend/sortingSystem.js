// JS File to implement Pando's sorting system
// Current implementation: 70% weighting on UTR matching, 30% weighting on preference matching
const User = require('./models/User');

// Function
// Params:
// currentUserId: ID of current User
// possibleConnections: List of user IDs of possible connections
const sortPossibleConnections = async (currentUserId, possibleConnections) => {

    // Set weightings of algorithm
    const utrWeight = 0.7, preferenceWeight = 0.3;
  
    // Get current User info from DB 
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) throw new Error("User not found");

    // Fetch possible connection user details
    const possibleConnectionsObjectList = await User.find({ _id: { $in: possibleConnections } });

    const calculateMatchScore = (user) => {
        
        // Case 1: Both sides have UTR + Preferences
        if (currentUser.UTR && user.UTR && currentUser.preferences && user.preferences) {
            const utrDiff = Math.abs(currentUser.UTR - user.UTR);
            const utrScore = 1 / (1 + utrDiff); // Closer UTR = higher score

            const sharedPreferences = currentUser.preferences.filter(pref =>
                user.preferences.includes(pref)
            ).length;
            const preferenceScore = sharedPreferences / currentUser.preferences.length || 0;

            return (utrScore * utrWeight) + (preferenceScore * preferenceWeight);
        }

        // Case 2: Both sides have UTR (doesn’t matter about preferences)
        if (currentUser.UTR && user.UTR) {
            const utrDiff = Math.abs(currentUser.UTR - user.UTR);
            const utrScore = 1 / (1 + utrDiff); // Closer UTR = higher score
            return utrScore * utrWeight;
        }

        // Case 3: Both sides have preference (doesn’t matter about UTR)
        if (currentUser.preferences && user.preferences) {
            const sharedPreferences = currentUser.preferences.filter(pref =>
                user.preferences.includes(pref)
            ).length;
            const preferenceScore = sharedPreferences / currentUser.preferences.length || 0;
            return preferenceScore * preferenceWeight;
        }

        // Case 4: One user has UTR or preferences, but the other does not
        let score = 0;
        if (!currentUser.UTR && user.UTR) score += 1; // 1 point if the other user has UTR
        if (!currentUser.preferences && user.preferences) score += 1; // 1 point if the other user has preferences
        return score;

        // Case 5: Both sides have nothing (No matching)
        return 0;
    };

    // Calculate the score for each connection and sort by location and score
    const sortedUserIds = (await Promise.all(possibleConnectionsObjectList.map(async user => {
        const score = calculateMatchScore(user);
        const sameLocation = currentUser.location && user.location &&
            currentUser.location.toLowerCase() === user.location.toLowerCase(); // Compare locations in lowercase
        return { userId: user._id, score, sameLocation };
    })))
    .sort((a, b) => {
        // Prioritize same location, then sort by score
        if (a.sameLocation === b.sameLocation) {
            return b.score - a.score; // Sort by score if locations are the same
        }
        return b.sameLocation - a.sameLocation; // Prioritize same location
    })
    .map(connection => connection.userId); // Extract user IDs

    return sortedUserIds;
};

module.exports = sortPossibleConnections;
