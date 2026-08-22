'use client';

import { useEffect } from 'react';

// Your Adsterra IDs
const AD_IDS = {
  popunder1: '606985228f68d2eb3d290b4de5060cb7',
  popunder2: 'f51fe4776b368665400a2f434091fec6',
  native: '002932bd587b2a8a1144a8840581dea2',
  banner1: 'f8bab802185c8ed3a7d9716602800f40',
  sidebar: 'c956fcc82f6237953c6a36681123e053',
  ad6: 'e1fab3e807877144ce91bd0eda6951bc',
};

export function AdPopunder() {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = `https://guyprior.com/60/69/85/${AD_IDS.popunder1}.js`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = `https://guyprior.com/f5/1f/e4/${AD_IDS.popunder2}.js`;
    document.head.appendChild(script2);

    const exitKey = 'adsterra_exit_shown';
    const handleExitIntent = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        const lastExit = sessionStorage.getItem(exitKey);
        if (!lastExit || (Date.now() - parseInt(lastExit)) > 60 * 60 * 1000) {
          sessionStorage.setItem(exitKey, Date.now().toString());
          
          const exitScript = document.createElement('script');
          exitScript.src = `https://guyprior.com/ja5sjb490?key=${AD_IDS.ad6}`;
          document.head.appendChild(exitScript);
        }
      }
    };

    document.addEventListener('mouseleave', handleExitIntent);
    return () => document.removeEventListener('mouseleave', handleExitIntent);
  }, []);

  return null;
}

export function AdNative() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://guyprior.com/${AD_IDS.native}/invoke.js`;
    script.async = true;
    script.dataset.cfasync = 'false';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="my-8 flex justify-center">
      <div 
        id={`container-${AD_IDS.native}`}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
}

export function AdBanner() {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      atOptions = {
        'key' : '${AD_IDS.banner1}',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;
    document.body.appendChild(script);

    const invokeScript = document.createElement('script');
    invokeScript.src = `https://guyprior.com/${AD_IDS.banner1}/invoke.js`;
    document.body.appendChild(invokeScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(invokeScript);
    };
  }, []);

  return (
    <div className="flex justify-center my-4">
      <div className="bg-surface-elevated rounded-lg overflow-hidden min-h-[60px] flex items-center justify-center">
      </div>
    </div>
  );
}

export function AdSidebar() {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      atOptions = {
        'key' : '${AD_IDS.sidebar}',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
    document.body.appendChild(script);

    const invokeScript = document.createElement('script');
    invokeScript.src = `https://guyprior.com/${AD_IDS.sidebar}/invoke.js`;
    document.body.appendChild(invokeScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(invokeScript);
    };
  }, []);

  return (
    <div className="sticky top-32">
      <div className="bg-surface-elevated rounded-lg overflow-hidden min-h-[250px] flex items-center justify-center">
      </div>
    </div>
  );
}

export function AdSocial() {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      atOptions = {
        'key' : '${AD_IDS.banner1}',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;
    document.body.appendChild(script);

    const invokeScript = document.createElement('script');
    invokeScript.src = `https://guyprior.com/${AD_IDS.banner1}/invoke.js`;
    document.body.appendChild(invokeScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(invokeScript);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 border-t border-gray-800/50">
      <div className="flex justify-center py-2">
        <div className="bg-surface-elevated rounded-lg overflow-hidden min-h-[60px] flex items-center justify-center">
        </div>
      </div>
    </div>
  );
}
