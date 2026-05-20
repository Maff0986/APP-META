const axios = require("axios");

exports.getPageToken = async (userToken) => {
  const res = await axios.get(
    "https://graph.facebook.com/me/accounts",
    {
      params: {
        access_token: userToken
      }
    }
  );

  const page = res.data.data[0];

  return {
    pageToken: page.access_token,
    pageId: page.id
  };
};