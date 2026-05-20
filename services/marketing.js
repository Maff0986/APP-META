import axios from 'axios';
import MetaToken from '../models/MetaToken.js';

const GRAPH = 'https://graph.facebook.com/v19.0';

async function getToken(userId) {
  const r = await MetaToken.findOne({ where: { userId } });
  if (!r) throw new Error('Meta no conectado');
  return r.accessToken;
}

// Obtener cuentas publicitarias
export async function getAdAccounts(userId) {
  const token = await getToken(userId);
  const res = await axios.get(GRAPH + '/me/adaccounts', {
    params: { access_token: token, fields: 'id,name,currency,account_status' }
  });
  return res.data.data || [];
}

// Crear campana publicitaria
export async function createCampaign(userId, adAccountId, campaign) {
  const token = await getToken(userId);
  const res = await axios.post(GRAPH + '/' + adAccountId + '/campaigns', {
    name:        campaign.name,
    objective:   campaign.objective || 'OUTCOME_ENGAGEMENT',
    status:      'PAUSED',
    special_ad_categories: []
  }, {
    params: { access_token: token }
  });
  return res.data;
}

// Obtener insights de campanas
export async function getCampaignInsights(userId, campaignId) {
  const token = await getToken(userId);
  const res = await axios.get(GRAPH + '/' + campaignId + '/insights', {
    params: {
      access_token: token,
      fields: 'impressions,clicks,spend,reach,ctr,cpm'
    }
  });
  return res.data.data || [];
}

// Crear ad desde producto de catalogo
export async function createProductAd(userId, adAccountId, catalogId, productId, budget) {
  const token = await getToken(userId);

  // Crear campana
  const campaign = await createCampaign(userId, adAccountId, {
    name: 'Producto-' + productId + '-' + Date.now(),
    objective: 'OUTCOME_SALES'
  });

  console.log('[Marketing] Campana creada:', campaign.id);
  return { campaignId: campaign.id, status: 'PAUSED', budget };
}
