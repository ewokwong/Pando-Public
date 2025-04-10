import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup, User } from 'firebase/auth';
import { app } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import "./GoogleAuthButton.css"; // Import your CSS file

interface GoogleAuthButtonProps {
  className?: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ className }) => {
  const { setUserObject, setIsLoggedIn } = useAuth(); // Ensure these are destructured correctly

  // Function to handle sign-in and update AuthContext
  const handleSignIn = (token: string, user: any) => {
    // Store token in localStorage
    localStorage.setItem('token', token);

    // Set the logged-in state
    setIsLoggedIn(true);

    // Set user object
    setUserObject(user);

    // Navigate to the homepage
    window.location.href = '/'; // Use window.location.href for navigation
  };

  // To create a new user in the database when they sign in using Google Auth
  const createNewFirebaseUser = async (user: User) => {
    const apiBaseUrl = 'http://localhost:5001/api/auth'; // Update API base URL
    console.log("Adding a firebase user to DB");
    try {
      // Create a new user in the database
      const response = await axios.post(`${apiBaseUrl}/add-firebase-user`, {
        firebaseUID: user.uid,
        email: user.email,
        displayName: user.displayName,
        profilePhoto: user.photoURL || '',
      });

      // Extract the JWT token from the response
      const newUserToken = response.data.token;
      console.log('New user created:', response.data);

      // Call handleSignIn to update AuthContext and navigate
      handleSignIn(newUserToken, response.data.user); // Use the custom JWT token from the backend
    } catch (error: any) {
      console.error('Error creating new user:', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('Google Sign In');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      // User will be assigned based on the Google account
      const user = result.user;

      // Get Token and Sign with JWT
      const idToken = await user.getIdToken();
      console.log('Firebase ID Token:', idToken);

      const apiBaseUrl = 'http://localhost:5001/api/user'; // Update API base URL

      console.log("User previously signed-in:", user.uid);

      try {
        // Retrieve user details from the database
        const userDetailsResponse = await axios.get(`${apiBaseUrl}/firebase/${user.uid}`, {
          headers: { Authorization: `Bearer ${idToken}` }, // Pass the Firebase ID token to the backend
        });
        console.log('User exists, retrieving details...');
        const userDetails = userDetailsResponse.data;
        const userToken = userDetails.token; // Correctly extract the token from the response
        console.log('User details:', userDetails);

        // Call handleSignIn to update AuthContext and navigate
        handleSignIn(userToken, userDetails.user); // Use the custom JWT token from the backend

      } catch (apiError: any) {
        if (apiError.response && apiError.response.status === 404) {
          console.log('User does not exist in the database. Creating a new user...');
          await createNewFirebaseUser(user); // Call the function to create a new user
        } else {
          console.error('Error retrieving user from the database:', apiError.message);
          window.alert('Error retrieving user from the database. Please try again later.');
        }
      }
    } catch (error: any) {
      console.error('Error during Google Sign-In:', error);
      // Optionally, show a fallback message or log the error
    }
  };

  return (
    <button 
      onClick={handleGoogleSignIn} 
      className={`google-auth-button ${className || ''}`.trim()}
    >
      <img 
        src="https://res.cloudinary.com/dsnrydwvc/image/upload/v1743320517/png-transparent-google-company-text-logo-removebg-preview_jry9iw.png" 
        alt="Google Logo" 
        className="google-logo"
      />
      Sign in with Google
    </button>
  );
};

export default GoogleAuthButton;
