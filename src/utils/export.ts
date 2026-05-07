export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportContributions(contributions: any[], participants: any[]) {
  const exportData = contributions.map(contribution => {
    const participant = participants.find(p => p.id === contribution.participantId);
    return {
      'Participant ID': contribution.participantId,
      'Participant Name': participant?.name || 'Unknown',
      'Month': contribution.month,
      'Amount': contribution.amount,
      'Operational Charge': contribution.operationalCharge,
      'Total Paid': contribution.totalPaid,
      'Due Date': contribution.date,
      'Status': contribution.status,
      'Payment Date': contribution.status === 'paid' ? new Date().toLocaleDateString() : 'N/A',
    };
  });

  exportToCSV(exportData, `contributions-${new Date().toISOString().split('T')[0]}.csv`);
}

export function exportPayouts(payouts: any[], participants: any[]) {
  const exportData = payouts.map(payout => {
    const participant = participants.find(p => p.id === payout.participantId);
    return {
      'Participant ID': payout.participantId,
      'Participant Name': participant?.name || 'Unknown',
      'Month': payout.month,
      'Amount': payout.amount,
      'Due Date': payout.date,
      'Status': payout.status,
      'Payment Date': payout.status === 'paid' ? new Date().toLocaleDateString() : 'N/A',
    };
  });

  exportToCSV(exportData, `payouts-${new Date().toISOString().split('T')[0]}.csv`);
}

export function exportParticipants(participants: any[]) {
  const exportData = participants.map(participant => ({
    'ID': participant.id,
    'Name': participant.name,
    'Email': participant.email,
    'Phone': participant.phone,
    'Position': participant.position,
    'Join Date': participant.joinDate,
  }));

  exportToCSV(exportData, `participants-${new Date().toISOString().split('T')[0]}.csv`);
}