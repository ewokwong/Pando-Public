// Global Context File
"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios, { AxiosError } from 'axios'; // Import AxiosError for better error typing

// Define the shape of the decoded JWT token
interface DecodedToken {
    userId: string;
    exp: number;
}

// Define the shape of the user object (adjusted to match MongoDB schema)
interface UserObject {
    id: string;
    firebaseUID?: string;
    email: string;
    name: string;
    password?: string;
    profilePhoto: string;
    verified: boolean;
    UTR?: number;
    dob?: string;
    bio: string;
    friends: string[]; // Array of user IDs
    media: string[]; // Array of media URLs
    location: string;
    createdAt: string;
    userPreferences: {
        fun_social: boolean;
        training_for_competitions: boolean;
        fitness: boolean;
        learning_tennis: boolean;
    };
    profileComplete: boolean;
}

// Define the shape of the AuthContext
interface AuthContextType {
    userObject: UserObject | null;
    setUserObject: React.Dispatch<React.SetStateAction<UserObject | null>>;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    login: (email: string, password: string) => Promise<string | void>;
    signup: (
        email: string,
        name: string,
        dob: string,
        password: string,
        confirmPassword: string
    ) => Promise<string | void>;
    logout: () => void;
    errorMessage: string | null; // Add errorMessage to context
    setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>; // Add setter for errorMessage
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to provide context to your app
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State variables
    const [userObject, setUserObject] = useState<UserObject | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages

    // Will manage user sessions via local storage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode the token
                const decoded = jwtDecode<DecodedToken>(token);
                const userId = decoded.userId;

                // Check for expired token
                if (decoded.exp * 1000 > Date.now()) {
                    // Fetch user object
                    axios
                        .get(`http://localhost:5001/api/user/${userId}/get-user-object`, {
                            headers: { Authorization: `Bearer ${token}` },
                        })
                        .then((response) => {
                            const userData: UserObject = response.data; // Adjusted to match new structure
                            setUserObject(userData); // Store the user object
                        })
                        .catch((fetchError: AxiosError) => {
                            console.error('Error fetching user object:', fetchError.message);
                        });

                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false); // Token expired
                }
            } catch (decodeError) {
                console.error('Error decoding token:', decodeError);
                setIsLoggedIn(false); // Invalid token
            }
        } else {
            setIsLoggedIn(false); // No token found
        }
    }, []);

    // Login function
    const login = async (email: string, password: string): Promise<string | void> => {
        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email,
                password,
            });

            console.log("Login response:", response.data); // Log the response data
            console.log("Login status:", response.status); // Log the response status
            if (response.status === 200) {
                const token = response.data.token;

                // Store token in localStorage
                localStorage.setItem('token', token);

                // Set the logged-in state
                setIsLoggedIn(true);

                // Set user object
                setUserObject(response.data.user);

                setErrorMessage(null); // Clear any previous error messages
            }
        } catch (error: AxiosError | unknown) {
            if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.message as string); // Set error message
                return error.response.data.message as string;
            } else {
                const genericError = 'Something went wrong. Please try again.';
                setErrorMessage(genericError); // Set generic error message
                return genericError;
            }
        }
    };

    // Signup function
    const signup = async (
        email: string,
        name: string,
        dob: string,
        password: string,
        confirmPassword: string
    ): Promise<string | void> => {
        try {
            const response = await axios.post('http://localhost:5001/api/auth/signup', {
                email,
                name,
                dob,
                password,
                confirmPassword,
            });

            if (response.status === 201) {
                const token = response.data.token;
                localStorage.setItem('token', token);

                // Set logged-in state
                setIsLoggedIn(true);

                // Set user object
                setUserObject(response.data.user);

                setErrorMessage(null); // Clear any previous error messages
                return response.data.message;
            }
        } catch (error: AxiosError | unknown) {
            if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.message as string); // Set error message
                return error.response.data.message as string;
            } else {
                const genericError = 'Something went wrong. Please try again.';
                setErrorMessage(genericError); // Set generic error message
                return genericError;
            }
        }
    };

    // Logout function
    const logout = (): void => {
        localStorage.removeItem('token'); // Remove token from localStorage
        setIsLoggedIn(false); // Update the login state to false
        setUserObject(null); // Remove user object
        window.location.href = '/'; // Redirect to the homepage
    };

    return (
        <AuthContext.Provider
            value={{
                userObject,
                setUserObject,
                isLoggedIn,
                setIsLoggedIn,
                login,
                signup,
                logout,
                errorMessage, // Provide errorMessage
                setErrorMessage, // Provide setter for errorMessage
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};