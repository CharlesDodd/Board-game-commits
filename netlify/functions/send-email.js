// const sgMail = require('@sendgrid/mail');

// exports.handler = async function(event, context) {
//   // Set up CORS headers to reuse
//   const corsHeaders = {
//     "Access-Control-Allow-Origin": "*", // In production, restrict to your domain
//     "Access-Control-Allow-Headers": "Content-Type",
//     "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
//   };
  
//   // Handle OPTIONS request (for CORS preflight)
//   if (event.httpMethod === "OPTIONS") {
//     return {
//       statusCode: 200,
//       headers: corsHeaders,
//       body: ""
//     };
//   }
  
//   // Handle GET requests (for testing)
//   if (event.httpMethod === "GET") {
//     return {
//       statusCode: 200,
//       headers: corsHeaders,
//       body: JSON.stringify({ message: "Send email function is working!" })
//     };
//   }

//   // Handle POST requests (actual email sending)
//   if (event.httpMethod === "POST") {
//     try {

//     // Parse the incoming JSON
//     const data = JSON.parse(event.body);
//     const { email1, email2, value } = data;
    
//     // Validate inputs here
//     if (!email1 || !email2 || !value) {
//       return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
//     }
    
//     // Set SendGrid API key (stored in Netlify environment variables)
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY_2);
    
//     // Create email content based on value
//     const emailContent = `Your submitted value is: ${value}`;
    
//     // Send emails to both addresses
//     const msg1 = {
//       to: email1,
//       from: 'boardgamecommits@gmail.com', // Must be verified in SendGrid
//       subject: 'Your App Notification',
//       text: emailContent,
//     };
    
//     const msg2 = {
//       to: email2,
//       from: 'boardgamecommits@gmail.com',
//       subject: 'Your App Notification',
//       text: emailContent,
//     };
    
//     // Send both emails
//     await Promise.all([
//       sgMail.send(msg1),
//       sgMail.send(msg2)
//     ]);
    
//     return {
//         statusCode: 200,
//         headers: corsHeaders,
//         body: JSON.stringify({ message: "Emails sent successfully" })
//       };
//     } catch (error) {
//       console.log('Error sending email:', error);
//       return {
//         statusCode: 500,
//         headers: corsHeaders,
//         body: JSON.stringify({ error: "Failed to send emails" })
//       };
//     }
//   }

//   // If method is neither GET, POST, nor OPTIONS
//   return {
//     statusCode: 405,
//     headers: corsHeaders,
//     body: JSON.stringify({ error: "Method Not Allowed" })
//   };
// };





// // netlify/functions/send-email.js
// const sgMail = require('@sendgrid/mail');

// exports.handler = async (event, context) => {
//   // Only allow POST requests
//   if (event.httpMethod !== 'POST') {
//     return {
//       statusCode: 405,
//       body: JSON.stringify({ error: 'Method Not Allowed' })
//     };
//   }

//   // Set up CORS headers
//   const headers = {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Headers': 'Content-Type',
//     'Access-Control-Allow-Methods': 'POST, OPTIONS'
//   };

//   // Handle preflight OPTIONS request
//   if (event.httpMethod === 'OPTIONS') {
//     return {
//       statusCode: 200,
//       headers,
//       body: ''
//     };
//   }

//   try {
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
//     const { to, from, subject, text, html } = JSON.parse(event.body);
    
//     const msg = {
//       to,
//       from,
//       subject,
//       text,
//       html
//     };

//     await sgMail.send(msg);

//     return {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify({ message: 'Email sent successfully' })
//     };
//   } catch (error) {
//     console.error('Error sending email:', error);
//     return {
//       statusCode: 500,
//       headers,
//       body: JSON.stringify({ 
//         error: 'Failed to send email',
//         details: error.message 
//       })
//     };
//   }
// };


// netlify/functions/send-email.js
const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  console.log('Function called with method:', event.httpMethod);
  
  // Set up CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Check if SENDGRID_API_KEY exists
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY environment variable is not set');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'SendGrid API key not configured' })
      };
    }

    console.log('Setting SendGrid API key...');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Check if body exists and parse it
    if (!event.body) {
      console.error('No request body provided');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' })
      };
    }

    console.log('Parsing request body...');
    let emailData;
    try {
      emailData = JSON.parse(event.body);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    console.log('Email data received:', { 
      to: emailData.to, 
      from: emailData.from, 
      subject: emailData.subject 
    });

    // Validate required fields
    const { to, from, subject, text, html } = emailData;
    if (!to || !from || !subject) {
      console.error('Missing required fields:', { to: !!to, from: !!from, subject: !!subject });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: to, from, subject' })
      };
    }

    const msg = {
      to,
      from,
      subject,
      text: text || 'No text content',
      html: html || `<p>${text || 'No content'}</p>`
    };

    console.log('Attempting to send email...');
    const response = await sgMail.send(msg);
    console.log('Email sent successfully:', response[0].statusCode);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Email sent successfully',
        statusCode: response[0].statusCode
      })
    };

  } catch (error) {
    console.error('Detailed error information:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error response body:', JSON.stringify(error.response?.body, null, 2));
    console.error('SendGrid errors array:', error.response?.body?.errors);
    console.error('Full error:', error);

    // Return different error messages based on the error type
    let errorMessage = 'Failed to send email';
    let statusCode = 500;

    if (error.code === 403) {
      errorMessage = 'SendGrid authentication failed - check API key and permissions';
    } else if (error.code === 401) {
      errorMessage = 'SendGrid API key is invalid';
    } else if (error.code === 400) {
      errorMessage = 'Invalid email data provided';
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        details: error.message,
        code: error.code
      })
    };
  }
};