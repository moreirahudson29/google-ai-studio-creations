import React from 'react';
import { 
  Download, 
  Search, 
  BookOpen, 
  Database, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Code2
} from 'lucide-react';
import { downloadIpynbNotebook } from '../utils/downloadHelpers';
import { NotionConfig } from '../types';

interface HeaderProps {
  activeTab: 'hunter' | 'notebook' | 'notion' | 'scheduler';
  setActiveTab: (tab: 'hunter' | 'notebook' | 'notion' | 'scheduler') => void;
  notionConfig: NotionConfig;
  onOpenNotionModal: () => void;
  onOpenSchedulerModal: () => void;
  appliedCount: number;
  totalJobsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  notionConfig,
  onOpenNotionModal,
  onOpenSchedulerModal,
  appliedCount,
  totalJobsCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95">
      {/* Top Banner with location & live status */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-cyan-900/30 to-blue-900/40 border-b border-emerald-500/20 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Agent Status: Active Daily Crawler
          </span>
          <span className="text-slate-500">|</span>
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            Target: <strong>São Paulo, Brazil</strong> (Data Analytics / BI / Analytics Eng)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-300 hidden sm:inline">
            Applications: <span className="text-emerald-400 font-bold">{appliedCount}</span> / {totalJobsCount}
          </span>
          <button
            onClick={onOpenNotionModal}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
              notionConfig.isConnected
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/80'
                : 'bg-amber-950/70 text-amber-300 border-amber-700/60 hover:bg-amber-900/80'
            }`}
          >
            <Database className="w-3 h-3" />
            {notionConfig.isConnected ? 'Notion: Synced' : 'Notion: Setup Required'}
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                DataJobs SP <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-medium border border-emerald-500/30">AGENT</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Daily Job Hunter &amp; Notion Application Tracker
            </p>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shadow-inner">
          <button
            onClick={() => setActiveTab('hunter')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'hunter'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>São Paulo Jobs</span>
            <span className="text-[10px] bg-slate-900/60 px-1.5 py-0.5 rounded-full font-mono">
              {totalJobsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notebook')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'notebook'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Jupyter Notebook (.ipynb)</span>
          </button>

          <button
            onClick={() => setActiveTab('notion')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'notion'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Notion Tracker</span>
            {appliedCount > 0 && (
              <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded-full font-bold">
                {appliedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('scheduler')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'scheduler'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scheduler</span>
          </button>
        </nav>

        {/* Primary CTA: Download .ipynb Notebook */}
        <div className="flex items-center gap-2">
          <button
            onClick={downloadIpynbNotebook}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] border border-amber-300/30"
            title="Download complete runnable job_application_tracker_agent.ipynb file"
          >
            <Download className="w-4 h-4" />
            <span>Download .ipynb Notebook</span>
          </button>
        </div>
      </div>
    </header>
  );
};
