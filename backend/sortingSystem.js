// JS File to implement Pando's sorting system
// Current implementation: 70% weighting on UTR matching, 30% weighting on preference matching
const User = require('./models/User');

/************ HELPER FUNCTIONS ************/
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

// Enhanced helper function to calculate UTR score
const calculateUTRScore = (currentUser, user, utrWeight) => {
    if (currentUser.UTR && user.UTR) {
        const utrDiff = Math.abs(currentUser.UTR - user.UTR);

        if (utrDiff > 16) {
            return 0; // No compatibility for extreme UTR differences
        }

        // Penalize extreme differences more heavily
        const penalty = utrDiff > 8 ? 0.5 : 0; // Additional penalty for large differences
        const scaledScore = 1 - (utrDiff / 16); // Higher difference = lower score
        return Math.max(0, (scaledScore - penalty) * utrWeight);
    }

    return 0; // No UTR data for either user
};

// Enhanced helper function to calculate preference score
const calculatePreferenceScore = (currentUserPreferences, userPreferences, preferenceWeight) => {
    if (!currentUserPreferences || !userPreferences) {
        return 0; // No preferences available
    }

    const preferenceKeys = Object.keys(currentUserPreferences);
    const exactMatches = preferenceKeys.filter(
        key => currentUserPreferences[key] && userPreferences[key]
    ).length;
    const partialMatches = preferenceKeys.filter(
        key => !currentUserPreferences[key] && !userPreferences[key]
    ).length;
    const mismatches = preferenceKeys.filter(
        key => currentUserPreferences[key] !== userPreferences[key]
    ).length;

    const totalPreferences = preferenceKeys.length;
    const matchScore = (exactMatches / totalPreferences) * 0.7; // Exact matches contribute 70%
    const partialMatchScore = (partialMatches / totalPreferences) * 0.2; // Partial matches 20%
    const mismatchPenalty = (mismatches / totalPreferences) * -0.1; // Mismatches penalize 10%

    return Math.max(0, (matchScore + partialMatchScore + mismatchPenalty) * preferenceWeight);
};

// Enhanced helper function to calculate proximity score
const calculateProximityScore = (currentUser, user, proximityWeight, proximityThresholdKm) => {
    if (currentUser.location?.latitude && currentUser.location?.longitude &&
        user.location?.latitude && user.location?.longitude) {
        const distance = calculateDistance(currentUser.location, user.location);

        const baseCompatibility = distance <= 20 ? 0.6 : 0; // Base score for close range
        const proximityScore = 1 / (1 + distance); // Inverse relation with distance
        const withinProximity = distance <= proximityThresholdKm;

        // Combine scores and normalize to ensure it does not exceed 1
        const combinedScore = Math.min((proximityScore * proximityWeight) + (baseCompatibility * proximityWeight), proximityWeight);

        return { proximityScore: combinedScore, withinProximity };
    }
    return { proximityScore: 0, withinProximity: false }; // No location data
};

/************ THE SORTING SYSTEM ************/
// Return: Sorted list of possible connections with userId and matchScore
// e.g., [{ userId: '123', matchScore: 0.8 }, { userId: '456', matchScore: 0.7 }...]
const sortPossibleConnections = async (currentUserId, possibleConnections) => {
    // Set weightings of algorithm
    const utrWeight = 0.4, preferenceWeight = 0.3, proximityWeight = 0.3; // Adjusted weights
    const proximityThresholdKm = 100; // Threshold for prioritization

    // Get current User info from DB
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) throw new Error("User not found");

    // Fetch possible connection user details
    const possibleConnectionsObjectList = await User.find({ _id: { $in: possibleConnections } });

    // For each connection, calculate the match score (accounting for UTR, preferences, and proximity)
    const scoredConnections = await Promise.all(possibleConnectionsObjectList.map(async user => {
        const { proximityScore, withinProximity } = calculateProximityScore(currentUser, user, proximityWeight, proximityThresholdKm);
        const utrScore = calculateUTRScore(currentUser, user, utrWeight);
        const preferenceScore = calculatePreferenceScore(currentUser.userPreferences, user.userPreferences, preferenceWeight);

        // Calculate the total weight of metrics that are available
        const totalWeight =
            (currentUser.UTR && user.UTR ? utrWeight : 0) +
            (currentUser.userPreferences && user.userPreferences ? preferenceWeight : 0) +
            (currentUser.location && user.location ? proximityWeight : 0);

        // Normalize the final score to ensure compatibility is between 0 and 1
        const finalScore = totalWeight > 0
            ? ((utrScore + preferenceScore + proximityScore) / totalWeight)
            : 0;

        return { userId: user._id, finalScore: Math.min(finalScore, 1), withinProximity };
    }));

    // Sort connections: prioritize within proximity, then by finalScore
    const sortedConnections = scoredConnections.sort((a, b) => {
        if (a.withinProximity && !b.withinProximity) {
            return -1; // a is within proximity, b is not
        }
        if (!a.withinProximity && b.withinProximity) {
            return 1; // b is within proximity, a is not
        }
        return b.finalScore - a.finalScore; // Sort by finalScore if both are within or outside proximity
    });

    // Return sorted connections with userId and finalScore
    return sortedConnections.map(connection => ({
        userId: connection.userId,
        compatibility: connection.finalScore
    }));
};

module.exports = sortPossibleConnections;
