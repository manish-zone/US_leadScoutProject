import React, { useState } from 'react';
import { 
  X, 
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/sound';

export function AddLeadModal({ onClose, onAddLead }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'hotel',
    subCategory: 'Independent Motel',
    city: '',
    state: '',
    address: '',
    phone: '',
    ownerName: '',
    rating: 4.7,
    reviewsCount: 120,
    websiteStatus: 'No Website Found',
    opportunityScore: 95,
    estimatedRevenue: '$500,000/yr',
    pitchAngle: 'Established local business with zero official website. High potential for direct reservations & local SEO.',
    status: 'new',
    followupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T11:00'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.city.trim() || !formData.phone.trim()) {
      alert('Please provide at least Business Name, City, and Phone Number.');
      return;
    }

    const newLead = {
      ...formData,
      id: `custom-lead-${Date.now()}`,
      notes: [
        { id: `n-${Date.now()}`, date: new Date().toISOString().split('T')[0], text: 'Lead manually entered into 3D LeadScout CRM.' }
      ]
    };

    onAddLead(newLead);
    sound.playSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      {/* 3D Crystal Window */}
      <div className="glass-3d-slab rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_35px_80px_-20px_rgba(15,23,42,0.35)] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-sky-100 bg-white/60 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-200 border-t-2 border-l-1.5 border-white border-b-2 border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Add New US Business Record
              </h3>
              <p className="text-xs text-slate-500">
                Log a hotel, shop, or company without an active website.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="glass-3d-btn p-2 rounded-xl text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Business Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sunset Ridge Cabins & Lodge"
              className="w-full glass-3d-input rounded-2xl px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Category & Sub-Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full glass-3d-input rounded-2xl px-3 py-2.5 text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="hotel">🏨 Hotel & Lodging</option>
                <option value="shop">🛍️ Shop & Retail</option>
                <option value="company">🏢 Contractor & Company</option>
                <option value="barber">💈 Barber Shop & Salon</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sub-Category
              </label>
              <input
                type="text"
                value={formData.subCategory}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                placeholder="e.g. Classic Fade Studio, Boutique Motel"
                className="w-full glass-3d-input rounded-2xl px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* City, State, Address */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Phoenix"
                className="w-full glass-3d-input rounded-2xl px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State *
              </label>
              <input
                type="text"
                required
                maxLength={2}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                placeholder="AZ"
                className="w-full glass-3d-input rounded-2xl px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none text-center uppercase font-bold"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Street Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 1820 E Camelback Rd, Phoenix, AZ 85016"
              className="w-full glass-3d-input rounded-2xl px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Phone & Owner */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (602) 555-0199"
                className="w-full glass-3d-input rounded-2xl px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Owner / Contact Name
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="e.g. John Doe"
                className="w-full glass-3d-input rounded-2xl px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Rating & Review Count */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Google Rating (⭐)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                className="w-full glass-3d-input rounded-2xl px-3 py-2.5 text-slate-900 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Number of Reviews
              </label>
              <input
                type="number"
                min="0"
                value={formData.reviewsCount}
                onChange={(e) => setFormData({ ...formData, reviewsCount: parseInt(e.target.value) || 0 })}
                className="w-full glass-3d-input rounded-2xl px-3 py-2.5 text-slate-900 focus:outline-none font-bold"
              />
            </div>
          </div>

          {/* Website Status & Initial Follow-up */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Web Status
              </label>
              <select
                value={formData.websiteStatus}
                onChange={(e) => setFormData({ ...formData, websiteStatus: e.target.value })}
                className="w-full glass-3d-input rounded-2xl px-3 py-2.5 text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="No Website Found">No Website Found</option>
                <option value="Broken / 404 Domain">Broken / 404 Domain</option>
                <option value="Social Media Only">Social Media Only</option>
                <option value="Parked Domain">Parked Domain</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Initial Follow-up Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.followupDate}
                onChange={(e) => setFormData({ ...formData, followupDate: e.target.value })}
                className="w-full glass-3d-input rounded-2xl px-3 py-2.5 text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Custom Pitch Angle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Custom Pitch Strategy / Pain Point
            </label>
            <textarea
              rows={2}
              value={formData.pitchAngle}
              onChange={(e) => setFormData({ ...formData, pitchAngle: e.target.value })}
              className="w-full glass-3d-input rounded-2xl p-3 text-slate-900 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-700 text-white font-black text-sm hover:brightness-105 shadow-[0_8px_25px_rgba(16,185,129,0.35),inset_0_2px_2px_rgba(255,255,255,0.7)] border-t-2 border-l-1.5 border-white border-b-2 border-teal-900 transition-all cursor-pointer active:translate-y-0.5"
            >
              Save Record to 3D Glass CRM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
