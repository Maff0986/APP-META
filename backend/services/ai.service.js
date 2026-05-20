const axios = require('axios');

/**
 * Detects the AI provider based on the AI_PROVIDER environment variable.
 * @returns {'ollama'|'openai'} The provider name.
 */
function detectProvider() {
  return process.env.AI_PROVIDER === 'ollama' ? 'ollama' : 'openai';
}

/**
 * Builds a prompt for the AI based on the task, content, context, and platform.
 * @param {string} task - The task description (e.g., 'Genera 3 variantes de copy').
 * @param {string} content - The main content or topic.
 * @param {string} context - Additional context (e.g., brand voice, target audience).
 * @param {string} platform - The target platform (e.g., 'instagram', 'facebook').
 * @returns {string} The formatted prompt.
 */
function buildPrompt(task, content, context, platform) {
  return `Eres un Community Manager experto. ${task} para ${platform} sobre: ${content}. Contexto: ${context}`;
}

/**
 * Sends a request to the AI API (Ollama or OpenAI-compatible) and returns the response.
 * @param {Object} params - The parameters for the AI request.
 * @param {string} params.prompt - The user's prompt.
 * @param {string} [params.context=''] - Additional context for the prompt.
 * @param {string} [params.platform='instagram'] - The target platform.
 * @returns {Promise<Object>} A promise that resolves to { success: true, data: string } or { success: false, error: string }.
 */
async function ask({ prompt, context = '', platform = 'instagram' }) {
  try {
    const provider = detectProvider();
    const fullPrompt = buildPrompt('Genera 3 variantes de copy', prompt, context, platform);

    if (provider === 'ollama') {
      const response = await axios.post(
        `${process.env.AI_BASE_URL}/api/generate`,
        {
          model: process.env.AI_MODEL,
          prompt: fullPrompt,
          stream: false,
        },
        { timeout: 10000 }
      );
      return { success: true, data: response.data.response };
    } else {
      // OpenAI-compatible API
      const baseURL = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
      const response = await axios.post(
        `${baseURL}/chat/completions`,
        {
          model: process.env.AI_MODEL,
          messages: [{ role: 'user', content: fullPrompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.AI_API_KEY}`,
          },
          timeout: 10000,
        }
      );
      return { success: true, data: response.data.choices[0].message.content };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error || error.message : error.message,
    };
  }
}

/**
 * Generates content suggestions (captions, hashtags, best time to post) for a product.
 * @param {Object} params - The parameters for content suggestion.
 * @param {string} params.productName - The name of the product.
 * @param {string} params.productImage - The URL of the product image (not used in prompt, but available for future).
 * @param {string} [params.platform='instagram'] - The target platform.
 * @returns {Promise<Object>} A promise that resolves to { success: true, data: { captions: string[], hashtags: string[], bestTimeToPost: string } } or { success: false, error: string }.
 */
async function suggestContent({ productName, productImage, platform = 'instagram' }) {
  try {
    const provider = detectProvider();
    const prompt = `Eres un Community Manager experto. Para una publicación en ${platform} sobre el producto "${productName}". 
Genera un objeto JSON con las siguientes claves:
- captions: array de 3 variantes de copy (cada uno máximo 200 caracteres).
- hashtags: array de 3 strings, cada string contiene hashtags separados por comas (sin el #) para cada variant de copy.
- bestTimeToPost: string con la hora recomendada para publicar en formato HH:MM (24 horas, zona horaria local).
Solo devuelve el JSON, sin texto adicional.`;

    let aiResponse;
    if (provider === 'ollama') {
      const response = await axios.post(
        `${process.env.AI_BASE_URL}/api/generate`,
        {
          model: process.env.AI_MODEL,
          prompt: prompt,
          stream: false,
        },
        { timeout: 10000 }
      );
      aiResponse = response.data.response;
    } else {
      const baseURL = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
      const response = await axios.post(
        `${baseURL}/chat/completions`,
        {
          model: process.env.AI_MODEL,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.AI_API_KEY}`,
          },
          timeout: 10000,
        }
      );
      aiResponse = response.data.choices[0].message.content;
    }

    // Try to parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (parseError) {
      // If the AI didn't return valid JSON, try to extract JSON from the text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (e) {
          return { success: false, error: 'Failed to parse AI response as JSON' };
        }
      } else {
        return { success: false, error: 'AI response did not contain JSON' };
      }
    }

    // Validate the parsed object has the expected structure
    if (
      !parsed.captions ||
      !Array.isArray(parsed.captions) ||
      !parsed.hashtags ||
      !Array.isArray(parsed.hashtags) ||
      typeof parsed.bestTimeToPost !== 'string'
    ) {
      return { success: false, error: 'AI response missing required fields' };
    }

    return {
      success: true,
      data: {
        captions: parsed.captions,
        hashtags: parsed.hashtags,
        bestTimeToPost: parsed.bestTimeToPost,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data.error || error.message : error.message,
    };
  }
}

/**
 * Validates content length for the specified platform.
 * @param {Object} params - The parameters for validation.
 * @param {string} params.content - The content to validate.
 * @param {string} params.platform - The target platform ('instagram' or 'facebook').
 * @returns {Object} { valid: boolean, issues: string[] }.
 */
function validateContent({ content, platform }) {
  const limits = {
    instagram: 2200,
    facebook: 63206,
  };

  const limit = limits[platform.toLowerCase()];
  if (!limit) {
    return { valid: false, issues: [`Unsupported platform: ${platform}`] };
  }

  const valid = content.length <= limit;
  const issues = valid ? [] : [`Content exceeds ${platform} limit of ${limit} characters (current length: ${content.length})`];
  return { valid, issues };
}

/**
 * Checks the health of the AI service by pinging the API endpoint.
 * @returns {Promise<Object>} A promise that resolves to { status: 'ok'|'error', provider: string, model: string }.
 */
async function healthCheck() {
  try {
    const provider = detectProvider();
    const baseURL = process.env.AI_BASE_URL || (provider === 'openai' ? 'https://api.openai.com/v1' : undefined);

    if (provider === 'ollama') {
      await axios.get(`${process.env.AI_BASE_URL}/api/tags`, { timeout: 5000 });
    } else {
      await axios.get(`${baseURL}/models`, {
        headers: { Authorization: `Bearer ${process.env.AI_API_KEY}` },
        timeout: 5000,
      });
    }

    return { status: 'ok', provider, model: process.env.AI_MODEL };
  } catch (error) {
    return {
      status: 'error',
      provider: detectProvider(),
      model: process.env.AI_MODEL,
    };
  }
}

module.exports = {
  detectProvider,
  ask,
  buildPrompt,
  suggestContent,
  validateContent,
  healthCheck,
};