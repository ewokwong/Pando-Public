"use client";

import React, { ReactNode } from 'react';

interface AuthPageContainerProps {
    children: ReactNode;
    [key: string]: any;
}

const AuthPageContainer: React.FC<AuthPageContainerProps> = ({ children, ...props }) => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden" {...props}>
            {/* Background Video */}
            <video 
                className="fixed top-0 left-0 w-full h-full object-cover z-0" 
                autoPlay 
                muted 
                loop 
                playsInline
            >
                <source src="https://res.cloudinary.com/dsnrydwvc/video/upload/v1743334534/Pando/xtajgl9boexhucbb5bh1.mp4" type="video/mp4" />
            </video>
            
            {/* Overlay */}
            <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-10 flex items-center justify-center">
                {/* Content */}
                <div className="relative z-20 w-full px-4 md:px-6 py-4 max-w-md mx-auto bg-white rounded-lg shadow-lg">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthPageContainer;
