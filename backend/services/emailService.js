const nodemailer = require("nodemailer")
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Use 465 for SSL
  secure: false, // Set to true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
})

/**
 * Generates a login notification email
 * @param {string} userEmail - The recipient's email
 * @param {Object} data - Additional data for the email
 * @param {string} data.location - Login location (optional)
 * @param {string} data.device - Device used for login (optional)
 * @param {string} data.time - Time of login (optional)
 * @param {string} data.ipAddress - IP address of login (optional)
 */
const sendLoginNotification = async (userEmail, data = {}) => {
  const {
    location = "Unknown location",
    device = "Unknown device",
    time = new Date().toLocaleString(),
    ipAddress = "Unknown IP",
  } = data

  const subject = "Pando Tennis - New Login Detected"

  // Plain text version
  const text = `
    Hello Pando Member,
    
    We detected a new login to your Pando Tennis account.
    
    Login details:
    - Time: ${time}
    - Location: ${location}
    - Device: ${device}
    - IP Address: ${ipAddress}
    
    If this was you, you can ignore this message. If you didn't log in recently, please secure your account by changing your password immediately.
    
    Need help? Contact our support team at support@pandotennis.com
    
    Best regards,
    The Pando Tennis Team
  `

  // HTML version with styling
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Notification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; background-color: #f7f7f7;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f7f7;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <!-- Header with Logo -->
              <tr>
                <td align="center" style="padding: 30px 0; background: linear-gradient(to right, #4f46e5, #8b5cf6);">
                  <img src="https://i.imgur.com/YourLogoHere.png" alt="Pando Tennis" width="150" style="display: block; border: 0;">
                  <h1 style="color: #ffffff; margin: 10px 0 0; font-size: 24px; font-weight: 600;">Pando Tennis</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td>
                        <h2 style="margin: 0 0 20px; color: #4f46e5; font-size: 20px; font-weight: 600;">New Login Detected</h2>
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">Hello Pando Member,</p>
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">We detected a new login to your Pando Tennis account. Here are the details:</p>
                        
                        <!-- Login Details Box -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 6px; border-left: 4px solid #4f46e5;">
                          <tr>
                            <td style="padding: 20px;">
                              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                  <td width="20" style="vertical-align: top; padding-right: 10px;">
                                    <div style="width: 20px; height: 20px; background-color: #4f46e5; border-radius: 50%;"></div>
                                  </td>
                                  <td style="vertical-align: top;">
                                    <p style="margin: 0 0 10px; font-size: 14px; line-height: 1.5;"><strong>Time:</strong> ${time}</p>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20" style="vertical-align: top; padding-right: 10px;">
                                    <div style="width: 20px; height: 20px; background-color: #4f46e5; border-radius: 50%;"></div>
                                  </td>
                                  <td style="vertical-align: top;">
                                    <p style="margin: 0 0 10px; font-size: 14px; line-height: 1.5;"><strong>Location:</strong> ${location}</p>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20" style="vertical-align: top; padding-right: 10px;">
                                    <div style="width: 20px; height: 20px; background-color: #4f46e5; border-radius: 50%;"></div>
                                  </td>
                                  <td style="vertical-align: top;">
                                    <p style="margin: 0 0 10px; font-size: 14px; line-height: 1.5;"><strong>Device:</strong> ${device}</p>
                                  </td>
                                </tr>
                                <tr>
                                  <td width="20" style="vertical-align: top; padding-right: 10px;">
                                    <div style="width: 20px; height: 20px; background-color: #4f46e5; border-radius: 50%;"></div>
                                  </td>
                                  <td style="vertical-align: top;">
                                    <p style="margin: 0; font-size: 14px; line-height: 1.5;"><strong>IP Address:</strong> ${ipAddress}</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">If this was you, you can ignore this message. If you didn't log in recently, please secure your account by changing your password immediately.</p>
                        
                        <!-- Action Button -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="https://pandotennis.com/account/security" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 4px; font-size: 16px;">Secure My Account</a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 30px 0 0; font-size: 16px; line-height: 1.5;">Need help? <a href="mailto:support@pandotennis.com" style="color: #4f46e5; text-decoration: underline;">Contact our support team</a>.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 20px 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="text-align: center;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">© 2023 Pando Tennis. All rights reserved.</p>
                        <p style="margin: 0; font-size: 12px; color: #6b7280;">
                          This is an automated message, please do not reply directly to this email.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  try {
    const info = await transporter.sendMail({
      from: `"Pando Tennis" <pandotennis@gmail.com>`,
      to: userEmail,
      subject,
      text,
      html,
    })

    console.log("Login notification email sent successfully:", info.messageId)
    return info
  } catch (error) {
    console.error("Error sending login notification email:", error)
    throw new Error("Failed to send login notification email")
  }
}

/**
 * Sends a connection request notification email
 * @param {string} userEmail - The recipient's email
 * @param {Object} data - Additional data for the email
 * @param {string} data.requesterName - Name of the user sending the request
 * @param {string} data.requesterPhoto - Profile photo URL of the requester (optional)
 * @param {string} data.requesterId - ID of the requester
 * @param {string} data.requesterUTR - UTR rating of the requester (optional)
 * @param {string} data.requesterLocation - Location of the requester (optional)
 */
const sendConnectionRequestEmail = async (userEmail, data = {}) => {
  const {
    requesterName = "A Pando Tennis User",
    requesterPhoto = "",
    requesterId = "",
    requesterUTR = "Not specified",
    requesterLocation = "Not specified",
  } = data

  const subject = "New Connection Request on Pando Tennis"

  // Plain text version
  const text = `
    Hello Pando Member,
    
    ${requesterName} has sent you a connection request on Pando Tennis.
    
    Player details:
    - UTR Rating: ${requesterUTR}
    - Location: ${requesterLocation}
    
    To view this request and respond, please log in to your Pando Tennis account.
    
    Best regards,
    The Pando Tennis Team
  `

  // HTML version with styling
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Connection Request</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; background-color: #f7f7f7;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f7f7;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <!-- Header with Logo -->
              <tr>
                <td align="center" style="padding: 30px 0; background: linear-gradient(to right, #4f46e5, #8b5cf6);">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Pando Tennis</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td>
                        <h2 style="margin: 0 0 20px; color: #4f46e5; font-size: 20px; font-weight: 600;">New Connection Request</h2>
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">Hello Pando Member,</p>
                        
                        <!-- User Profile Card -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; overflow: hidden;">
                          <tr>
                            <td style="padding: 20px; text-align: center;">
                              <!-- Profile Photo -->
                              ${
                                requesterPhoto
                                  ? `<img src="${requesterPhoto}" alt="${requesterName}" width="80" height="80" style="border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 3px solid #4f46e5;">`
                                  : `<div style="width: 80px; height: 80px; border-radius: 50%; background-color: #4f46e5; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; margin-bottom: 15px;">${requesterName.charAt(0)}</div>`
                              }
                              
                              <!-- Name -->
                              <h3 style="margin: 0 0 10px; font-size: 18px; color: #111827;">${requesterName}</h3>
                              
                              <!-- Details -->
                              <p style="margin: 0 0 5px; font-size: 14px; color: #4b5563;"><strong>UTR Rating:</strong> ${requesterUTR}</p>
                              <p style="margin: 0 0 15px; font-size: 14px; color: #4b5563;"><strong>Location:</strong> ${requesterLocation}</p>
                              
                              <p style="margin: 0 0 20px; font-size: 16px; font-style: italic; color: #6b7280;">wants to connect with you on Pando Tennis</p>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">Connecting with ${requesterName} will allow you to message each other and arrange tennis matches.</p>
                        
                        <!-- Action Buttons -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <div>
                                <!-- Accept Button -->
                                <a href="https://pandotennis.com/connections/accept/${requesterId}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 4px; font-size: 16px; margin-right: 10px;">Accept Request</a>
                                
                                <!-- View Profile Button -->
                                <a href="https://pandotennis.com/profile/${requesterId}" style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #4f46e5; text-decoration: none; font-weight: 600; border-radius: 4px; font-size: 16px; border: 1px solid #4f46e5;">View Profile</a>
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.5; color: #6b7280;">You can manage all your connection requests in your <a href="https://pandotennis.com/connections" style="color: #4f46e5; text-decoration: underline;">Pando Tennis account</a>.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 20px 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="text-align: center;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">© 2023 Pando Tennis. All rights reserved.</p>
                        <p style="margin: 0; font-size: 12px; color: #6b7280;">
                          This is an automated message, please do not reply directly to this email.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  try {
    const info = await transporter.sendMail({
      from: `"Pando Tennis" <pandotennis@gmail.com>`,
      to: userEmail,
      subject,
      text,
      html,
    })

    console.log("Connection request email sent successfully:", info.messageId)
    return info
  } catch (error) {
    console.error("Error sending connection request email:", error)
    throw new Error("Failed to send connection request email")
  }
}

/**
 * Sends a connection acceptance notification email
 * @param {string} userEmail - The recipient's email
 * @param {Object} data - Additional data for the email
 * @param {string} data.acceptorName - Name of the user who accepted the request
 * @param {string} data.acceptorPhoto - Profile photo URL of the acceptor (optional)
 * @param {string} data.acceptorId - ID of the acceptor
 * @param {string} data.acceptorUTR - UTR rating of the acceptor (optional)
 * @param {string} data.acceptorLocation - Location of the acceptor (optional)
 */
const sendConnectionAcceptedEmail = async (userEmail, data = {}) => {
  const {
    acceptorName = "A Pando Tennis User",
    acceptorPhoto = "",
    acceptorId = "",
    acceptorUTR = "Not specified",
    acceptorLocation = "Not specified",
  } = data

  const subject = "Connection Request Accepted on Pando Tennis"

  // Plain text version
  const text = `
    Hello Pando Member,
    
    Great news! ${acceptorName} has accepted your connection request on Pando Tennis.
    
    Player details:
    - UTR Rating: ${acceptorUTR}
    - Location: ${acceptorLocation}
    
    You can now message each other and arrange tennis matches. Start a conversation today!
    
    Best regards,
    The Pando Tennis Team
  `

  // HTML version with styling
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Connection Request Accepted</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; background-color: #f7f7f7;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f7f7;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <!-- Header with Logo -->
              <tr>
                <td align="center" style="padding: 30px 0; background: linear-gradient(to right, #4f46e5, #8b5cf6);">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Pando Tennis</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td>
                        <h2 style="margin: 0 0 20px; color: #4f46e5; font-size: 20px; font-weight: 600;">Connection Request Accepted!</h2>
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">Hello Pando Member,</p>
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">Great news! <strong>${acceptorName}</strong> has accepted your connection request on Pando Tennis.</p>
                        
                        <!-- User Profile Card -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px; background-color: #f0fdf4; border-radius: 8px; overflow: hidden; border: 1px solid #86efac;">
                          <tr>
                            <td style="padding: 20px; text-align: center;">
                              <!-- Profile Photo -->
                              ${
                                acceptorPhoto
                                  ? `<img src="${acceptorPhoto}" alt="${acceptorName}" width="80" height="80" style="border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 3px solid #22c55e;">`
                                  : `<div style="width: 80px; height: 80px; border-radius: 50%; background-color: #22c55e; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; margin-bottom: 15px;">${acceptorName.charAt(0)}</div>`
                              }
                              
                              <!-- Name -->
                              <h3 style="margin: 0 0 10px; font-size: 18px; color: #111827;">${acceptorName}</h3>
                              
                              <!-- Details -->
                              <p style="margin: 0 0 5px; font-size: 14px; color: #4b5563;"><strong>UTR Rating:</strong> ${acceptorUTR}</p>
                              <p style="margin: 0 0 15px; font-size: 14px; color: #4b5563;"><strong>Location:</strong> ${acceptorLocation}</p>
                              
                              <p style="margin: 0 0 5px; font-size: 16px; color: #15803d;">You are now connected!</p>
                              <p style="margin: 0; font-size: 14px; color: #4b5563;">You can now message each other and arrange tennis matches.</p>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Action Buttons -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <div>
                                <!-- Message Button -->
                                <a href="https://pandotennis.com/messages/new/${acceptorId}" style="display: inline-block; padding: 12px 24px; background-color: #22c55e; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 4px; font-size: 16px; margin-right: 10px;">Send a Message</a>
                                
                                <!-- View Profile Button -->
                                <a href="https://pandotennis.com/profile/${acceptorId}" style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #4f46e5; text-decoration: none; font-weight: 600; border-radius: 4px; font-size: 16px; border: 1px solid #4f46e5;">View Profile</a>
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 30px 0 0; font-size: 16px; line-height: 1.5;">Ready to play? Suggest a time and location to get your first match scheduled!</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 20px 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="text-align: center;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">© 2023 Pando Tennis. All rights reserved.</p>
                        <p style="margin: 0; font-size: 12px; color: #6b7280;">
                          This is an automated message, please do not reply directly to this email.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  try {
    const info = await transporter.sendMail({
      from: `"Pando Tennis" <pandotennis@gmail.com>`,
      to: userEmail,
      subject,
      text,
      html,
    })

    console.log("Connection accepted email sent successfully:", info.messageId)
    return info
  } catch (error) {
    console.error("Error sending connection accepted email:", error)
    throw new Error("Failed to send connection accepted email")
  }
}

/**
 * Sends a new message notification email
 * @param {string} userEmail - The recipient's email
 * @param {Object} data - Additional data for the email
 * @param {string} data.senderName - Name of the user who sent the message
 * @param {string} data.senderPhoto - Profile photo URL of the sender (optional)
 * @param {string} data.senderId - ID of the sender
 * @param {string} data.messagePreview - Preview of the message content
 * @param {string} data.chatId - ID of the chat
 */
const sendNewMessageEmail = async (userEmail, data = {}) => {
  const {
    senderName = "A Pando Tennis User",
    senderPhoto = "",
    senderId = "",
    messagePreview = "You have a new message...",
    chatId = "",
  } = data

  const subject = `New Message from ${senderName} on Pando Tennis`

  // Plain text version
  const text = `
    Hello Pando Member,
    
    You have received a new message from ${senderName} on Pando Tennis.
    
    Message preview:
    "${messagePreview.length > 100 ? messagePreview.substring(0, 97) + "..." : messagePreview}"
    
    To view the full message and reply, please log in to your Pando Tennis account.
    
    Best regards,
    The Pando Tennis Team
  `

  // Truncate message preview for HTML version
  const truncatedPreview = messagePreview.length > 100 ? messagePreview.substring(0, 97) + "..." : messagePreview

  // HTML version with styling
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Message</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; background-color: #f7f7f7;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f7f7;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <!-- Header with Logo -->
              <tr>
                <td align="center" style="padding: 30px 0; background: linear-gradient(to right, #4f46e5, #8b5cf6);">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Pando Tennis</h1>
                </td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td>
                        <h2 style="margin: 0 0 20px; color: #4f46e5; font-size: 20px; font-weight: 600;">New Message</h2>
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">Hello Pando Member,</p>
                        <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">You have received a new message from <strong>${senderName}</strong>.</p>
                        
                        <!-- Message Preview Card -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px; background-color: #f9fafb; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
                          <tr>
                            <td style="padding: 20px;">
                              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                  <td width="50" style="vertical-align: top; padding-right: 15px;">
                                    <!-- Sender Photo -->
                                    ${
                                      senderPhoto
                                        ? `<img src="${senderPhoto}" alt="${senderName}" width="50" height="50" style="border-radius: 50%; object-fit: cover;">`
                                        : `<div style="width: 50px; height: 50px; border-radius: 50%; background-color: #4f46e5; color: white; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold;">${senderName.charAt(0)}</div>`
                                    }
                                  </td>
                                  <td style="vertical-align: top;">
                                    <!-- Sender Name -->
                                    <p style="margin: 0 0 5px; font-size: 16px; font-weight: 600; color: #111827;">${senderName}</p>
                                    
                                    <!-- Message Preview -->
                                    <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4b5563; font-style: italic;">"${truncatedPreview}"</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Action Button -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="https://pandotennis.com/messages/${chatId}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 4px; font-size: 16px;">View & Reply</a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.5; color: #6b7280;">This message was sent to you because you are connected with ${senderName} on Pando Tennis.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 20px 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="text-align: center;">
                        <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">© 2023 Pando Tennis. All rights reserved.</p>
                        <p style="margin: 0; font-size: 12px; color: #6b7280;">
                          This is an automated message, please do not reply directly to this email.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  try {
    const info = await transporter.sendMail({
      from: `"Pando Tennis" <pandotennis@gmail.com>`,
      to: userEmail,
      subject,
      text,
      html,
    })

    console.log("New message email sent successfully:", info.messageId)
    return info
  } catch (error) {
    console.error("Error sending new message email:", error)
    throw new Error("Failed to send new message email")
  }
}

/**
 * General purpose email sending function
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Pando Tennis" <pandotennis@gmail.com>`,
      to,
      subject,
      text,
      html,
    })

    console.log("Email sent successfully:", info.messageId)
    return info
  } catch (error) {
    console.error("Error sending email:", error)
    throw new Error("Failed to send email")
  }
}

module.exports = {
  sendEmail,
  sendLoginNotification,
  sendConnectionRequestEmail,
  sendConnectionAcceptedEmail,
  sendNewMessageEmail,
}
