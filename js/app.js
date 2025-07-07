document.getElementById('emailForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = 'Sending...';
    
    const email1 = document.getElementById('email1').value;
    const email2 = document.getElementById('email2').value;
    const value = document.getElementById('value').value;
    
    try {
      // Call your Netlify function
      const response = await fetch('https://boardgamecommits.netlify.app/.netlify/functions/send-email', {
        method: 'POST',
        body: JSON.stringify({ email1, email2, value }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        statusDiv.textContent = 'Emails sent successfully!';
        // Reset form
        document.getElementById('emailForm').reset();
      } else {
        statusDiv.textContent = `Error: ${result.error || 'Unknown error'}`;
      }
    } catch (error) {
      statusDiv.textContent = `Error: ${error.message}`;
    }
  });


  document.getElementById('emailForm').addEventListener('test', async function(e) {
    e.preventDefault();
    
    // const statusDiv = document.getElementById('status');
    // statusDiv.textContent = 'Generating...';
    
    // const email1 = document.getElementById('email1').value;
    // const email2 = document.getElementById('email2').value;
    const value = document.getElementById('value').value;
    


      

      

  });

async function verifyHash(event) {
  event.preventDefault();
  
  const value = document.getElementById('hashValue').value;
  const key = document.getElementById('hashKey').value;
  const providedHash = document.getElementById('providedHash').value;
  const calculatedHashDiv = document.getElementById('calculatedHash');
  const hashComparisonDiv = document.getElementById('hashComparison');

  try {
    // Combine value and key for hashing
    const input = value + key;
    const msgBuffer = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Display calculated hash
    calculatedHashDiv.textContent = `Calculated Hash: ${calculatedHash}`;

    // Compare hashes and display result
    if (calculatedHash === providedHash.toLowerCase()) {
      hashComparisonDiv.style.backgroundColor = '#28a745';
      hashComparisonDiv.style.padding = '0.5rem';
      hashComparisonDiv.style.borderRadius = '4px';
      hashComparisonDiv.textContent = 'Hashes match!';
    } else {
      hashComparisonDiv.style.backgroundColor = '#dc3545';
      hashComparisonDiv.style.padding = '0.5rem';
      hashComparisonDiv.style.borderRadius = '4px';
      hashComparisonDiv.textContent = 'Hashes do not match!';
    }
  } catch (error) {
    hashComparisonDiv.style.backgroundColor = '#dc3545';
    hashComparisonDiv.style.padding = '0.5rem';
    hashComparisonDiv.style.borderRadius = '4px';
    hashComparisonDiv.textContent = `Error: ${error.message}`;
  }
}

document.getElementById('hashForm').addEventListener('submit', verifyHash);