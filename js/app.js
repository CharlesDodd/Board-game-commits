document.getElementById('emailForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = 'Sending...';
    
    const email1 = document.getElementById('email1').value;
    const email2 = document.getElementById('email2').value;
    const value = document.getElementById('value').value;
    
    try {
      // Call your Netlify function
      const response = await fetch('/.netlify/functions/send-email', {
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