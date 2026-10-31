import { pool } from '../config/db.js';
import { INITIAL_LEADS } from '../../src/data/initialLeads.js';
import { seedLeads } from '../initDb.js';

// Helper to format DB row to camelCase frontend object
export function formatLeadRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    subCategory: row.sub_category || '',
    city: row.city || '',
    state: row.state || '',
    address: row.address || '',
    phone: row.phone || '',
    ownerName: row.owner_name || '',
    rating: Number(row.rating) || 0,
    reviewsCount: Number(row.reviews_count) || 0,
    websiteStatus: row.website_status || 'No Website Found',
    opportunityScore: Number(row.opportunity_score) || 90,
    estimatedRevenue: row.estimated_revenue || '',
    pitchAngle: row.pitch_angle || '',
    status: row.status || 'new',
    followupDate: row.followup_date || '',
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags || '[]') : (row.tags || []),
    notes: typeof row.notes === 'string' ? JSON.parse(row.notes || '[]') : (row.notes || []),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// 1. GET /api/leads - Fetch all leads with optional filters
export async function getAllLeads(req, res) {
  try {
    const { category, status, state, search, sortBy } = req.query;

    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (state && state !== 'ALL') {
      query += ' AND state = ?';
      params.push(state);
    }

    if (search && search.trim()) {
      const s = `%${search.trim().toLowerCase()}%`;
      query += ` AND (
        LOWER(name) LIKE ? OR
        LOWER(city) LIKE ? OR
        LOWER(state) LIKE ? OR
        LOWER(owner_name) LIKE ? OR
        LOWER(phone) LIKE ? OR
        LOWER(sub_category) LIKE ?
      )`;
      params.push(s, s, s, s, s, s);
    }

    // Sort order
    if (sortBy === 'opportunity') {
      query += ' ORDER BY opportunity_score DESC, reviews_count DESC';
    } else if (sortBy === 'reviews') {
      query += ' ORDER BY reviews_count DESC';
    } else if (sortBy === 'rating') {
      query += ' ORDER BY rating DESC';
    } else if (sortBy === 'followup') {
      query += ' ORDER BY CASE WHEN followup_date IS NULL OR followup_date = "" THEN 1 ELSE 0 END, followup_date ASC';
    } else {
      query += ' ORDER BY opportunity_score DESC';
    }

    const [rows] = await pool.query(query, params);
    const formatted = rows.map(formatLeadRow);

    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch leads from MySQL', error: error.message });
  }
}

// 2. GET /api/leads/:id - Fetch single lead
export async function getLeadById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM leads WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `Lead with ID "${id}" not found.` });
    }

    res.json({ success: true, data: formatLeadRow(rows[0]) });
  } catch (error) {
    console.error('Error fetching lead by id:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch lead', error: error.message });
  }
}

// 3. POST /api/leads - Create new lead
export async function createLead(req, res) {
  try {
    const lead = req.body;

    if (!lead.name || !lead.category) {
      return res.status(400).json({ success: false, message: 'Name and Category are required fields.' });
    }

    const id = lead.id || `lead-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const sql = `
      INSERT INTO leads (
        id, name, category, sub_category, city, state, address, phone, owner_name,
        rating, reviews_count, website_status, opportunity_score, estimated_revenue,
        pitch_angle, status, followup_date, tags, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      id,
      lead.name,
      lead.category,
      lead.subCategory || lead.sub_category || '',
      lead.city || '',
      lead.state || '',
      lead.address || '',
      lead.phone || '',
      lead.ownerName || lead.owner_name || '',
      Number(lead.rating) || 0,
      Number(lead.reviewsCount || lead.reviews_count) || 0,
      lead.websiteStatus || lead.website_status || 'No Website Found',
      Number(lead.opportunityScore || lead.opportunity_score) || 90,
      lead.estimatedRevenue || lead.estimated_revenue || '',
      lead.pitchAngle || lead.pitch_angle || '',
      lead.status || 'new',
      lead.followupDate || lead.followup_date || null,
      JSON.stringify(lead.tags || []),
      JSON.stringify(lead.notes || [])
    ];

    await pool.query(sql, values);
    const [newRow] = await pool.query('SELECT * FROM leads WHERE id = ?', [id]);

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: formatLeadRow(newRow[0])
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ success: false, message: 'Failed to create lead', error: error.message });
  }
}

// 4. PUT /api/leads/:id - Update lead
export async function updateLead(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [existing] = await pool.query('SELECT * FROM leads WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: `Lead with ID "${id}" not found.` });
    }

    const current = existing[0];

    const fields = [];
    const values = [];

    if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.category !== undefined) { fields.push('category = ?'); values.push(updates.category); }
    if (updates.subCategory !== undefined || updates.sub_category !== undefined) {
      fields.push('sub_category = ?');
      values.push(updates.subCategory !== undefined ? updates.subCategory : updates.sub_category);
    }
    if (updates.city !== undefined) { fields.push('city = ?'); values.push(updates.city); }
    if (updates.state !== undefined) { fields.push('state = ?'); values.push(updates.state); }
    if (updates.address !== undefined) { fields.push('address = ?'); values.push(updates.address); }
    if (updates.phone !== undefined) { fields.push('phone = ?'); values.push(updates.phone); }
    if (updates.ownerName !== undefined || updates.owner_name !== undefined) {
      fields.push('owner_name = ?');
      values.push(updates.ownerName !== undefined ? updates.ownerName : updates.owner_name);
    }
    if (updates.rating !== undefined) { fields.push('rating = ?'); values.push(Number(updates.rating)); }
    if (updates.reviewsCount !== undefined || updates.reviews_count !== undefined) {
      fields.push('reviews_count = ?');
      values.push(Number(updates.reviewsCount !== undefined ? updates.reviewsCount : updates.reviews_count));
    }
    if (updates.websiteStatus !== undefined || updates.website_status !== undefined) {
      fields.push('website_status = ?');
      values.push(updates.websiteStatus !== undefined ? updates.websiteStatus : updates.website_status);
    }
    if (updates.opportunityScore !== undefined || updates.opportunity_score !== undefined) {
      fields.push('opportunity_score = ?');
      values.push(Number(updates.opportunityScore !== undefined ? updates.opportunityScore : updates.opportunity_score));
    }
    if (updates.estimatedRevenue !== undefined || updates.estimated_revenue !== undefined) {
      fields.push('estimated_revenue = ?');
      values.push(updates.estimatedRevenue !== undefined ? updates.estimatedRevenue : updates.estimated_revenue);
    }
    if (updates.pitchAngle !== undefined || updates.pitch_angle !== undefined) {
      fields.push('pitch_angle = ?');
      values.push(updates.pitchAngle !== undefined ? updates.pitchAngle : updates.pitch_angle);
    }
    if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
    if (updates.followupDate !== undefined || updates.followup_date !== undefined) {
      fields.push('followup_date = ?');
      values.push(updates.followupDate !== undefined ? updates.followupDate : updates.followup_date);
    }
    if (updates.tags !== undefined) { fields.push('tags = ?'); values.push(JSON.stringify(updates.tags)); }
    if (updates.notes !== undefined) { fields.push('notes = ?'); values.push(JSON.stringify(updates.notes)); }

    if (fields.length === 0) {
      return res.json({ success: true, message: 'No fields to update', data: formatLeadRow(current) });
    }

    values.push(id);
    const sql = `UPDATE leads SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(sql, values);

    const [updated] = await pool.query('SELECT * FROM leads WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: formatLeadRow(updated[0])
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ success: false, message: 'Failed to update lead', error: error.message });
  }
}

// 5. DELETE /api/leads/:id - Delete single lead
export async function deleteLead(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM leads WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `Lead with ID "${id}" not found.` });
    }

    res.json({ success: true, message: `Lead "${id}" deleted successfully.` });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ success: false, message: 'Failed to delete lead', error: error.message });
  }
}

// 6. POST /api/leads/batch - Batch add leads (from 3D Scraper Simulator)
export async function batchCreateLeads(req, res) {
  try {
    const { leads: leadsList } = req.body;

    if (!Array.isArray(leadsList) || leadsList.length === 0) {
      return res.status(400).json({ success: false, message: 'A non-empty "leads" array is required.' });
    }

    await seedLeads(pool, leadsList);
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM leads');

    res.status(201).json({
      success: true,
      message: `Batch of ${leadsList.length} leads imported successfully into MySQL.`,
      totalLeads: rows[0].total
    });
  } catch (error) {
    console.error('Error batch creating leads:', error);
    res.status(500).json({ success: false, message: 'Failed to batch import leads', error: error.message });
  }
}

// 7. POST /api/leads/reset - Reset database back to default 100 leads
export async function resetDefaultLeads(req, res) {
  try {
    await pool.query('TRUNCATE TABLE leads');
    await seedLeads(pool, INITIAL_LEADS);

    const [rows] = await pool.query('SELECT * FROM leads ORDER BY opportunity_score DESC');
    const formatted = rows.map(formatLeadRow);

    res.json({
      success: true,
      message: 'Database reset back to 100 curated US businesses.',
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error('Error resetting leads:', error);
    res.status(500).json({ success: false, message: 'Failed to reset leads', error: error.message });
  }
}

// 8. POST /api/leads/:id/notes - Add note to lead
export async function addNoteToLead(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Note text cannot be empty.' });
    }

    const [rows] = await pool.query('SELECT notes FROM leads WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `Lead "${id}" not found.` });
    }

    let existingNotes = [];
    try {
      existingNotes = typeof rows[0].notes === 'string' ? JSON.parse(rows[0].notes || '[]') : (rows[0].notes || []);
    } catch {
      existingNotes = [];
    }

    const newNote = {
      id: `n-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      text: text.trim()
    };

    const updatedNotes = [newNote, ...existingNotes];
    await pool.query('UPDATE leads SET notes = ? WHERE id = ?', [JSON.stringify(updatedNotes), id]);

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      note: newNote,
      allNotes: updatedNotes
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ success: false, message: 'Failed to add note', error: error.message });
  }
}

// 9. GET /api/stats - Aggregated pipeline statistics from MySQL
export async function getStats(req, res) {
  try {
    const [counts] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN category = 'hotel' THEN 1 ELSE 0 END) AS hotels,
        SUM(CASE WHEN category = 'shop' THEN 1 ELSE 0 END) AS shops,
        SUM(CASE WHEN category = 'company' THEN 1 ELSE 0 END) AS companies,
        SUM(CASE WHEN category = 'barber' THEN 1 ELSE 0 END) AS barbers,
        SUM(CASE WHEN opportunity_score >= 95 THEN 1 ELSE 0 END) AS hot,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS status_new,
        SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) AS status_contacted,
        SUM(CASE WHEN status = 'followup' THEN 1 ELSE 0 END) AS status_followup,
        SUM(CASE WHEN status = 'meeting' THEN 1 ELSE 0 END) AS status_meeting,
        SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) AS status_won,
        SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) AS status_lost
      FROM leads
    `);

    res.json({
      success: true,
      data: counts[0]
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats', error: error.message });
  }
}

