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

      // Build a direct URL with the data inside it
      const params = new URLSearchParams({
          miles: data.miles,
          vehicle: data.vehicle,
          pcA: data.pcA,
          pcB: data.pcB,
          viaText: data.viaText,
          waypointCount: data.waypointCount
      });

      card.style.display = 'block';
      // This loads the page with the data already attached
      iframe.src = `${RATE_MATE_URL}?${params.toString()}`;
      
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