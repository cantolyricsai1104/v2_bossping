import React, { useState, useEffect } from 'react';

export function TypewriterText({ text, speed = 50, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayedText('');

    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
        if (index < text.length) {
          const nextChar = text.charAt(index);
          index++;
          return prev + nextChar;
        } else {
          clearInterval(intervalId);
          onComplete?.();
          return prev;
        }
      });
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, onComplete]);

  return <>{displayedText}</>;
}
