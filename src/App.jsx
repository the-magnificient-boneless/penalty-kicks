import { useState, useEffect } from 'react';
import './App.css';
import penalty from '../public/penalty_kicks/index.html';
import Iframe from 'react-iframe';

function App() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleClick = async () => {
    setShowIframe(true);
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      await elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      await elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      await elem.msRequestFullscreen();
    }
  };

  return (
    
       
        <Iframe 
          url={penalty}
          width={`${dimensions.width}px`}
          height={`${dimensions.height}px`}
          id=""
          className=""
          display="block"
          position="relative"
        />
    
       
  );
}

export default App;
