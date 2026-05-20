const axios = require('axios');
const { Op } = require('sequelize');
const Post = require('../models/Post');

const scheduler = {};

const nowUtc = () => new Date();

scheduler.enqueuePost = async ({ content, mediaUrl, comments, scheduledAt, targetAccount }) => {
  const accounts = targetAccount === 'both'
    ? ['instagram', 'facebook']
    : [targetAccount || 'instagram'];

  const created = [];
  for (const account of accounts) {
    const post = await Post.create({
      content,
      mediaUrl,
      comments,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: 'scheduled',
      targetAccount: account
    });
    created.push(post);
  }
  return { enqueued: created.length };
};

scheduler.duePosts = async () => {
  const now = nowUtc();
  return Post.findAll({
    where: {
      scheduledAt: { [Op.lte]: now },
      status: 'scheduled'
    },
    order: [['scheduledAt', 'ASC']]
  });
};

scheduler.publishNow = async (postId) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    return { status: 'error', metaResponse: null };
  }

  const token = process.env.META_TOKEN || process.env.INSTAGRAM_TOKEN || process.env.FACEBOOK_TOKEN;
  const igBusinessId = process.env.INSTAGRAM_BUSINESS_ID;
  const graphBase = process.env.META_GRAPH_BASE || 'https://graph.facebook.com/v19.0';

  try {
    const createRes = await axios.post(
      `${graphBase}/${igBusinessId}/media`,
      {
        caption: post.content,
        image_url: post.mediaUrl
      },
      { params: { access_token: token } }
    );

    const creationId = createRes.data.id;

    const publishRes = await axios.post(
      `${graphBase}/${igBusinessId}/media_publish`,
      { creation_id: creationId },
      { params: { access_token: token } }
    );

    await post.update({
      status: 'published',
      publishedAt: new Date(),
      metaPostId: publishRes.data.id || creationId
    });

    return { status: 'published', metaResponse: publishRes.data };
  } catch (error) {
    const msg = error.response?.data?.error_message || error.message;
    await post.update({
      status: 'failed',
      errorMessage: msg
    });
    return { status: 'failed', metaResponse: { error: msg } };
  }
};

scheduler.preview = ({ content, mediaUrl }) => {
  const baseText = content || '(sin texto)';

  return {
    platforms: ['instagram', 'facebook'],
    previewMessages: [
      {
        platform: 'instagram',
        messageText: baseText,
        mediaPreview: {
          url: mediaUrl || null,
          type: mediaUrl ? 'image' : 'text-only'
        }
      },
      {
        platform: 'facebook',
        messageText: baseText,
        mediaPreview: {
          url: mediaUrl || null,
          type: mediaUrl ? 'image' : 'text-only'
        }
      }
    ]
  };
};

module.exports = scheduler;
