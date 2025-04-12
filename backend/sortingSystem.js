// JS File to implement Pando's sorting system
// Current implementation: 70% weighting on UTR matching, 30% weighting on preference matching
const User = require('./models/User');

{ /************ HELPER FUNCTIONS ************/}
// Helper function to calculate match score based on UTR and preferences
const calculateMatchScore = (currentUser, user, utrWeight, preferenceWeight) => {
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

// Helper function to calculate distance between two locations using Haversine formula
const calculateDistance = (loc1, loc2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const earthRadiusKm = 6371;

    const dLat = toRadians(loc2.latitude - loc1.latitude);
    const dLon = toRadians(loc2.longitude - loc1.longitude);

    const lat1 = toRadians(loc1.latitude);
    const lat2 = toRadians(loc2.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c; // Distance in kilometers
};

{/************ THE SORTING SYSTEM ************/}
const sortPossibleConnections = async (currentUserId, possibleConnections) => {

    // Set weightings of algorithm
    const utrWeight = 0.4, preferenceWeight = 0.1, proximityWeight = 0.5; // Adjusted weights
    const proximityThresholdKm = 100; // Updated threshold for prioritization
    const minMatchScoreThreshold = 0.1; // Minimum match score to assign a low score instead of excluding

    // Get current User info from DB 
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) throw new Error("User not found");

    // Fetch possible connection user details
    const possibleConnectionsObjectList = await User.find({ _id: { $in: possibleConnections } });

    // For each connection, calculate the match score (accounting for UTR, preferences, and proximity)
    const scoredConnections = await Promise.all(possibleConnectionsObjectList.map(async user => {
        const matchScore = calculateMatchScore(currentUser, user, utrWeight, preferenceWeight);

        let proximityScore = 0; // Default to 0 if no proximity data
        let withinProximity = false; // Flag to check if within proximity threshold
        if (currentUser.location?.latitude && currentUser.location?.longitude &&
            user.location?.latitude && user.location?.longitude) {
            const distance = calculateDistance(currentUser.location, user.location);
            proximityScore = 1 / (1 + distance); // Closer distance = higher score
            withinProximity = distance <= proximityThresholdKm; // Check if within 100km
        }

        // Calculate final weighted score
        const finalScore = (matchScore * (utrWeight + preferenceWeight)) + (proximityScore * proximityWeight);

        // Assign a very low score if below the minimum threshold
        const adjustedScore = finalScore < minMatchScoreThreshold ? 0.01 : finalScore;

        return { userId: user._id, matchScore, adjustedScore, withinProximity };
    }));

    // Sort connections: prioritize within proximity, then by matchScore or adjustedScore
    const sortedConnections = scoredConnections.sort((a, b) => {
        if (a.withinProximity !== b.withinProximity) {
            return b.withinProximity - a.withinProximity; // Prioritize users within proximity
        }
        if (a.withinProximity) {
            return b.matchScore - a.matchScore; // Sort by matchScore for users within proximity
        }
        return b.adjustedScore - a.adjustedScore; // Sort by adjustedScore for users beyond proximity
    });

    // Extract sorted user IDs
    return sortedConnections.map(connection => connection.userId);
};

module.exports = sortPossibleConnections;
