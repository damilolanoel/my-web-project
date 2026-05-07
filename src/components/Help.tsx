import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I make a contribution payment?',
    answer: 'You can make payments directly through the platform by clicking the "Pay Now" button on your pending contributions. The system supports secure payment processing.',
    category: 'Payments',
  },
  {
    id: '2',
    question: 'When are contributions due?',
    answer: 'Contributions are due at the end of each month. You will receive payment reminders 3 days before the due date. Late payments may incur penalties.',
    category: 'Payments',
  },
  {
    id: '3',
    question: 'How does the payout rotation work?',
    answer: 'Each member receives ₦1,000,000 payout in their designated month. The rotation follows the member positions (1-10) over 10 months.',
    category: 'Payouts',
  },
  {
    id: '4',
    question: 'What happens if I miss a payment?',
    answer: 'Missing payments will be marked as overdue. You will receive notifications and may incur penalties. Please contact support to resolve any issues.',
    category: 'Payments',
  },
  {
    id: '5',
    question: 'How do I view my contribution history?',
    answer: 'Navigate to the Contributions page or check your dashboard. You can filter by month and status to view your payment history.',
    category: 'General',
  },
  {
    id: '6',
    question: 'Can I change my account information?',
    answer: 'Contact support to update your personal information. Username and password changes require admin approval.',
    category: 'Account',
  },
  {
    id: '7',
    question: 'What are operational charges?',
    answer: 'Operational charges (₦8,000) are collected in the first month to cover administrative and operational costs of the thrift scheme.',
    category: 'Payments',
  },
  {
    id: '8',
    question: 'How do I contact support?',
    answer: 'You can reach support through the contact information below or use the contact form in this help section.',
    category: 'Support',
  },
];

const categories = ['All', 'Payments', 'Payouts', 'Account', 'General', 'Support'];

export default function Help() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const filteredFAQs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to a backend
    alert('Thank you for your message. We will get back to you soon!');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-primary-500/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-primary-500/10">
            <HelpCircle size={24} className="text-primary-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Help & Support</h2>
            <p className="text-slate-400">Find answers to common questions and get support</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
            <h3 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h3>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFAQs.map(faq => (
                <div key={faq.id} className="border border-slate-700/50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                  >
                    <span className="text-sm font-medium text-white">{faq.question}</span>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-4 pb-3">
                      <p className="text-sm text-slate-300">{faq.answer}</p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-slate-700/50 text-slate-400 rounded">
                        {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Support</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-500/10">
                  <Phone size={16} className="text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Phone</p>
                  <p className="text-xs text-slate-400">+234 801 234 5678</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-500/10">
                  <Mail size={16} className="text-accent-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <p className="text-xs text-slate-400">support@bookeythrift.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gold-500/10">
                  <MessageSquare size={16} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Live Chat</p>
                  <p className="text-xs text-slate-400">Available 9 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
            <h3 className="text-lg font-semibold text-white mb-4">Send us a Message</h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="glass-card rounded-2xl p-6 border border-slate-700/30">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-primary-400 transition-colors"
              >
                <ExternalLink size={14} />
                Terms & Conditions
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-primary-400 transition-colors"
              >
                <ExternalLink size={14} />
                Privacy Policy
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-primary-400 transition-colors"
              >
                <ExternalLink size={14} />
                Payment Guide
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-primary-400 transition-colors"
              >
                <ExternalLink size={14} />
                FAQ Archive
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}