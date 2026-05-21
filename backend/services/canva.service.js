const axios = require('axios');
const sequelize = require('../models/database');
const { DataTypes, Model } = require('sequelize');

class CanvaAsset extends Model {}
CanvaAsset.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  canvaId: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: true },
  url: { type: DataTypes.TEXT, allowNull: true },
  thumbnailUrl: { type: DataTypes.TEXT, allowNull: true },
  type: { type: DataTypes.STRING, defaultValue: 'design' },
  designId: { type: DataTypes.STRING, allowNull: true },
  editUrl: { type: DataTypes.TEXT, allowNull: true },
  previewUrl: { type: DataTypes.TEXT, allowNull: true }
}, { sequelize, modelName: 'canvaAsset' });

CanvaAsset.sync({ alter: true }).catch(() => {});

const CANVA_CLIENT_ID = process.env.CANVA_CLIENT_ID || '';
const CANVA_CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET || '';
const CANVA_REDIRECT_URI = process.env.CANVA_REDIRECT_URI || 'http://localhost:3000/canva/callback';

const getAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: CANVA_CLIENT_ID,
    redirect_uri: CANVA_REDIRECT_URI,
    response_type: 'code',
    scope: 'design:write design:read template:read'
  });
  return `https://www.canva.com/api/oauth/authorize?${params.toString()}`;
};

const authenticate = () => {
  return getAuthUrl();
};

const exchangeCode = async (code) => {
  const response = await axios.post('https://api.canva.com/api/v1/oauth/token', {
    client_id: CANVA_CLIENT_ID,
    client_secret: CANVA_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: CANVA_REDIRECT_URI
  }, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};

const listTemplates = async (accessToken) => {
  const response = await axios.get('https://api.canva.com/api/v1/design-templates', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const templates = (response.data.templates || response.data || []).map(t => ({
    id: t.id,
    name: t.name || 'Untitled',
    thumbnail_url: t.thumbnail_url || t.thumbnailUrl || '',
    thumbnail_url_large: t.thumbnail_url_large || t.thumbnailUrlLarge || ''
  }));
  return { templates };
};

const createDesign = async (accessToken, { templateId, title, customization }) => {
  const response = await axios.post('https://api.canva.com/api/v1/designs', {
    template_id: templateId,
    name: title || 'Untitled Design',
    ...(customization || {})
  }, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return {
    designId: response.data.id || response.data.designId,
    editUrl: response.data.edit_url || response.data.editUrl,
    previewUrl: response.data.preview_url || response.data.previewUrl
  };
};

const exportImage = async (accessToken, designId, format = 'png') => {
  const response = await axios.get(`https://api.canva.com/api/v1/designs/${designId}/export`, {
    params: { format },
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return {
    url: response.data.url || response.data.export_url || response.data,
    format
  };
};

const saveAsset = async (asset) => {
  const saved = await CanvaAsset.create({
    canvaId: asset.id || asset.canvaId,
    name: asset.name,
    url: asset.url,
    thumbnailUrl: asset.thumbnailUrl,
    type: asset.type || 'design',
    designId: asset.designId,
    editUrl: asset.editUrl,
    previewUrl: asset.previewUrl
  });
  return saved;
};

const getAssetById = async (id) => {
  return CanvaAsset.findByPk(id);
};

const listAssets = async () => {
  return CanvaAsset.findAll({ order: [['id', 'DESC']] });
};

module.exports = {
  getAuthUrl,
  authenticate,
  exchangeCode,
  listTemplates,
  createDesign,
  exportImage,
  saveAsset,
  getAssetById,
  listAssets,
  CanvaAsset
};