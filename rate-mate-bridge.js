const RateMate = (() => {
  const RATE_MATE_URL = './rate-mate.html';
  let initialized = false;

  function init() {
    const btn = document.getElementById('btnRateMate');
    if (!btn || initialized) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const miles = extractMiles();
      
      // 1. Updated to grab the value from the HIDDEN input updated by your chips
      const hiddenVeh = document.getElementById('suggestedVehicle');
      let vehicle = hiddenVeh ? hiddenVeh.value : 'LWB';

      const pcA = document.getElementById('pcA')?.value || '';
      const pcB = document.getElementById('pcB')?.value || '';
      const distTxt = document.getElementById('distance')?.textContent || '';
      const waypointCount = window.currentWaypointCount || 0;
      
      launch({ miles, vehicle, pcA, pcB, distTxt, waypointCount });
    });
    initialized = true;
  }

  function extractMiles() {
    const txt = document.getElementById('distance')?.textContent || '';
    const match = txt.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
  }

  function launch(data) {
    const card = document.getElementById('rateMateCard');
    const iframe = document.getElementById('rateMateFrame');
    if (!card || !iframe) return;

    card.style.display = 'block';
    if (!iframe.src.includes('rate-mate.html')) iframe.src = RATE_MATE_URL;

    const send = () => {
      iframe.contentWindow.postMessage({ type: 'rate-mate', ...data }, '*');
    };

    iframe.onload = send;
    send(); 
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return { 
    init, 
    showButton: () => { document.getElementById('btnRateMate').style.display = 'inline-block'; } 
  };
})();
RateMate.init();