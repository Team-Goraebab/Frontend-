'use client';

import React, { useState, useEffect } from 'react';

const Splash: React.FC = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-blue_6 to-blue_4 flex items-center justify-center overflow-hidden">
      <div
        className={`text-center transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} transition-all duration-1000 ease-out`}>
        <h1 className="text-5xl font-bold text-white mb-4 font-montserrat">GORAEBAB</h1>
        <p className="text-xl text-blue_2 mb-8 font-pretendard">도커를 쉽고, 간편하게!</p>
        <div className="flex justify-center space-x-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center"
            >
              <div
                className={`w-8 h-8 bg-blue-400 rounded-md transform transition-transform duration-1000 ease-in-out ${showContent ? 'rotate-180 scale-110' : ''}`}
                style={{ transitionDelay: `${i * 200}ms` }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Splash;
