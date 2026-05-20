const axios = require('axios');

exports.login = (req, res) => {
  const redirectUri = process.env.META_REDIRECT_URI; // tu URL ngrok
  const appId = process.env.META_APP_ID;

  const authUrl = https://www.facebook.com/v19.0/dialog/oauth?client_id=&redirect_uri=&scope=pages_show_list,instagram_basic,whatsapp_business_messaging;

  res.redirect(authUrl);
};

exports.callback = async (req, res) => {
  const code = req.query.code;
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = process.env.META_REDIRECT_URI;

  try {
    const tokenResponse = await axios.get(
      https://graph.facebook.com/v19.0/oauth/access_token,
      {
        params: {
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Aquí guardas el token en tu modelo MetaToken.js
    res.json({ status: 'Auth OK', accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Auth failed' });
  }
};
