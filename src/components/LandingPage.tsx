import React from 'react';
import { ArrowRight, Shield, Users, TrendingUp, Clock, DollarSign, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-lg font-bold text-slate-900">
              B
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Bookey</h1>
              <p className="text-xs text-slate-400 -mt-0.5">Thrift Bank</p>
            </div>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-2 bg-gradient-to-r from-primary-500 to-gold-500 hover:from-primary-600 hover:to-gold-600 text-slate-900 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Smart <span className="bg-gradient-to-r from-primary-400 to-gold-400 bg-clip-text text-transparent">Thrift Banking</span>
              <br />for Modern Communities
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Join Bookey Thrift Bank and transform your savings habits. Pool resources with your community,
              earn competitive returns, and build financial security together.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-gold-500 hover:from-primary-600 hover:to-gold-600 text-slate-900 font-bold text-lg rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center gap-2 group"
            >
              Get Started Today
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-lg rounded-xl transition-all duration-200">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">₦2.5M+</div>
              <div className="text-sm text-slate-400">Total Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-400 mb-2">500+</div>
              <div className="text-sm text-slate-400">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-400 mb-2">95%</div>
              <div className="text-sm text-slate-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">3 Years</div>
              <div className="text-sm text-slate-400">Operating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Bookey?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Experience the power of collective savings with our proven thrift banking system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 flex items-center justify-center mb-4">
                <Shield className="text-primary-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Transparent</h3>
              <p className="text-slate-300">
                Your savings are protected with bank-grade security and full transparency in all transactions.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center mb-4">
                <TrendingUp className="text-gold-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Competitive Returns</h3>
              <p className="text-slate-300">
                Earn attractive interest rates on your savings with our optimized contribution cycles.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-500/20 to-accent-600/20 flex items-center justify-center mb-4">
                <Users className="text-accent-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Community Focused</h3>
              <p className="text-slate-300">
                Build financial discipline while supporting your community through collective savings.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mb-4">
                <Clock className="text-green-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Flexible Timing</h3>
              <p className="text-slate-300">
                Choose contribution schedules that fit your lifestyle with monthly, weekly, or custom options.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4">
                <DollarSign className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Withdrawals</h3>
              <p className="text-slate-300">
                Access your funds when you need them with our streamlined payout process.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                <CheckCircle className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Proven Track Record</h3>
              <p className="text-slate-300">
                Join thousands of satisfied members who have successfully built wealth through our system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Saving?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join our thriving community of savers and take control of your financial future today.
          </p>
          <button
            onClick={onGetStarted}
            className="px-12 py-4 bg-gradient-to-r from-primary-500 to-gold-500 hover:from-primary-600 hover:to-gold-600 text-slate-900 font-bold text-xl rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center gap-3 mx-auto group"
          >
            Join Bookey Today
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-sm font-bold text-slate-900">
              B
            </div>
            <span className="text-lg font-bold text-white">Bookey Thrift Bank</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 Bookey Thrift Bank. Building financial futures together.
          </p>
        </div>
      </footer>
    </div>
  );
}