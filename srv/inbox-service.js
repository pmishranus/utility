const cds = require("@sap/cds");
const taskActionsCtrl = require("./controller/taskActions.controller")
const nodemailer = require('nodemailer');
const { retrieveJwt, getDestination } = require('@sap-cloud-sdk/connectivity'); // 
const axios = require('axios');
const qs = require('qs');
class InboxService extends cds.ApplicationService {
  init() {
    this.on('taskactions', req => {
      let systemUserName = null; // this parameter is used for ECP_SYSTEM during retract
      return taskActionsCtrl.massTaskAction(req, systemUserName, null);
    }),

      this.on('sendEmail', async (req) => {
        const { emailSubject, emailContent, mailMap, setPriority } = req.data.data;

        // === 1. Get Destination from BTP Destination Service ===
        const destinationName = 'BTP_EMAIL_OAUTH';
        let destination;
        try {
          // If running on BTP, pass req headers to get user JWT for principal propagation.
          const userJwt = retrieveJwt(req);
          destination = await getDestination({ destinationName, jwt: userJwt });
          if (!destination) throw new Error('Destination not found.');
        } catch (err) {
          return `Error fetching destination: ${err.message}`;
        }

        // === 2. (Optional) Fetch OAuth2 Token ===
        // If your destination is set up for OAuth2 SAML Bearer, SAP Cloud SDK can fetch a token for you;
        // for client credential flows, you may need to get it yourself with client id/secret.
        let accessToken = null;
        // ... fetch logic here (use destination.authTokens[0].value if provided) ...
        if (destination.authTokens && destination.authTokens.length) {
          accessToken = destination.authTokens[0].value;
        } else {
          return 'No OAuth2 token found in destination. Please check your destination/service binding.';
        }


        //handling refresh token

        let oDestinationConfiguration = destination.originalProperties.destinationConfiguration;

        const data = {
          client_id: oDestinationConfiguration.clientId,
          grant_type: 'refresh_token',
          refresh_token: '1.AVQAXu-lWwkxd06Fvc_rDTR-gkRWDqXjWitPsiUvftZYfWhUAPdUAA.AgABAwEAAABVrSpeuWamRam2jAF1XRQEAwDs_wUA9P8NqSTlxiEfVD4fAi2iTso9w3Cw5rtUnLrx5yWCqiu6msEdc4pEaP743tKgTpMyaRBhHr4p1drCCFy1dkZPGuAsAdgqRM9YJvf6B-U0g2XkUoc7F5yNlr1H5Hcg1p9YVpmrFRLQnjbqSIHzqfK74TBgIplxu96ZrWr2GUQ0MRxFSyOcgm9aoWf5DvhMcYSM2BEQ9Qhm2BygC66FXpWM2E8PozwvJXVz35uzrKF-4Q7mZ_ps6d7nCFsjE4XqH6gteacvQX3H-z1VOuv41dwpWihGxf_aa-EjbF92Wvs3e1rY1ZBvYzL8hRqSodOrS9fjlzKbov-42EPV2ie4gUdl2YG6E6iQPARBeDVoleS48HLVWCRQOHr73_8YzQx8ASvepny0Yo0jbIOfCQL7kXeqVnyP4SAGSOD6xZSMkcKzWR6mSUV2EDgqjPbQLe1nYJXxTaEx-g_cK_bk5kJ2hpON3Ql900TCTzn-CakbCFGpDTHmeTOt9bJtOprcKyM2st80FG4hTES92qf0qmZ-2OzIpYOGnCA77LGyqIVXd2nxSIzPRx-0OTeg-mPAH9Rjn24huryDykZh4Nc74OaSNZt_QXtBOwNZOEzEhso_EcaLkqENnKsXWFR8wkUNk8nMwALeNhFQMRJDBqo4f7ThxBVlBC9yMaV31pou9VivLVb6xPRb0uLcxd4vF9onhiWodS_WmA5rYrnrA_fC8feDKU7suv5f5QA72o43n53ZtLctNNKg45QkenDTp-U3gVwQBkZ3icf8JnEnHXtD2M3qj6GlyxKBeyjIGFMj1VlUn7wiNS_rwTNbLz1n3Cy-7ppKh1wsg1XtNB_LAAEzHyATDGF2i6o4',
          client_secret: oDestinationConfiguration.clientSecret,
        };
      

        const accessTokenResponse = await axios.post(oDestinationConfiguration.tokenServiceURL, qs.stringify(data), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        let accessTokenGen = accessTokenResponse.data;




        // === 3. Send Mail Using Nodemailer and XOAUTH2 ===
        let transporter = nodemailer.createTransport({
          host: oDestinationConfiguration["mail.smtp.host"],
          port: oDestinationConfiguration["mail.smtp.port"],
          secure: false, // usually true for port 465, false for 587
          auth: {
            type: 'OAuth2',
            user: oDestinationConfiguration["mail.username"],       // fetched from destination
            accessToken: accessTokenGen.access_token,         // fetched above
          },
          tls: {
            ciphers: 'TLSv1.2'
          }
        });

        let mailOptions = {
          from: oDestinationConfiguration["mail.smtp.from"],
          to: mailMap.to,
          subject: emailSubject,
          html: emailContent,
        };
        if (mailMap.cc) {
          mailOptions.cc = mailMap.cc;
        }
        if (setPriority) {
          mailOptions.headers = { 'X-Priority': '1' };
        }

        try {
         let emailResponse =  await transporter.sendMail(mailOptions);
          return emailResponse;
        } catch (error) {
          return "Error sending email: " + error.message;
        }
      });
    return super.init()
  }
}
module.exports = InboxService;