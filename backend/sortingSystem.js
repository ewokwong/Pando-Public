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
    const proximityThresholdKm = 50; // Maximum distance in kilometers for consideration
    const minMatchScoreThreshold = 0.1; // Minimum match score to assign a low score instead of excluding

    // Get current User info from DB 
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) throw new Error("User not found");

    // Fetch possible connection user details
    const possibleConnectionsObjectList = await User.find({ _id: { $in: possibleConnections } });

    // For each connection, calculate the match score (accounting for UTR, preferences, and proximity)
    // Sort the connections based on the calculated scores
    const sortedUserIds = (await Promise.all(possibleConnectionsObjectList.map(async user => {

        const score = calculateMatchScore(currentUser, user, utrWeight, preferenceWeight);

        let proximityScore = 0; // Default to 0 if no proximity data
        if (currentUser.location?.latitude && currentUser.location?.longitude &&
            user.location?.latitude && user.location?.longitude) {
            const distance = calculateDistance(currentUser.location, user.location);
            proximityScore = 1 / (1 + distance); // Closer distance = higher score
            if (distance > proximityThresholdKm) {
                proximityScore *= 0.1; // Reduce proximity score for users beyond the threshold
            }
        }

        const sameLocation = !proximityScore && currentUser.location?.name && user.location?.name &&
            currentUser.location.name.toLowerCase() === user.location.name.toLowerCase(); // Fallback to name comparison

        // Calculate final weighted score
        const finalScore = (score * (utrWeight + preferenceWeight)) + (proximityScore * proximityWeight);

        // Assign a very low score if below the minimum threshold
        const adjustedScore = finalScore < minMatchScoreThreshold ? 0.01 : finalScore;

        return { userId: user._id, finalScore: adjustedScore, sameLocation };
    })))
    .sort((a, b) => {
        // Sort by finalScore, then sameLocation
        if (a.finalScore === b.finalScore) {
            return b.sameLocation - a.sameLocation; // Prioritize same location if scores are equal
        }
        return b.finalScore - a.finalScore; // Sort by final weighted score
    })
    .map(connection => connection.userId); // Extract user IDs

    return sortedUserIds;
};

module.exports = sortPossibleConnections;
