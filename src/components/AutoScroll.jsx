import React, { useState, useEffect, useRef } from 'react';

const AutoScroll = ({ isActive, speed = 1, scrollRef }) => {
  const intervalRef = useRef(null);
  
  useEffect(() => {
    if (isActive && scrollRef?.current) {
      intervalRef.current = setInterval(() => {
        scrollRef.current.scrollBy({
          top: speed,
          behavior: 'auto'
        });
      }, 50);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, speed, scrollRef]);
  
  return null;
};

export default AutoScroll;
