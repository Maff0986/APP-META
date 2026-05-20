const scheduler = require('./../services/scheduler.service');
const { Op } = require('sequelize');
const Post = require('../models/Post');

exports.publishNow = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await scheduler.publishNow(parseInt(id));
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ status: 'error', error: err.message });
  }
};

exports.schedule = async (req, res) => {
  try {
    const { content, mediaUrl, scheduledAt, comments, targetAccount } = req.body;
    const result = await scheduler.enqueuePost({
      content,
      mediaUrl,
      scheduledAt,
      comments,
      targetAccount: targetAccount || 'instagram'
    });
    res.json({ scheduled: [result] });
  } catch (err) {
    res.status(500);
    res.json({ status: 'error', error: err.message });
  }
};

exports.queue = async (req, res) => {
  try {
    const posts = await Post.findAll({
      order: [['scheduledAt', 'ASC']]
    });
    res.json(posts);
  } catch (err) {
    res.status(500);
    res.json({ status: 'error', error: err.message });
  }
};

exports.overview = async (req, res) => {
  try {
    const total = await Post.count();
    const scheduled = await Post.count({ where: { status: 'scheduled' } });
    const published = await Post.count({ where: { status: 'published' } });
    const failed = await Post.count({ where: { status: 'failed' } });
    res.json({ total, scheduled, published, failed });
  } catch (err) {
    res.status(500);
    res.json({ status: 'error', error: err.message });
  }
};

exports.due = async (req, res) => {
  try {
    const posts = await scheduler.duePosts();
    res.json(posts);
  } catch (err) {
    res.status(500);
    res.json({ status: 'error', error: err.message });
  }
};

exports.historial = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { status: { [Op.in]: ['published', 'failed'] } },
      order: [['publishedAt', 'DESC']],
      limit: 50
    });
    res.json(posts);
  } catch (err) {
    res.status(500);
    res.json({ status: 'error', error: err.message });
  }
};

exports.preview = async (req, res) => {
  try {
    const { content, mediaUrl } = req.body;
    const result = scheduler.preview({ content, mediaUrl });
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
};
