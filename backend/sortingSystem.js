// JS File to implement Pando's sorting system
// Current implementation: 70% weighting on UTR matching, 30% weighting on preference matching
const User = require('./models/User');
const getUser = require('./models/User').findById; // Import getUser function to fetch user details

{ /************ HELPER FUNCTIONS ************/}
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

// Helper function to calculate UTR score
// UTR score will range from 0 - 1, and will be multipled by given utrWeight for final score calculation
const calculateUTRScore = (currentUser, user, utrWeight) => {
    if (currentUser.UTR && user.UTR) {
        const utrDiff = Math.abs(currentUser.UTR - user.UTR);

        if (utrDiff > 4) {
            return 0.4 * utrWeight; // Score is 0.4 if difference is greater than 4
        }

        // Scale from 0.4 to 1 as the difference decreases from 4 to 0
        const scaledScore = 0.4 + (1 - 0.4) * ((4 - utrDiff) / 4);
        return scaledScore * utrWeight;
    }

    // If either user has UTR, will give them 0.1 score
    if (currentUser.UTR || user.UTR) {
        return 0.1
    }

    return 0; // Neither user has UTR
};

// Helper function to calculate preference score
const calculatePreferenceScore = async (currentUserId, userId, preferenceWeight) => {
    // Fetch users from the database
    const currentUser = await User.findById(currentUserId);
    const user = await User.findById(userId);

    if (!currentUser || !user) {
        return 0; // If either user is not found, return 0
    }

    const currentUserPreferences = currentUser.userPreferences;
    const userPreferences = user.userPreferences;

    if (!currentUserPreferences && !userPreferences) {
        return 0; // Neither user has preferences
    }

    if (!currentUserPreferences || !userPreferences) {
        return 0.1 * preferenceWeight; // Only one user has preferences
    }

    // Extract preference keys and calculate matches
    const preferenceKeys = Object.keys(currentUserPreferences);
    const sharedPreferences = preferenceKeys.filter(
        key => currentUserPreferences[key] && userPreferences[key]
    ).length;

    if (sharedPreferences === preferenceKeys.length) {
        return 1 * preferenceWeight; // Full score for exact match
    }

    const unmatchedPreferences = preferenceKeys.length - sharedPreferences;

    // Scale score based on matches and unmatched preferences
    const matchScore = (sharedPreferences / preferenceKeys.length) * 0.6; // Matches contribute up to 60%
    const nonMatchScore = (unmatchedPreferences / preferenceKeys.length) * 0.4; // Non-matches contribute up to 40%

    const finalScore = 0.4 + matchScore + nonMatchScore; // Ensure score is higher than 0.4
    return finalScore * preferenceWeight;
};

// Helper function to calculate proximity score
const calculateProximityScore = (currentUser, user, proximityWeight, proximityThresholdKm) => {
    if (currentUser.location?.latitude && currentUser.location?.longitude &&
        user.location?.latitude && user.location?.longitude) {
        const distance = calculateDistance(currentUser.location, user.location);
        const proximityScore = 1 / (1 + distance); // Closer distance = higher score
        const withinProximity = distance <= proximityThresholdKm; // Check if within threshold
        return { proximityScore: proximityScore * proximityWeight, withinProximity };
    }
    return { proximityScore: 0, withinProximity: false }; // No location data
};

{/************ THE SORTING SYSTEM ************/}
// Return: Sorted list of possible connections with userId and matchScore
// e.g., [{ userId: '123', matchScore: 0.8 }, { userId: '456', matchScore: 0.7 }...]
const sortPossibleConnections = async (currentUserId, possibleConnections) => {

    // Set weightings of algorithm
    const utrWeight = 0.5, preferenceWeight = 0.4, proximityWeight = 0.1; // Adjusted weights
    const proximityThresholdKm = 100; // Threshold for prioritization

    // Get current User info from DB 
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) throw new Error("User not found");

    // Fetch possible connection user details
    const possibleConnectionsObjectList = await User.find({ _id: { $in: possibleConnections } });

    // For each connection, calculate the match score (accounting for UTR, preferences, and proximity)
    const scoredConnections = await Promise.all(possibleConnectionsObjectList.map(async user => {
        const utrScore = calculateUTRScore(currentUser, user, utrWeight);
        const preferenceScore = await calculatePreferenceScore(currentUserId, user._id, preferenceWeight);
        const { proximityScore, withinProximity } = calculateProximityScore(currentUser, user, proximityWeight, proximityThresholdKm);

        // Calculate final weighted score
        const finalScore = utrScore + preferenceScore + proximityScore;

        return { userId: user._id, finalScore, withinProximity };
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
