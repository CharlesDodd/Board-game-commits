const sgMail = require('@sendgrid/mail');

exports.handler = async function(event, context) {
  // Set up CORS headers to reuse
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // In production, restrict to your domain
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };
  
  // Handle OPTIONS request (for CORS preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ""
    };
  }
  
  // Handle GET requests (for testing)
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Send email function is working!" })
    };
  }

  // Handle POST requests (actual email sending)
  if (event.httpMethod === "POST") {
    try {

    // Parse the incoming JSON
    const data = JSON.parse(event.body);
    const { email1, email2, value } = data;
    
    // Validate inputs here
    if (!email1 || !email2 || !value) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }
    
    // Set SendGrid API key (stored in Netlify environment variables)
    sgMail.setApiKey(process.env.SENDGRID_API_KEY_2);
    
    // Create email content based on value
    const emailContent = `Your submitted value is: ${value}`;
    
    // Send emails to both addresses
    const msg1 = {
      to: email1,
      from: 'boardgamecommits@gmail.com', // Must be verified in SendGrid
      subject: 'Your App Notification',
      text: emailContent,
    };
    
    const msg2 = {
      to: email2,
      from: 'boardgamecommits@gmail.com',
      subject: 'Your App Notification',
      text: emailContent,
    };
    
    // Send both emails
    await Promise.all([
      sgMail.send(msg1),
      sgMail.send(msg2)
    ]);
    
    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Emails sent successfully" })
      };
    } catch (error) {
      console.log('Error sending email:', error);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Failed to send emails" })
      };
    }
  }

  // If method is neither GET, POST, nor OPTIONS
  return {
    statusCode: 405,
    headers: corsHeaders,
    body: JSON.stringify({ error: "Method Not Allowed" })
  };
};