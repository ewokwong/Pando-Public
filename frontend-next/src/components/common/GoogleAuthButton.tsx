import React, { useEffect } from "react";
import { GoogleAuthProvider, getAuth, signInWithRedirect, getRedirectResult, User } from "firebase/auth";
import { app } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import "./GoogleAuthButton.css";

interface GoogleAuthButtonProps {
  className?: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ className }) => {
  const { setUserObject, setIsLoggedIn } = useAuth();

  const handleSignIn = (token: string, user: any) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    setUserObject(user);
    window.location.href = "/";
  };

  const createNewFirebaseUser = async (user: User) => {
    const apiBaseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth`;
    try {
      const response = await axios.post(`${apiBaseUrl}/add-firebase-user`, {
        firebaseUID: user.uid,
        email: user.email,
        displayName: user.displayName,
        profilePhoto: user.photoURL || "",
      });
      const newUserToken = response.data.token;
      handleSignIn(newUserToken, response.data.user);
    } catch (error: any) {
      console.error("Error creating new user:", error.message);
    }
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const auth = getAuth(app);
    signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    const auth = getAuth(app);
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          const user = result.user;
          const idToken = await user.getIdToken();
          const apiBaseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/user`;

          try {
            const userDetailsResponse = await axios.get(`${apiBaseUrl}/firebase/${user.uid}`, {
              headers: { Authorization: `Bearer ${idToken}` },
            });
            const userDetails = userDetailsResponse.data;
            const userToken = userDetails.token;
            handleSignIn(userToken, userDetails.user);
          } catch (apiError: any) {
            if (apiError.response && apiError.response.status === 404) {
              await createNewFirebaseUser(user);
            } else {
              console.error("Error retrieving user from the database:", apiError.message);
            }
          }
        }
      })
      .catch((error) => {
        console.error("Error during redirect result handling:", error);
      });
  }, []);

  return (
    <button 
      onClick={handleGoogleSignIn} 
      className={`google-auth-button ${className || ""}`.trim()}
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