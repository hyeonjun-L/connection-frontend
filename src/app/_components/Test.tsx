'use client';
import React, { useEffect, useState } from 'react';

const Test = () => {
  const [show, setShow] = useState(false);
  const [prompt, setPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault();
      setPrompt(event);

      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShow(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (prompt) {
      prompt.prompt();

      prompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Accepted');
        } else {
          console.log('Cancelled');
        }

        setPrompt(null);
        setShow(false);
      });
    }
  };

  return show && <button onClick={handleInstallClick}>앱 설치하기</button>;
};

export default Test;
