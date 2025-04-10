"use client";

import React, { ReactNode } from 'react';

interface MainPageContainerProps {
    children: ReactNode;
    [key: string]: any;
}

const MainPageContainer: React.FC<MainPageContainerProps> = ({ children, ...props }) => {
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
            <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-10"></div>
            
            {/* Content */}
            <div className="relative z-20 w-full px-4 md:px-6 max-w-7xl mx-auto pb-4 min-h-screen flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};

export default MainPageContainer;
