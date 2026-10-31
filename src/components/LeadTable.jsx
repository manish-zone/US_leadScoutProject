import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Star, 
  Calendar, 
  FileText, 
  Flame, 
  X, 
  Trash2, 
  MessageSquare, 
  ArrowUpDown,
  Building2,
  Store,
  Briefcase,
  Scissors,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

export function LeadTable({
  leads,
  onUpdateLeadStatus,
  onUpdateFollowupDate,
  onOpenPitchModal,
  onOpenDetailModal,
  onDeleteLead,
  activeCategoryFilter,
  setActiveCategoryFilter,
  activeStatusFilter,
  setActiveStatusFilter
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [sortBy, setSortBy] = useState('opportunity');
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedState, activeCategoryFilter, activeStatusFilter, sortBy]);

  const uniqueStates = useMemo(() => {
    const states = new Set(leads.map(l => l.state).filter(Boolean));
    return Array.from(states).sort();
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (activeCategoryFilter !== 'all' && lead.category !== activeCategoryFilter) return false;
      if (activeStatusFilter !== 'all' && lead.status !== activeStatusFilter) return false;
      if (selectedState !== 'ALL' && lead.state !== selectedState) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = lead.name.toLowerCase().includes(query);
        const matchCity = lead.city.toLowerCase().includes(query);
        const matchState = lead.state.toLowerCase().includes(query);
        const matchOwner = lead.ownerName?.toLowerCase().includes(query);
        const matchPhone = lead.phone.toLowerCase().includes(query);
        const matchSub = lead.subCategory?.toLowerCase().includes(query);
        if (!matchName && !matchCity && !matchState && !matchOwner && !matchPhone && !matchSub) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'opportunity') return b.opportunityScore - a.opportunityScore;
      if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'followup') {
        if (!a.followupDate) return 1;
        if (!b.followupDate) return -1;
        return new Date(a.followupDate) - new Date(b.followupDate);
      }
      return 0;
    });
  }, [leads, activeCategoryFilter, activeStatusFilter, selectedState, searchTerm, sortBy]);

  const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(filteredLeads.length / Number(pageSize)));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedLeads = useMemo(() => {
    if (pageSize === 'all') return filteredLeads;
    const size = Number(pageSize);
    const start = (safeCurrentPage - 1) * size;
    return filteredLeads.slice(start, start + size);
  }, [filteredLeads, safeCurrentPage, pageSize]);

  const isAllPageSelected = paginatedLeads.length > 0 && paginatedLeads.every(l => selectedLeadIds.includes(l.id));

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = paginatedLeads.map(l => l.id);
      setSelectedLeadIds(Array.from(new Set([...selectedLeadIds, ...pageIds])));
    } else {
      const pageIds = new Set(paginatedLeads.map(l => l.id));
      setSelectedLeadIds(selectedLeadIds.filter(id => !pageIds.has(id)));
    }
  };

  const handleSelectLead = (id) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter(i => i !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    selectedLeadIds.forEach(id => {
      onUpdateLeadStatus(id, newStatus);
    });
    setSelectedLeadIds([]);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'hotel':
        return <Building2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'shop':
        return <Store className="w-3.5 h-3.5 text-amber-600" />;
      case 'company':
        return <Briefcase className="w-3.5 h-3.5 text-sky-600" />;
      case 'barber':
        return <Scissors className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="glass-3d-slab rounded-3xl overflow-hidden shadow-2xl transition-all">
      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-5 border-b border-sky-100 space-y-4 bg-white/40">
        {/* Category Pills & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 bg-sky-100/60 p-1.5 rounded-2xl border-t-1.5 border-l-1.5 border-sky-200/80 border-b-2 border-white shadow-inner">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'all'
                  ? 'glass-3d-pill-active text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All US Leads ({leads.length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('hotel')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'hotel'
                  ? 'glass-3d-pill-active text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hotels & Motels ({leads.filter(l => l.category === 'hotel').length})</span>
            </button>
            <button
              onClick={() => setActiveCategoryFilter('shop')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'shop'
                  ? 'glass-3d-pill-active text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Shops & Retail ({leads.filter(l => l.category === 'shop').length})</span>
            </button>
            <button
              onClick={() => setActiveCategoryFilter('company')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'company'
                  ? 'glass-3d-pill-active text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-sky-600" />
              <span>Contractors ({leads.filter(l => l.category === 'company').length})</span>
            </button>
            <button
              onClick={() => setActiveCategoryFilter('barber')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategoryFilter === 'barber'
                  ? 'glass-3d-pill-active text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scissors className="w-3.5 h-3.5 text-purple-600" />
              <span>Barber Shops ({leads.filter(l => l.category === 'barber').length})</span>
            </button>
          </div>

          {/* Quick Sort Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-700 flex items-center gap-1 font-bold">
              <ArrowUpDown className="w-3.5 h-3.5 text-sky-600" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-3d-input text-xs text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="opportunity">Highest Opportunity Score</option>
              <option value="reviews">Most Reviews (Established)</option>
              <option value="rating">Highest Google Rating</option>
              <option value="followup">Next Follow-up Due</option>
            </select>
          </div>
        </div>

        {/* 3D Sunken Search Bar + Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* 3D Sunken Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by business name, city, state, owner name, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-3d-input rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* US State Filter */}
          <div className="flex items-center space-x-2 shrink-0">
            <MapPin className="w-4 h-4 text-sky-600 hidden sm:block" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="glass-3d-input text-xs sm:text-sm text-slate-800 rounded-2xl px-3 py-2.5 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All States ({uniqueStates.length})</option>
              {uniqueStates.map(st => (
                <option key={st} value={st}>{st} State</option>
              ))}
            </select>
          </div>

          {/* Pipeline Status Filter */}
          <div className="flex items-center space-x-2 shrink-0">
            <Filter className="w-4 h-4 text-sky-600 hidden sm:block" />
            <select
              value={activeStatusFilter}
              onChange={(e) => setActiveStatusFilter(e.target.value)}
              className="glass-3d-input text-xs sm:text-sm text-slate-800 rounded-2xl px-3 py-2.5 focus:outline-none cursor-pointer"
            >
              <option value="all">All Stages</option>
              <option value="new">New Leads</option>
              <option value="contacted">Contacted</option>
              <option value="followup">Follow-up Due</option>
              <option value="meeting">Demo Booked</option>
              <option value="won">Closed / Won 🎉</option>
              <option value="lost">Not Interested</option>
            </select>
          </div>
        </div>

        {/* 3D Bulk Action Bar */}
        {selectedLeadIds.length > 0 && (
          <div className="glass-3d-slab rounded-2xl p-3 flex items-center justify-between text-xs border-sky-300 bg-sky-50/80 animate-fadeIn">
            <span className="font-bold text-sky-900">
              {selectedLeadIds.length} lead{selectedLeadIds.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-slate-600">Quick Stage:</span>
              <button
                onClick={() => handleBulkStatusChange('contacted')}
                className="glass-3d-btn px-3 py-1 text-sky-700 hover:text-sky-900 rounded-lg font-bold"
              >
                Contacted
              </button>
              <button
                onClick={() => handleBulkStatusChange('followup')}
                className="glass-3d-btn px-3 py-1 text-purple-700 hover:text-purple-900 rounded-lg font-bold"
              >
                Follow-up
              </button>
              <button
                onClick={() => handleBulkStatusChange('won')}
                className="glass-3d-btn px-3 py-1 text-emerald-700 hover:text-emerald-900 rounded-lg font-bold"
              >
                Won 🎉
              </button>
              <button
                onClick={() => setSelectedLeadIds([])}
                className="text-slate-500 hover:text-slate-800 px-2 py-1 font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3D Translucent Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-sky-50 via-white to-sky-50 text-slate-700 text-xs font-black uppercase tracking-wider border-b border-sky-200/80">
              <th className="py-2.5 px-2.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllPageSelected}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 bg-white text-sky-600 focus:ring-0 cursor-pointer"
                  title="Select all on this page"
                />
              </th>
              <th className="py-2.5 px-3">Business & Category</th>
              <th className="py-2.5 px-2.5">Location</th>
              <th className="py-2.5 px-2.5">Phone & Contact</th>
              <th className="py-2.5 px-2.5">Reputation</th>
              <th className="py-2.5 px-2 text-center">Opportunity</th>
              <th className="py-2.5 px-2.5">Pipeline Stage</th>
              <th className="py-2.5 px-3 min-w-[230px]">Follow-up</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-100/60">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-14 text-center text-slate-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-sky-500" />
                  <p className="font-bold text-slate-700">No leads match your search criteria.</p>
                  <p className="text-xs text-slate-500 mt-1">Try adjusting keywords or selecting another category.</p>
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className={`hover:bg-sky-50/50 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all group ${
                    selectedLeadIds.includes(lead.id) ? 'bg-sky-100/60' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="py-2.5 px-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={selectedLeadIds.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="rounded border-slate-300 bg-white text-sky-600 focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Business & Category */}
                  <td className="py-2.5 px-3 max-w-[240px]">
                    <div className="font-bold text-slate-900 truncate text-[13px] sm:text-[14px] group-hover:text-sky-600 transition-colors" title={lead.name}>
                      {lead.name}
                    </div>
                    <div className="flex flex-col items-start gap-1 mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white/90 border border-slate-200/90 px-2 py-0.5 rounded-full shadow-xs truncate max-w-[220px]" title={lead.subCategory}>
                        {getCategoryIcon(lead.category)}
                        <span className="truncate">{lead.subCategory}</span>
                      </span>
                      <span className="inline-flex items-center text-[11px] text-rose-700 font-mono bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
                        {lead.websiteStatus}
                      </span>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-2.5 px-2.5 whitespace-nowrap">
                    <div className="text-slate-800 font-bold flex items-center gap-1 text-[13px]">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>{lead.city}, {lead.state}</span>
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-[130px]" title={lead.address}>
                      {lead.address}
                    </div>
                  </td>

                  {/* Phone & Contact Person */}
                  <td className="py-2.5 px-2.5 whitespace-nowrap">
                    <a
                      href={`tel:${lead.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-sky-700 hover:text-sky-900 font-mono text-[13px] font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>{lead.phone}</span>
                    </a>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium truncate max-w-[130px]" title={lead.ownerName || 'Decision Maker'}>
                      {lead.ownerName ? `Owner: ${lead.ownerName}` : 'Decision Maker'}
                    </div>
                  </td>

                  {/* Reputation */}
                  <td className="py-2.5 px-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-[13px]">
                      <Star className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
                      <span>{lead.rating}</span>
                      <span className="text-slate-500 font-normal">({lead.reviewsCount})</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                      Est. {lead.estimatedRevenue}
                    </div>
                  </td>

                  {/* Opportunity Score */}
                  <td className="py-2.5 px-2 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[13px] flex items-center gap-1 shadow-xs border-t border-l border-white ${
                        lead.opportunityScore >= 95 
                          ? 'bg-rose-50 text-rose-700 border-b border-rose-300' 
                          : 'bg-amber-50 text-amber-800 border-b border-amber-300'
                      }`}>
                        <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        {lead.opportunityScore}/100
                      </span>
                    </div>
                  </td>

                  {/* Status Dropdown with 3D Bevels */}
                  <td className="py-2.5 px-2.5 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value)}
                      className={`text-[12px] font-semibold rounded-xl px-2 py-1 focus:outline-none transition-all cursor-pointer border-t border-l border-white border-b shadow-xs ${
                        lead.status === 'won'
                          ? 'bg-emerald-50 text-emerald-800 border-b-emerald-400'
                          : lead.status === 'meeting'
                          ? 'bg-amber-50 text-amber-900 border-b-amber-400'
                          : lead.status === 'followup'
                          ? 'bg-purple-50 text-purple-900 border-b-purple-400'
                          : lead.status === 'contacted'
                          ? 'bg-sky-50 text-sky-900 border-b-sky-400'
                          : lead.status === 'lost'
                          ? 'bg-rose-50 text-rose-900 border-b-rose-400'
                          : 'bg-white text-slate-800 border-b-slate-300'
                      }`}
                    >
                      <option value="new">🟡 New Lead</option>
                      <option value="contacted">🔵 Contacted</option>
                      <option value="followup">🟣 Follow-up</option>
                      <option value="meeting">🟠 Demo Booked</option>
                      <option value="won">🟢 Deal Won 🎉</option>
                      <option value="lost">🔴 Not Interested</option>
                    </select>
                  </td>

                  {/* Follow-up Date */}
                  <td className="py-2.5 px-3 min-w-[230px] whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="datetime-local"
                        value={lead.followupDate || ''}
                        onChange={(e) => onUpdateFollowupDate(lead.id, e.target.value)}
                        className="glass-3d-input text-xs text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer w-[215px] font-medium shadow-xs"
                      />
                      {lead.followupDate && (
                        <button
                          onClick={() => onUpdateFollowupDate(lead.id, '')}
                          title="Clear Follow-up Date"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Actions (3D Buttons) */}
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => onOpenPitchModal(lead)}
                        title="Generate Cold Call & Email Pitch"
                        className="glass-3d-btn p-1.5 rounded-xl text-sky-700 hover:text-sky-900 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenDetailModal(lead)}
                        title="View Complete Record"
                        className="glass-3d-btn p-1.5 rounded-xl text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteLead(lead.id)}
                        title="Remove Lead"
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Fast Pagination */}
      <div className="p-4 bg-sky-50/80 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-800">
            Showing <span className="font-black text-sky-800">{filteredLeads.length === 0 ? 0 : pageSize === 'all' ? 1 : (safeCurrentPage - 1) * Number(pageSize) + 1}</span> - <span className="font-black text-sky-800">{pageSize === 'all' ? filteredLeads.length : Math.min(safeCurrentPage * Number(pageSize), filteredLeads.length)}</span> of <span className="font-black text-slate-900">{filteredLeads.length}</span> leads
          </span>

          {/* Page Size Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-semibold">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="glass-3d-input text-xs text-slate-900 rounded-lg px-2 py-1 font-bold cursor-pointer"
            >
              <option value="10">10 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
              <option value="100">100 / page</option>
              <option value="all">All ({filteredLeads.length})</option>
            </select>
          </div>
        </div>

        {/* Page Nav Buttons */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage === 1}
              className="glass-3d-btn p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={safeCurrentPage === 1}
              className="glass-3d-btn px-2.5 py-1.5 rounded-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            <span className="px-3 py-1 font-black text-slate-900 bg-white border border-sky-300 rounded-lg shadow-inner">
              Page {safeCurrentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={safeCurrentPage === totalPages}
              className="glass-3d-btn px-2.5 py-1.5 rounded-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage === totalPages}
              className="glass-3d-btn p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
