import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  ExternalLink, 
  CheckCircle, 
  Sparkles, 
  Filter, 
  RefreshCw, 
  Calendar, 
  Tag, 
  Check, 
  ChevronRight,
  Database,
  Briefcase,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { JobListing } from '../types';

interface JobSearchSectionProps {
  jobs: JobListing[];
  onOpenApplyModal: (job: JobListing) => void;
  onOpenAiMatchModal: (job: JobListing) => void;
  onTriggerDailyScan: () => void;
  isScanning: boolean;
}

export const JobSearchSection: React.FC<JobSearchSectionProps> = ({
  jobs,
  onOpenApplyModal,
  onOpenAiMatchModal,
  onTriggerDailyScan,
  isScanning,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [workplaceFilter, setWorkplaceFilter] = useState<string>('Todos');
  const [levelFilter, setLevelFilter] = useState<string>('Todos');
  const [selectedTech, setSelectedTech] = useState<string>('Todos');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const techOptions = ['Todos', 'SQL', 'Python', 'Power BI', 'dbt', 'BigQuery', 'Snowflake', 'Tableau'];

  const filteredJobs = jobs.filter((job) => {
    // Search query matches title, company, or description
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.neighborhood && job.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesWorkplace = workplaceFilter === 'Todos' || job.workplaceType === workplaceFilter;
    const matchesLevel = levelFilter === 'Todos' || job.level === levelFilter;
    const matchesTech = selectedTech === 'Todos' || job.tags.includes(selectedTech);
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'unapplied' && job.status === 'discovered') ||
      (statusFilter === 'applied' && job.status !== 'discovered');

    return matchesSearch && matchesWorkplace && matchesLevel && matchesTech && matchesStatus;
  });

  const appliedCount = jobs.filter(j => j.status !== 'discovered').length;
  const discoveredCount = jobs.filter(j => j.status === 'discovered').length;

  return (
    <div className="space-y-6">
      {/* Control Hero & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              São Paulo Data Analytics Radar
            </h2>
            <p className="text-xs text-slate-400">
              Live crawler scanning LinkedIn, Gupy, Greenhouse, and Glassdoor for SP tech companies
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onTriggerDailyScan}
              disabled={isScanning}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                isScanning
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isScanning ? 'Scanning São Paulo Job Boards...' : 'Run Daily Scan Now'}</span>
            </button>
          </div>
        </div>

        {/* Search input & Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-3 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by role, company, neighborhood (e.g. Faria Lima, Nubank, dbt, SQL)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 justify-around text-xs">
            <div className="text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">To Review</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">{discoveredCount}</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div className="text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">In Notion</span>
              <span className="font-bold text-blue-400 font-mono text-sm">{appliedCount}</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-medium mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros:</span>
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Status: Todas ({jobs.length})</option>
            <option value="unapplied">Apenas Pendentes ({discoveredCount})</option>
            <option value="applied">Já Aplicadas no Notion ({appliedCount})</option>
          </select>

          {/* Workplace */}
          <select
            value={workplaceFilter}
            onChange={(e) => setWorkplaceFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="Todos">Modelo: Todos</option>
            <option value="Híbrido">Híbrido (SP)</option>
            <option value="Remoto">Remoto</option>
            <option value="Presencial">Presencial (SP)</option>
          </select>

          {/* Level */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="Todos">Senioridade: Todas</option>
            <option value="Júnior">Júnior</option>
            <option value="Pleno">Pleno</option>
            <option value="Sênior">Sênior</option>
            <option value="Lead / Especialista">Lead / Especialista</option>
          </select>

          {/* Tech Stack Pills */}
          <div className="flex items-center gap-1.5 ml-auto overflow-x-auto py-1">
            <span className="text-[11px] text-slate-500">Tech:</span>
            {techOptions.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  selectedTech === tech
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
            <Search className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">Nenhuma vaga encontrada com os filtros selecionados</h3>
            <p className="text-xs text-slate-400">Tente ajustar a busca ou clique em "Run Daily Scan Now" para atualizar.</p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isApplied = job.status !== 'discovered';
            return (
              <div
                key={job.id}
                className={`bg-slate-900 border rounded-2xl p-5 transition-all hover:border-slate-700 shadow-md ${
                  isApplied
                    ? 'border-blue-900/40 bg-slate-900/50 opacity-90'
                    : 'border-slate-800 hover:shadow-emerald-950/20'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Job Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-white flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                        {job.company}
                      </span>

                      {job.neighborhood && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          {job.location} ({job.neighborhood})
                        </span>
                      )}

                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        job.workplaceType === 'Híbrido'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                          : job.workplaceType === 'Remoto'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                          : 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                      }`}>
                        {job.workplaceType}
                      </span>

                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300">
                        {job.level}
                      </span>

                      {job.matchScore && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {job.matchScore}% Match SP
                        </span>
                      )}

                      {isApplied && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-900/80 text-blue-300 border border-blue-700/60 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Aplicado no Notion
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white hover:text-emerald-400 transition-colors">
                        {job.title}
                      </h3>
                      {job.salaryRange && (
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 mt-0.5">
                          <DollarSign className="w-3.5 h-3.5" />
                          {job.salaryRange}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {job.description}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-950 text-slate-300 border border-slate-800"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="text-[11px] text-slate-500 ml-2">
                        Fonte: <strong className="text-slate-400">{job.source}</strong> • Postado {job.postedAt}
                      </span>
                    </div>

                    {/* If already applied, show note */}
                    {job.appliedNotes && (
                      <div className="bg-slate-950/80 border border-blue-900/40 rounded-xl p-2.5 text-xs text-slate-300 flex items-start gap-2">
                        <Database className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-blue-300">Nota salva no Notion ({job.appliedDate}):</strong> {job.appliedNotes}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2.5 shrink-0 pt-2 lg:pt-0">
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700"
                    >
                      <span>Abrir Vaga</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => onOpenAiMatchModal(job)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/50 transition-colors"
                      title="AI Resume & ATS Match Tips"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Dicas ATS</span>
                    </button>

                    <button
                      onClick={() => onOpenApplyModal(job)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                        isApplied
                          ? 'bg-blue-600/80 hover:bg-blue-600 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>{isApplied ? 'Atualizar no Notion' : 'Aplicar & Sincronizar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
