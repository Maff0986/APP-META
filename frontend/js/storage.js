const storage = (function () {

  function get(k) {
    try { return JSON.parse(localStorage.getItem('sm_' + k)); } catch { return null; }
  }

  function set(k, v) {
    try { localStorage.setItem('sm_' + k, JSON.stringify(v)); } catch (e) { /* quota full */ }
  }

  function remove(k) {
    localStorage.removeItem('sm_' + k);
  }

  return { get, set, remove };

})();
