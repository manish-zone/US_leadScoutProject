// CSV and JSON export / import helpers

export function exportLeadsToCSV(leads, filename = 'us_leads_without_websites_100.csv') {
  if (!leads || leads.length === 0) return;

  const headers = [
    'ID',
    'Business Name',
    'Category',
    'Sub-Category',
    'City',
    'State',
    'Full Address',
    'Phone',
    'Owner / Contact',
    'Google Rating',
    'Review Count',
    'Website Status',
    'Opportunity Score',
    'Estimated Revenue',
    'Status',
    'Follow-up Date',
    'Pitch Angle'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = leads.map(l => [
    escapeCSV(l.id),
    escapeCSV(l.name),
    escapeCSV(l.category),
    escapeCSV(l.subCategory),
    escapeCSV(l.city),
    escapeCSV(l.state),
    escapeCSV(l.address),
    escapeCSV(l.phone),
    escapeCSV(l.ownerName),
    escapeCSV(l.rating),
    escapeCSV(l.reviewsCount),
    escapeCSV(l.websiteStatus),
    escapeCSV(l.opportunityScore),
    escapeCSV(l.estimatedRevenue),
    escapeCSV(l.status),
    escapeCSV(l.followupDate || ''),
    escapeCSV(l.pitchAngle)
  ].join(','));

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportLeadsToJSON(leads, filename = 'us_leads_without_websites_100.json') {
  if (!leads || leads.length === 0) return;
  const jsonContent = JSON.stringify(leads, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

