const {
  sendEmail,
  sendLoginNotification,
  sendConnectionRequestEmail,
  sendConnectionAcceptedEmail,
  sendNewMessageEmail,
} = require("../services/emailService")

/**
 * Send a general email
 */
const createMessage = async (req, res) => {
  const { receiverEmail, subject, message } = req.body

  try {
    const text = message // Plain text body

    // Create a simple HTML version with basic styling
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
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
                          <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">${message}</p>
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

    await sendEmail(receiverEmail, subject, text, html)

    res.status(201).json({ success: true, message: "Email sent successfully." })
  } catch (error) {
    console.error("Error sending email:", error)
    res.status(500).json({ success: false, error: "Failed to send email." })
  }
}

/**
 * Send a connection request notification
 */
const sendConnectionRequest = async (req, res) => {
  const { receiverEmail, requesterName, requesterPhoto, requesterId, requesterUTR, requesterLocation } = req.body;

  try {
    await sendConnectionRequestEmail(receiverEmail, {
      requesterName,
      requesterPhoto,
      requesterId,
      requesterUTR,
      requesterLocation,
    });

    res.status(201).json({ success: true, message: "Connection request notification sent successfully." });
  } catch (error) {
    console.error("Error sending connection request notification:", error);
    res.status(500).json({ success: false, error: "Failed to send connection request notification." });
  }
};

/**
 * Send a connection accepted notification
 */
const sendConnectionAccepted = async (req, res) => {
  const { receiverEmail, acceptorName, acceptorPhoto, acceptorId, acceptorUTR, acceptorLocation } = req.body

  try {
    await sendConnectionAcceptedEmail(receiverEmail, {
      acceptorName,
      acceptorPhoto,
      acceptorId,
      acceptorUTR,
      acceptorLocation,
    })

    res.status(201).json({ success: true, message: "Connection accepted notification sent successfully." })
  } catch (error) {
    console.error("Error sending connection accepted notification:", error)
    res.status(500).json({ success: false, error: "Failed to send connection accepted notification." })
  }
}

/**
 * Send a new message notification
 */
const sendNewMessage = async (req, res) => {
  const { receiverEmail, senderName, senderPhoto, senderId, messagePreview, chatId } = req.body

  try {
    await sendNewMessageEmail(receiverEmail, {
      senderName,
      senderPhoto,
      senderId,
      messagePreview,
      chatId,
    })

    res.status(201).json({ success: true, message: "New message notification sent successfully." })
  } catch (error) {
    console.error("Error sending new message notification:", error)
    res.status(500).json({ success: false, error: "Failed to send new message notification." })
  }
}

/**
 * Send a login notification email
 */
const sendLoginAlert = async (req, res) => {
  const { userEmail, location, device, ipAddress } = req.body

  try {
    const time = new Date().toLocaleString()

    await sendLoginNotification(userEmail, {
      location,
      device,
      time,
      ipAddress,
    })

    res.status(201).json({ success: true, message: "Login notification sent successfully." })
  } catch (error) {
    console.error("Error sending login notification:", error)
    res.status(500).json({ success: false, error: "Failed to send login notification." })
  }
}

module.exports = {
  createMessage,
  sendLoginAlert,
  sendConnectionRequest,
  sendConnectionAccepted,
  sendNewMessage,
}
