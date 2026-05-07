import { useState } from 'react';
import { UserRole } from '../types';
import {
  participants,
  generateContributions,
  generatePayouts,
  formatCurrency,
  formatDate,
  getCurrentMonth,
} from '../data';
import {
  Search,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Crown,
  Edit3,
  Eye,
  X,
} from 'lucide-react';

interface ParticipantsProps {
  role: UserRole;
}

export default function Participants({ role }: ParticipantsProps) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const currentMonth = getCurrentMonth();
  const contributions = generateContributions();
  const payouts = generatePayouts();

  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const selectedParticipant = selectedId ? participants.find(p => p.id === selectedId) : null;
  const selectedContributions = selectedId
    ? contributions.filter(c => c.participantId === selectedId)
    : [];
  const selectedPayout = selectedId
    ? payouts.find(p => p.participantId === selectedId)
    : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">All Participants</h3>
          <p className="text-sm text-slate-400">Manage and view all 10 thrift members</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 rounded-xl px-3 py-2 border border-slate-700/50 w-full sm:w-auto">
          <Search size={16} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search participants..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-300 placeholder:text-slate-500 outline-none w-full sm:w-48"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participant List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((p, i) => {
            const monthContribs = contributions.filter(c => c.participantId === p.id && c.status === 'paid');
            const totalPaid = monthContribs.reduce((sum, c) => sum + c.totalPaid, 0);
            const payout = payouts.find(py => py.participantId === p.id);
            const isCurrentRecipient = p.position === currentMonth;

            return (
              <div
                key={p.id}
                className={`glass-card rounded-2xl p-4 border transition-all cursor-pointer hover:scale-[1.01] ${
                  selectedId === p.id
                    ? 'border-primary-500/50 bg-primary-500/5'
                    : isCurrentRecipient
                    ? 'border-gold-500/30 animate-pulse-glow'
                    : 'border-slate-700/30 hover:border-slate-600/50'
                }`}
                onClick={() => setSelectedId(p.id)}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      isCurrentRecipient
                        ? 'bg-gradient-to-br from-gold-500/20 to-accent-500/20 ring-2 ring-gold-500/50'
                        : 'bg-slate-800'
                    }`}>
                      {p.avatar}
                    </div>
                    {isCurrentRecipient && (
                      <Crown size={14} className="absolute -top-1 -right-1 text-gold-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold truncate">{p.name}</p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-slate-300">
                        User {p.id}
                      </span>
                      {isCurrentRecipient && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500/20 text-gold-400">
                          This Month's Recipient
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Mail size={10} /> {p.email}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Phone size={10} /> {p.phone}
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-white">{formatCurrency(totalPaid)}</p>
                    <p className="text-xs text-slate-400">Total Paid</p>
                  </div>

                  <div className="hidden sm:flex items-center gap-1">
                    {payout?.status === 'paid' ? (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-500/10 text-primary-400 text-xs font-medium">
                        <CheckCircle2 size={12} /> Received
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-700/50 text-slate-400 text-xs font-medium">
                        <Clock size={12} /> Month {p.position}
                      </span>
                    )}
                  </div>

                  <button className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400">
                    {role === 'admin' ? <Edit3 size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="glass-card rounded-2xl border border-slate-700/30 overflow-hidden">
          {selectedParticipant ? (
            <div>
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600/20 to-gold-500/10 p-6 border-b border-slate-700/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-3xl">
                      {selectedParticipant.avatar}
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{selectedParticipant.name}</p>
                      <p className="text-sm text-slate-400">Position #{selectedParticipant.position}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="p-1 rounded-lg hover:bg-slate-700/50 text-slate-400"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Contact</p>
                  <p className="text-sm text-slate-300 flex items-center gap-2"><Mail size={14} />{selectedParticipant.email}</p>
                  <p className="text-sm text-slate-300 flex items-center gap-2 mt-1"><Phone size={14} />{selectedParticipant.phone}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Payout Info</p>
                  <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20">
                    <p className="text-xs text-gold-400">Receives {formatCurrency(1000000)} in Month {selectedParticipant.position}</p>
                    <p className="text-lg font-bold text-gold-400 mt-1">
                      {selectedPayout?.status === 'paid' ? '✅ Received' : `📅 Scheduled`}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Contribution History</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedContributions.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/30">
                        <div>
                          <p className="text-xs font-medium text-white">Month {c.month}</p>
                          <p className="text-[10px] text-slate-500">{formatDate(c.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-white">{formatCurrency(c.totalPaid)}</p>
                          {c.operationalCharge > 0 && (
                            <p className="text-[10px] text-accent-400">+₦{c.operationalCharge.toLocaleString()} ops</p>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'paid'
                            ? 'bg-primary-500/20 text-primary-400'
                            : c.status === 'pending'
                            ? 'bg-accent-500/20 text-accent-400'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Contributed</span>
                    <span className="text-white font-bold">
                      {formatCurrency(selectedContributions.filter(c => c.status === 'paid').reduce((s, c) => s + c.totalPaid, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-400">Joined</span>
                    <span className="text-white">{formatDate(selectedParticipant.joinDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl mx-auto mb-4">
                👤
              </div>
              <p className="text-white font-semibold">Select a Participant</p>
              <p className="text-sm text-slate-400 mt-1">Click on any member to view their details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
