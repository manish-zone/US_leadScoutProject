// ========================================================
// LeadScout API Client (Node.js + MySQL REST API)
// ========================================================

const API_BASE = '/api';

export const leadsApi = {
  // Check backend server & MySQL health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return { status: 'offline', error: err.message };
    }
  },

  // Get all leads with optional query parameters
  async getLeads(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.state && filters.state !== 'ALL') params.append('state', filters.state);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/leads${queryString}`);
    if (!res.ok) throw new Error(`Failed to fetch leads: ${res.statusText}`);
    const data = await res.json();
    return data.data || [];
  },

  // Get single lead by ID
  async getLeadById(id) {
    const res = await fetch(`${API_BASE}/leads/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch lead: ${res.statusText}`);
    const data = await res.json();
    return data.data;
  },

  // Create new lead
  async createLead(lead) {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
    if (!res.ok) throw new Error(`Failed to create lead: ${res.statusText}`);
    const data = await res.json();
    return data.data;
  },

  // Update lead by ID
  async updateLead(id, updates) {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error(`Failed to update lead: ${res.statusText}`);
    const data = await res.json();
    return data.data;
  },

  // Delete lead by ID
  async deleteLead(id) {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Failed to delete lead: ${res.statusText}`);
    return await res.json();
  },

  // Batch import leads (from 3D Scraper Simulator)
  async batchImportLeads(leadsList) {
    const res = await fetch(`${API_BASE}/leads/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads: leadsList })
    });
    if (!res.ok) throw new Error(`Failed to batch import leads: ${res.statusText}`);
    return await res.json();
  },

  // Reset database back to default 100 leads
  async resetDatabase() {
    const res = await fetch(`${API_BASE}/leads/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error(`Failed to reset database: ${res.statusText}`);
    const data = await res.json();
    return data.data || [];
  },

  // Add note to lead
  async addNote(id, text) {
    const res = await fetch(`${API_BASE}/leads/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error(`Failed to add note: ${res.statusText}`);
    return await res.json();
  },

  // Get aggregated stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error(`Failed to fetch stats: ${res.statusText}`);
    const data = await res.json();
    return data.data;
  },

  // Perform live 3D radar sweep
  async performRadarSweep(payload) {
    const res = await fetch(`${API_BASE}/scraper/live-sweep`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Radar sweep failed: ${res.statusText}`);
    return await res.json();
  }
};

