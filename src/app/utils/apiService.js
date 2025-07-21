// // API Service for Card Detection
// export const sendFrameToAPI = async (frame, phase, sessionId, frameNumber) => {
//   const maxRetries = 2;
//   let lastError = null;
  
//   for (let attempt = 1; attempt <= maxRetries; attempt++) {
//     try {
//       const formData = new FormData();
      
//       formData.append('file', frame, `${phase}_frame_${frameNumber}.jpg`);
//       formData.append('phase', phase);
//       formData.append('session_id', sessionId);
      
//       console.log(`Sending frame ${frameNumber} for ${phase} phase to API (attempt ${attempt})...`);
//     const storedScanURL = localStorage.getItem('scanURL');

      
//       const response = await fetch('https://cardapp.hopto.org/detect', {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'ngrok-skip-browser-warning': 'true'
//         }
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('API Error Response:', errorText);
//         throw new Error(`API request failed: ${response.status} - ${errorText}`);
//       }
      
//       const result = await response.json();
//       console.log(`API Response for frame ${frameNumber}:`, result);
//       return result;
      
//     } catch (error) {
//       console.error(`API request failed for frame ${frameNumber} (attempt ${attempt}):`, error);
//       lastError = error;
      
//       if (attempt < maxRetries) {
//         console.log(`Retrying frame ${frameNumber} in 1 second...`);
//         await new Promise(resolve => setTimeout(resolve, 1200));
//       }
//     }
//   }
  
//   throw lastError;
// };




// new working


// API Service for Card Detection
export const sendFrameToAPI = async (frame, phase, sessionId, frameNumber) => {
  const maxRetries = 2;
  let lastError = null;
  
  // Extract scan ID from URL
  const urlPath = window.location.pathname;
  const scanId = urlPath.split('/').pop(); // Gets the last segment of the URL
  
  if (!scanId) {
    throw new Error('Scan ID not found in URL');
  }
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const formData = new FormData();
      
      formData.append('file', frame, `${phase}_frame_${frameNumber}.jpg`);
      formData.append('phase', phase);
      formData.append('session_id', sessionId);
      
      console.log(`Sending frame ${frameNumber} for ${phase} phase to API (attempt ${attempt})...`);
      console.log(`Using scan ID from URL: ${scanId}`);
      
      const apiUrl = `https://cardapp.hopto.org/detect/card/${scanId}`;
      // const apiUrl = `https://de90b759b94b.ngrok-free.app/detect/card/${scanId}`;







      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log(`API Response for frame ${frameNumber}:`, result);
      return result;
      
    } catch (error) {
      console.error(`API request failed for frame ${frameNumber} (attempt ${attempt}):`, error);
      lastError = error;
      
      if (attempt < maxRetries) {
        console.log(`Retrying frame ${frameNumber} in 1 second...`);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
    }
  }
  
  throw lastError;
};


