// BE Routes to handle uploads to cloudinary

const express = require("express");
const upload = require("../middleware/multerConfig");
const cloudinary = require("../config/cloudinaryConfig");  // Import cloudinary config
const router = express.Router();
const User = require("../models/User");

// Route which will upload profile photo to cloudinary (photos and videos)
router.post("/:userID/upload-profile-photo", upload.single("profilePhoto"), async (req, res) => {
    console.log("Going to upload new profile photo!");
    try {
        let result;
        if (req.file.mimetype.startsWith("image/")) {
            // Handle image upload
            result = await cloudinary.uploader.upload(req.file.path, {
                folder: "profile_photos",
            });
        } else if (req.file.mimetype.startsWith("video/")) {
            // Handle video upload
            result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "video",  // For video
                folder: "profile_videos",
            });
        } else {
            return res.status(400).json({ message: "Unsupported file type" });
        }

        // Add Profile picture to user in DB
        // Get the user from the database and update the profile photo
        const user = await User.findById(req.params.userID);  // Find the user by userID

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the profilePhoto field in the user model
        user.profilePhoto = result.secure_url;

        // Save the updated user document
        await user.save();

        // Return the URL of the uploaded media (photo or video)
        res.json({ url: result.secure_url });
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: "Error uploading media", error });
    }
});

// Route to handle profile photo upload to Cloudinary
router.post("/:userID/edit-profile-photo", upload.single("profilePhoto"), async (req, res) => {
  console.log("Going to upload new profile photo!");
  try {
    let result;
    if (req.file.mimetype.startsWith("image/")) {
      // Handle image upload
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_photos",
      });
    } else if (req.file.mimetype.startsWith("video/")) {
      // Handle video upload
      result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",  // For video
        folder: "profile_videos",
      });
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // Get the user from the database and update the profile photo
    const user = await User.findById(req.params.userID);  // Find the user by userID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the profilePhoto field in the user model
    user.profilePhoto = result.secure_url;

    // Save the updated user document
    await user.save();

    // Return the URL of the uploaded media (photo or video)
    res.json({ profilePhotoUrl: result.secure_url });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Error uploading media", error });
  }
});

// Route which will upload media to cloudinary (photos and videos)
router.post("/:userID/upload-media", upload.single("media"), async (req, res) => {

    try {
        // Get the user from the database using the userID in the route params
        const user = await User.findById(req.params.userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user already has 4 media items
        if (user.media.length >= 4) {
            return res.status(400).json({
                message: "You already have 4 media items. Please delete one before uploading a new one.",
            });
        }

        let result;

        // Check if the uploaded file is an image or video
        if (req.file.mimetype.startsWith("image/")) {
            // Handle image upload
            result = await cloudinary.uploader.upload(req.file.path, {
                folder: "user_media",  // Media will be uploaded to 'user_media' folder
            });
        } else if (req.file.mimetype.startsWith("video/")) {
            // Handle video upload
            result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "video",  // Specify resource type as video
                folder: "user_media",    // Media will be uploaded to 'user_media' folder
            });
        } else {
            return res.status(400).json({ message: "Unsupported file type" });
        }

        // Add the uploaded media URL to the user's media array
        user.media.push(result.secure_url);  // Assuming 'media' is an array field in your User model

        // Save the updated user document
        await user.save();

        // Return the URL of the uploaded media (photo or video)
        res.json({ mediaUrl: result.secure_url });
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: "Error uploading media", error });
    }
});

// Route to delete media from user's media array without removing it from Cloudinary
router.delete("/:userID/delete-media", async (req, res) => {
  const { mediaUrl } = req.body;

  try {
    // Get the user from the database using the userID in the route params
    const user = await User.findById(req.params.userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the media URL from the user's media array
    user.media = user.media.filter((url) => url !== mediaUrl);

    // Save the updated user document
    await user.save();

    // Return a success message
    res.json({ message: "Media removed from user profile successfully" });
  } catch (error) {
    console.log("Error removing media from user profile:", error);
    res.status(500).json({ message: "Error removing media from user profile", error });
  }
});

module.exports = router;
