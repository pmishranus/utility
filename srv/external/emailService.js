
async function sendMail(subject, content, emailIdMap) {
    const tenantId = process.env.AZURE_TENANT_ID;
    const clientId = process.env.AZURE_CLIENT_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;
    const senderEmail = process.env.SENDER_EMAIL;
    // Fetch access token
    const accessToken = await getMicrosoftAccessToken(tenantId, clientId, clientSecret, senderEmail);

    // Create transport
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false, // TLS
        auth: {
            type: 'OAuth2',
            user: senderEmail,
            accessToken: accessToken,
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: '', // Not required for client_credentials
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    // Send mail
    let info = await transporter.sendMail({
        from: senderEmail,
        emailIdMap,
        subject,
        content,
    });

    console.log("Message sent: %s", info.messageId);
    return info;

}


module.exports = {
    sendMail
}