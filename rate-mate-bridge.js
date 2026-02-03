const RateMate = (() => {
  const RATE_MATE_URL = './rate-mate.html';
  let initialized = false;

  function init() {
    const btn = document.getElementById('btnRateMate');
    if (!btn || initialized) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const miles = extractMiles();
      const hiddenVeh = document.getElementById('suggestedVehicle');
      const vehicle = hiddenVeh ? hiddenVeh.value : 'LWB';
      
      const pcA = document.getElementById('pcA')?.value || '';
      const pcB = document.getElementById('pcB')?.value || '';
      const distTxt = document.getElementById('distance')?.textContent || '';
      
      // Capturing waypoints and text for the final quote
      const viaText = document.getElementById('pcVia')?.value || '';
      const waypointCount = window.currentWaypointCount || 0;
      
      launch({ miles, vehicle, pcA, pcB, distTxt, waypointCount, viaText });
    });
    initialized = true;
  }

  function extractMiles() {
      // Grabs the text "171.23 miles" from the JO-JO-SAN results
      const txt = document.getElementById('distance')?.textContent || '';
      console.log("Bridge found distance text:", txt);
      
      // This regex is now more aggressive to find any number (even with decimals)
      const match = txt.match(/(\d+\.?\d*)/);
      
      if (match) {
          const miles = parseFloat(match[1]);
          console.log("Extracted miles for RATE-MATE:", miles);
          return miles;
      }
      
      console.log("Could not find a number in distance text.");
      return null;
    }

  function launch(data) {
    const card = document.getElementById('rateMateCard');
    const iframe = document.getElementById('rateMateFrame');
    if (!card || !iframe) return;

    card.style.display = 'block';
    
    // Ensure the source is set
    if (!iframe.src.includes('rate-mate.html')) {
        iframe.src = RATE_MATE_URL;
    }

    const send = () => {
      console.log("Bridge sending data to RATE-MATE:", data);
      iframe.contentWindow.postMessage({ type: 'rate-mate', ...data }, '*');
    };

    // The Double-Tap:
    // 1. Try sending immediately if it's already loaded
    send(); 
    
    // 2. Try sending when the iframe finishes loading
    iframe.onload = send;
    
    // 3. Try one final time after 500ms as a fallback
    setTimeout(send, 500);

    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return { 
    init, 
    showButton: () => { 
        const btn = document.getElementById('btnRateMate');
        if(btn) btn.style.display = 'inline-block'; 
    } 
  };
})();

// Initialize the bridge
RateMate.init();