const api = (function () {
  const BASE = window.location.origin;

  async function request(method, path, body) {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    addAuthHeaders(opts.headers);
    if (body !== undefined) opts.body = JSON.stringify(body);
    try {
      const res = await fetch(BASE + path, opts);
      if (res.status === 401) {
        window.location.href = '/auth/login';
        return null;
      }
      const data = await res.json().catch(() => ({}));
      return data;
    } catch (err) {
      console.error('[api]', method, path, err);
      return { error: err.message };
    }
  }

  function addAuthHeaders(headers) {
    const token = storage.get('token');
    if (token) headers['Authorization'] = 'Bearer ' + token;
  }

  return {
    get(url)       { return request('GET',    url); },
    post(url, data){ return request('POST',   url, data); },
    put(url, data) { return request('PUT',    url, data); },
    del(url)       { return request('DELETE', url); },
    addAuthHeaders,
  };
})();
