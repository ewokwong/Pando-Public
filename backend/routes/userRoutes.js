// BE Code to handle user routes
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const SECRET_KEY = process.env.SECRET_KEY; // Ensure SECRET_KEY is loaded from environment variables

const router = express.Router();
const Request = require('../models/Request');

const sortPossibleConnections = require('../sortingSystem');
const cleanUserObject = require('../common/cleanUserObject');

// Route to get user info by userID
router.get('/:userId', async (req, res) => {
    const { userId } = req.params; // Extract the userId from the route params

    try {
        const user = await User.findById(userId); // Find the user by _id (userId)
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user: {
                userId: user._id,
                email: user.email,
                name: user.name,
                profilePhoto: user.profilePhoto,
                UTR: user.UTR,
                dob: user.dob,
                bio: user.bio,
                friends: user.friends,
                media: user.media,
                userPreferences: user.userPreferences,
                createdAt: user.createdAt,
                verified: user.verified,
                profileComplete: user.profileComplete,
                location: user.location
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});

// Route to get user info by firebaseUID
router.get('/firebase/:firebaseUID', async (req, res) => {
  const { firebaseUID } = req.params;
  console.log("Firebase UID:", firebaseUID);
  try {
    const user = await User.findOne({ firebaseUID });
    if (!user) {
        console.log("Firebase user not found");
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("Firebase user found");

    // Generate JWT Token with unique user_ID
    const token = jwt.sign(
      { userId: user._id }, // Payload with userId
      SECRET_KEY,          // Secret key for signing
      { expiresIn: '1d' }  // Token expiration time
    );

    res.status(200).json({ user, token }); // Return user details and token
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

// Route to get user object (in JS) by userID
router.get('/:userId/get-user-object', async (req, res) => {
    const { userId } = req.params; // Extract the userId from the route params

    try {
        const user = await User.findById(userId); // Find the user by _id (userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Convert user to plain object (removes MongoDB specific methods)
        const userObj = cleanUserObject(user);

        res.status(200).json(userObj);  // Return the sanitized user object
    } catch (error) {
        console.log("Error", error.message);
        res.status(500).json({ message: 'Error fetching user data', error: error.message });
    }
});

// Route to update user info
router.put('/:userId/update', async (req, res) => {
    const { userId } = req.params;
    const { dob, bio } = req.body;

    try {
      // Find the user by their userId
        const user = await User.findById(userId);
      
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        if (!dob) {
            return res.status(400).json({ message: 'Please input a valid DOB' });
        } else {

            const dobDate = new Date(dob);
            const today = new Date();
            const hundredYearsAgo = new Date();
            hundredYearsAgo.setFullYear(today.getFullYear() - 100);
      
            // Check if DOB is in the past and within the last 100 years
            if (dobDate >= today) {
                return res.status(400).json({ message: 'Date of Birth must be before today' });
            }
      
            if (dobDate < hundredYearsAgo) {
                return res.status(400).json({ message: 'Date of Birth must be within the last 100 years' });
            }
      
            // If DOB is valid, update it
            user.dob = dobDate;
        }

        // Conditionally update fields if they are present in the request body
        // if (utr !== undefined) user.UTR = utr;
        if (bio !== undefined) user.bio = bio;
        // if (profilePhoto) user.profilePhoto = profilePhoto;
    
        // Save the updated user document
        await user.save();
    
        // Return the updated user data
        res.status(200).json({ message: 'User information updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user info' });
    }
});

// Route to get incoming requests for user of a certain status (accepted, pending or rejected)
router.get('/:userId/getIncomingRequests', async (req, res) => {
    const { userId } = req.params;
    const { status } = req.query

    try {
        // Find all friend requests where the receiver matches userId
        const incomingRequests = await Request.find({ receiver: userId, status: status });

        // Send request objects
        res.status(200).json(incomingRequests);
    } catch (error) {
        console.error('Error fetching incoming friend requests:', error);
        res.status(500).json({ message: 'Error fetching incoming requests', error: error.message });
    }
});

// Route to accept / reject incoming request
router.post('/update-incoming-request', async (req, res) => {
    const { requestId, status } = req.body;  // Extract requestId and new status)

    if (!requestId || !status) {
        return res.status(400).json({ message: "Request ID and status are required" });
    }

    // Ensure status is valid
    const validStatuses = ["accepted", "rejected"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    try {
        // Find the request by ID
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Update status and `updatedAt`
        request.status = status;
        request.updatedAt = new Date();

        // Save updated request
        await request.save();

        return res.status(200).json({ message: `Request ${status} successfully`, request });
    } catch (error) {
        console.error(`Error updating request to ${status}:`, error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Route to add a friend
router.post('/add-friend', async (req, res) => {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
        return res.status(400).json({ message: "Both user IDs are required" });
    }

    try {
        // Add receiver to sender's friends list
        await User.findByIdAndUpdate(senderId, { $addToSet: { friends: receiverId } });

        // Add sender to receiver's friends list
        await User.findByIdAndUpdate(receiverId, { $addToSet: { friends: senderId } });

        console.log(`Users ${senderId} and ${receiverId} are now friends.`);
        return res.status(200).json({ message: "Friendship established successfully" });

    } catch (error) {
        console.error("Error adding friends:", error);
        return res.status(500).json({ message: "Server error" });
    }
});


// Route to get all possible connections of a user - will return a list of user IDs
// Will ensure:
// 1. User is not sender or receiver of request with 'pending' state
// 2. Should not show is user has been rejected by other user -> i.e., have a request which user is "sender" and status is "rejected"
// 3. Should not show other users which user has already said no to -> i.e., sender is user and status is "not-sent"
// 4. Should not show users which are friends
// 5. Will not show users without a UTR
// Return: [{ userId: <userId>, compatibility: <score> }, ...] sorted by score
router.get('/:userId/get-possible-connections', async (req, res) => {
    try {
        const { userId } = req.params;
    
        // Omit user's current friends
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const currentFriends = user.friends || [];
    
        // Get all outgoing requests which users shouldn't be found - i.e.:
        // If they are already in inbox, 
        // Other user has already rejected them
        // User has rejected other user
        const outgoingRequests = await Request.find({
            $or: [
                { sender: userId, status: "pending" },
                { sender: userId, status: "rejected" },
                { sender: userId, status: "not-sent" }
            ]
          });

        // Omit profiles which have incoming pending requests
        const incomingRequests = await Request.find({ receiver: userId, status: "pending" });

        // Use a Set to avoid duplicates
        const usersNotFound = new Set();

        // Add fields to sets
        currentFriends.forEach(friendId => usersNotFound.add(friendId));
        outgoingRequests.forEach(request => usersNotFound.add(request.receiver));
        incomingRequests.forEach(request => usersNotFound.add(request.sender));

        // Convert Set back to array
        const usersNotFoundList = Array.from(usersNotFound);
            
        // Get list of user IDs which are possibleConnections (UTR not necessary)
        const possibleConnections = await User.find({
            _id: { $nin: [...usersNotFoundList, userId] },
        }).select("_id");

        // Transform the list to only contain ObjectId values
        const userIdList = possibleConnections.map(connection => connection._id);

        // Sort list by sorting algorithm and include compatibility scores
        const sortedConnectionsWithScores = await sortPossibleConnections(userId, userIdList);

        // Transform the result to include userId and compatibility score
        const response = sortedConnectionsWithScores.map(connection => ({
            userID: connection.userId,
            compatibility: connection.compatibility
        }));

        console.log("Response will be", response);
        res.json(response);
    } catch (error) {
        console.error("Error fetching possible connections:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Route to update possible connections - i.e., remove the status requests from user that are in 'not-sent' status
// Will return count of updated requests
router.post('/:userId/refresh-possible-connections', async (req, res) => {
    const { userId } = req.params;  // Extract userId from URL parameter
    try {

        // Fetch the user from the database
        const user = await User.findById(userId);
    
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get all requests from user which were 'not-sent'
        const requests = await Request.find({
                $or: [{ sender: userId }],
                status: 'not-sent',
        });

        if (requests.length === 0) {
            return res.status(200).json({ message: "No requests with 'not-sent' status found.", updatedConnectionsCount: 0 });
        }

        // Update the status of these requests to null
        const result = await Request.updateMany(
            { _id: { $in: requests.map(req => req._id) } },
            { $set: { status: null } }
        );

        // Return success response
        res.status(200).json({ message: "Requests updated successfully, status set to null.", updatedConnectionsCount: result.nModified });

    } catch (error) {
        console.error('Error refreshing possible connections:', error);
        res.status(500).json({ error: 'Failed to refresh possible connections' });
    }
});

// Router to update an outgoing request
router.post('/update-outgoing-request', async (req, res) => {

    const { senderId, receiverId, newStatus } = req.body;

    try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender || !receiver) {
            return res.status(404).json({ error: "Sender or receiver not found" });
        }

        // Check if user has already seen this profile before
        const existingRequest = await Request.findOne({ sender: senderId, receiver: receiverId });

        if (existingRequest) {
            // If a request exists, update the status of the existing request
            existingRequest.status = newStatus;
            await existingRequest.save(); // Save the updated request

            console.log("Request status updated:", existingRequest);
            return res.status(200).json({
                message: "Request status updated successfully",
                requestId: existingRequest._id,
            });
        }

        // If no request exists, create a new one
        const newRequest = new Request({
            sender: senderId,
            receiver: receiverId,
            status: newStatus
        });

        // Save the request in the database
        await newRequest.save();

        // Return success response
        res.status(201).json({ message: "Request sent successfully", requestId: newRequest._id });

    } catch (error) {
        console.log('Error sending request:', error);
        res.status(500).json({ error: 'Failed to send or update the request' });
    }
});

// Route to verify user
router.post('/:userId/verify-user', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Update user's verified status
        const updatedUser = await User.findByIdAndUpdate(userId, { verified: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User verified successfully", user: updatedUser });
    } catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Route to update profile completion state of user
router.put('/:userId/update-profile-completion', async (req, res) => {
    const { userId } = req.params; // Extract userId from URL
    try {
        // Find the user by userId
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's profileComplete field
        user.profileComplete = true; // Set to true to mark profile as complete

        // Save the updated user document
        await user.save();

        // Return success response only once
        return res.status(200).json({ message: 'Profile completion updated successfully', user });
    } catch (error) {
        console.error('Error updating profile completion:', error);
        // Ensure only one response is sent, and in case of an error, we respond with the error
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error updating profile completion', error: error.message });
        }
    }
});

// Route to mark user profile as complete
router.put('/:userId/mark-profile-complete', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user by userId
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Mark the profile as complete
        user.profileComplete = true;

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Profile marked as complete successfully', user });
    } catch (error) {
        console.error('Error marking profile as complete:', error);
        res.status(500).json({ message: 'Error marking profile as complete', error: error.message });
    }
});

// Route to upload bio
router.put('/:userID/update-bio', async (req, res) => {
    try {
        const { bio } = req.body;  // Get the bio from the request body

        if (!bio) {
            return res.status(400).json({ message: "Bio content is required" });
        }

        // Find the user by userID
        const user = await User.findById(req.params.userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's bio
        user.bio = bio;

        // Save the updated user document
        await user.save();

        // Return the updated bio
        res.json({ bio: user.bio });

    } catch (error) {
        console.log("Error updating bio:", error);
        res.status(500).json({ message: "Error updating bio", error });
    }
});

// Route to submit user preferences
router.put('/:userId/submit-preferences', async (req, res) => {
    try {
        const { userPreferences } = req.body;  // Get the preferences from the request body

        if (!userPreferences || typeof userPreferences !== 'object') {
            return res.status(400).json({ message: "Preferences must be an object" });
        }

        // Find the user by userID
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Updating preferences...");
        // Merge the existing preferences with the new ones
        user.userPreferences = {
            ...user.userPreferences,  // Retain existing preferences
            ...userPreferences,       // Update with the new preferences
        };

        // Save the updated user document
        await user.save();

        console.log("Preferences have been updated");

        // Return the updated preferences
        res.json({ userPreferences: user.userPreferences });

    } catch (error) {
        console.log("Error updating preferences:", error);
        res.status(500).json({ message: "Error updating preferences", error });
    }
});

// // Route to update user preferences
// router.put('/:userId/update-preferences', async (req, res) => {
//     const { userId } = req.params;
//     const { preferences } = req.body;

//     if (!preferences || typeof preferences !== 'object') {
//         return res.status(400).json({ message: "Preferences must be an object" });
//     }

//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Update user preferences
//         user.userPreferences = {
//             fun_social: preferences.fun_social,
//             training_for_competitions: preferences.training_for_competitions,
//             fitness: preferences.fitness,
//             learning_tennis: preferences.learning_tennis
//         };

//         await user.save();

//         res.status(200).json({ message: 'Preferences updated successfully', preferences: user.userPreferences });
//     } catch (error) {
//         console.error('Error updating preferences:', error);
//         res.status(500).json({ message: 'Error updating preferences', error: error.message });
//     }
// });

// Route to check if user profile is complete
// A profile is complete if they have the following fields set:
// Email, Name, DOB, Password, Bio, Preferences (not all set to false)
router.get('/:userID/check-profile-completion', async (req, res) => {
    try {
        // Find the user by userID
        const user = await User.findById(req.params.userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user has all required fields set
        const hasRequiredFields = user.email && user.name && user.dob && user.profilePhoto&& user.profilePhoto !== 'https://res.cloudinary.com/dsnrydwvc/image/upload/v1742098817/default-profile-account-unknown-icon-black-silhouette-free-vector_nczqdl.jpg';

        // Check if bio is not empty
        const hasBio = user.bio && user.bio.trim() !== '';

        // Check if there is at least one preference set to true
        const hasPreferences = Object.values(user.userPreferences).some(pref => pref === true);

        // A profile is complete if all conditions are met
        const isProfileComplete = hasRequiredFields && hasBio && hasPreferences;

        console.log("User is complete is:", isProfileComplete);
        // Set profile is complete
        user.profileComplete = isProfileComplete;

        // Save the updated user document
        await user.save();

        // Return the profile completion status
        res.json({ isComplete: isProfileComplete });

    } catch (error) {
        console.error("Error checking profile completion:", error); // Improved logging
        res.status(500).json({ message: "Error checking profile completion", error });
    }
});

// Route to update user's DOB
router.put('/:userID/update-dob', async (req, res) => {
    try {
        const { dob } = req.body;

        // Validate DOB
        if (!dob) {
            return res.status(400).json({ message: "DOB is required" });
        }

        const dobDate = new Date(dob);
        const today = new Date();
        const hundredYearsAgo = new Date();
        hundredYearsAgo.setFullYear(today.getFullYear() - 100);

        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

        // Check if DOB is in the past and within the last 100 years
        if (dobDate >= today) {
            return res.status(400).json({ message: "Date of Birth must be before today" });
        }

        if (dobDate < hundredYearsAgo) {
            return res.status(400).json({ message: "Date of Birth must be within the last 100 years" });
        }

        // Check if user is at least 18 years old
        if (dobDate > eighteenYearsAgo) {
            return res.status(400).json({ message: "User must be at least 18 years old" });
        }

        // Find the user by userID
        const user = await User.findById(req.params.userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's DOB
        user.dob = dobDate;

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: "DOB updated successfully", user });
    } catch (error) {
        console.error("Error updating DOB:", error);
        res.status(500).json({ message: "Error updating DOB", error });
    }
});

// Route to update user bio
router.put('/:userId/update-bio', async (req, res) => {
    try {
        const { bio } = req.body;

        if (!bio) {
            return res.status(400).json({ message: "Bio content is required" });
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.bio = bio;
        await user.save();

        res.status(200).json({ message: "Bio updated successfully", bio: user.bio });
    } catch (error) {
        console.error("Error updating bio:", error);
        res.status(500).json({ message: "Error updating bio", error });
    }
});

// Route to update user preferences
router.put('/:userId/update-preferences', async (req, res) => {
    try {
        const { userPreferences } = req.body;

        if (!userPreferences || typeof userPreferences !== 'object') {
            return res.status(400).json({ message: "Preferences must be an object" });
        }

        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.userPreferences = {
            ...user.userPreferences,
            ...userPreferences,
        };
        await user.save();

        res.status(200).json({ message: "Preferences updated successfully", userPreferences: user.userPreferences });
    } catch (error) {
        console.error("Error updating preferences:", error);
        res.status(500).json({ message: "Error updating preferences", error });
    }
});

// Route to update user location
router.put('/:userId/update-location', async (req, res) => {
    const { userId } = req.params;
    const { displayName, latitude, longitude } = req.body;

    console.log("Request Body:", req.body); // Debugging log

    try {
        if (!displayName || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'Invalid location data' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { location: { displayName, latitude, longitude } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Location updated successfully', user });
    } catch (err) {
        console.error('Error updating location:', err);
        res.status(500).json({ message: 'Failed to update location' });
    }
});

router.get('/:userId/get-compatibility/:otherUserId', async (req, res) => {
  const { userId, otherUserId } = req.params

  try {
    const user = await User.findById(userId)
    const otherUser = await User.findById(otherUserId)

    if (!user || !otherUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Example compatibility calculation (replace with your logic)
    const compatibility = 0.71

    res.status(200).json({ compatibility })
  } catch (error) {
    console.error("Error fetching compatibility:", error)
    res.status(500).json({ message: "Error fetching compatibility", error: error.message })
  }
})

module.exports = router;