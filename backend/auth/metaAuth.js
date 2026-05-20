require("dotenv").config();

exports.loginUrl = () => {
  return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.META_APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=public_profile,pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish&response_type=code`;
};
