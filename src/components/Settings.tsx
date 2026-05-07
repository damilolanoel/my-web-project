import { useState } from 'react';
import { formatCurrency } from '../data';
import {
  Save,
  Shield,
  Bell,
  CreditCard,
  Users,
  FileText,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function Settings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* System Config */}
      <div className="glass-card rounded-2xl border border-slate-700/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/30 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-500/10">
            <Shield size={18} className="text-primary-400" />
          </div>
          <div>
            <h3 className="text-white font-bold">System Configuration</h3>
            <p className="text-xs text-slate-400">Core thrift system parameters</p>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Number of Participants</label>
              <input
                type="number"
                defaultValue={10}
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-white text-sm outline-none focus:border-primary-500/50"
                readOnly
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Monthly Contribution</label>
              <input
                type="text"
                defaultValue="₦100,000"
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-white text-sm outline-none focus:border-primary-500/50"
                readOnly
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Operational Charge (Month 1)</label>
              <input
                type="text"
                defaultValue="₦8,000"
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-white text-sm outline-none focus:border-primary-500/50"
                readOnly
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Monthly Payout</label>
              <input
                type="text"
                defaultValue="₦1,000,000"
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-white text-sm outline-none focus:border-primary-500/50"
                readOnly
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Cycle Start Date</label>
              <input
                type="text"
                defaultValue="May 1, 2026"
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-white text-sm outline-none focus:border-primary-500/50"
                readOnly
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Cycle End Date</label>
              <input
                type="text"
                defaultValue="February 28, 2027"
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-white text-sm outline-none focus:border-primary-500/50"
                readOnly
              />
            </div>
          </div>

          {/* Info */}
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-3">
            <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-400 space-y-1">
              <p>• First month contribution: <span className="text-white">{formatCurrency(108000)}</span> (₦100,000 + ₦8,000 operational charge)</p>
              <p>• Subsequent months: <span className="text-white">{formatCurrency(100000)}</span> per participant</p>
              <p>• Total each member pays over 10 months: <span className="text-white">{formatCurrency(1008000)}</span></p>
              <p>• Total each member receives: <span className="text-gold-400">{formatCurrency(1000000)}</span></p>
              <p>• Total operational revenue: <span className="text-accent-400">{formatCurrency(80000)}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass-card rounded-2xl border border-slate-700/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/30 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent-500/10">
            <Bell size={18} className="text-accent-400" />
          </div>
          <div>
            <h3 className="text-white font-bold">Notification Settings</h3>
            <p className="text-xs text-slate-400">Configure alerts and reminders</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Payment Reminders', desc: 'Send reminders 3 days before due date', default: true },
            { label: 'Payment Confirmation', desc: 'Notify when a contribution is confirmed', default: true },
            { label: 'Payout Notifications', desc: 'Notify recipient when payout is processed', default: true },
            { label: 'Overdue Alerts', desc: 'Alert admin when payments are overdue', default: true },
            { label: 'Monthly Summary', desc: 'Send monthly summary report to all members', default: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/20">
              <div>
                <p className="text-sm text-white font-medium">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Integration */}
      <div className="glass-card rounded-2xl border border-slate-700/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/30 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gold-500/10">
            <CreditCard size={18} className="text-gold-400" />
          </div>
          <div>
            <h3 className="text-white font-bold">Payment Integration</h3>
            <p className="text-xs text-slate-400">Configure payment platform</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: 'Paystack', status: 'active', color: 'border-primary-500/30 bg-primary-500/5' },
              { name: 'Flutterwave', status: 'inactive', color: 'border-slate-700/30' },
              { name: 'Bank Transfer', status: 'active', color: 'border-primary-500/30 bg-primary-500/5' },
            ].map(platform => (
              <div key={platform.name} className={`p-4 rounded-xl border ${platform.color} text-center cursor-pointer hover:scale-[1.02] transition-transform`}>
                <p className="text-white font-semibold">{platform.name}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  platform.status === 'active' ? 'bg-primary-500/20 text-primary-400' : 'bg-slate-700 text-slate-400'
                }`}>
                  {platform.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="glass-card rounded-2xl border border-slate-700/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/30 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <FileText size={18} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-bold">Legal & Compliance</h3>
            <p className="text-xs text-slate-400">Agreements and terms</p>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {[
            { label: 'Participant Agreement Template', status: 'Active' },
            { label: 'Terms of Service', status: 'Active' },
            { label: 'Privacy Policy', status: 'Draft' },
            { label: 'Tax Compliance Guide', status: 'Review' },
          ].map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/20">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-slate-500" />
                <p className="text-sm text-white">{doc.label}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                doc.status === 'Active' ? 'bg-primary-500/20 text-primary-400' :
                doc.status === 'Draft' ? 'bg-accent-500/20 text-accent-400' :
                'bg-gold-500/20 text-gold-400'
              }`}>
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rotation Order */}
      <div className="glass-card rounded-2xl border border-slate-700/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/30 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary-500/10">
            <Users size={18} className="text-primary-400" />
          </div>
          <div>
            <h3 className="text-white font-bold">Rotation Order</h3>
            <p className="text-xs text-slate-400">Payout recipient sequence</p>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            {['A - Adebayo Oluwaseun (May 2026)', 'B - Blessing Okafor (June 2026)', 'C - Chidera Nwosu (July 2026)',
              'D - Damilola Adesanya (August 2026)', 'E - Emeka Eze (September 2026)', 'F - Fatima Ibrahim (October 2026)',
              'G - Gbenga Adeyemi (November 2026)', 'H - Halima Mohammed (December 2026)', 'I - Ikenna Obi (January 2027)',
              'J - Jumoke Balogun (February 2027)'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/30 border border-slate-700/20">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500/20 to-gold-500/20 flex items-center justify-center text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/20"
        >
          {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {saved ? 'Saved Successfully!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
