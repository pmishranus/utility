const axios = require('axios');

async function getMicrosoftAccessToken(tenantId, clientId, clientSecret, userEmail) {
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('scope', 'https://outlook.office365.com/.default');
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');
  // For delegated flows, you'd use 'password' grant_type or authorization_code

  const response = await axios.post(url, params);
  return response.data.access_token;
}

module.exports = {
  getMicrosoftAccessToken}