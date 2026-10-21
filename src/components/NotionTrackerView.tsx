import React, { useState } from 'react';
import { 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  DollarSign, 
  Tag, 
  Download, 
  Share2, 
  Plus, 
  Check, 
  Clock, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { JobListing, NotionConfig } from '../types';
import { downloadFile } from '../utils/downloadHelpers';

interface NotionTrackerViewProps {
  jobs: JobListing[];
  notionConfig: NotionConfig;
  onOpenNotionModal: () => void;
  onUpdateJobStatus: (jobId: string, newStatus: JobListing['status'], notes?: string) => void;
  onAddNewManualApplication: () => void;
}

export const NotionTrackerView: React.FC<NotionTrackerViewProps> = ({
  jobs,
  notionConfig,
  onOpenNotionModal,
  onUpdateJobStatus,
  onAddNewManualApplication,
}) => {
  const appliedJobs = jobs.filter((j) => j.status !== 'discovered' && j.status !== 'skipped');

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredAppliedJobs = appliedJobs.filter((job) => {
    if (filterStatus === 'all') return true;
    return job.status === filterStatus;
  });

  const countApplied = jobs.filter(j => j.status === 'applied').length;
  const countInterviewing = jobs.filter(j => j.status === 'interviewing').length;
  const countOffer = jobs.filter(j => j.status === 'offer').length;
  const countRejected = jobs.filter(j => j.status === 'rejected').length;

  const exportNotionCsv = () => {
    const headers = ['Job Title', 'Company', 'Status', 'Date Applied', 'Location', 'Job URL', 'Salary', 'Notes'];
    const rows = appliedJobs.map((j) => [
      `"${j.title.replace(/"/g, '""')}"`,
      `"${j.company.replace(/"/g, '""')}"`,
      j.status,
      j.appliedDate || '',
      `"${j.location}"`,
      j.applyUrl,
      `"${j.salaryRange || ''}"`,
      `"${(j.appliedNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile('notion_job_application_tracker.csv', csvContent, 'text/csv');
  };

  const getStatusBadge = (status: JobListing['status']) => {
    switch (status) {
      case 'applied':
        return <span className="px-2 py-0.5 rounded font-medium text-xs bg-blue-900/60 text-blue-300 border border-blue-700/50">Applied</span>;
      case 'interviewing':
        return <span className="px-2 py-0.5 rounded font-medium text-xs bg-amber-900/60 text-amber-300 border border-amber-700/50">Interviewing</span>;
      case 'offer':
        return <span className="px-2 py-0.5 rounded font-medium text-xs bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">Offer 🎉</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded font-medium text-xs bg-slate-800 text-slate-400 border border-slate-700">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 rounded font-medium text-xs bg-slate-800 text-slate-400">Discovered</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Notion Sync Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              N
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Notion: "Job Application Tracker"
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Database Replica
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Applications marked as <strong>Applied</strong> in this agent automatically push a new row to your Notion database with dates, links, salary expectations, and referral notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenNotionModal}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              notionConfig.isConnected
                ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/80'
                : 'bg-amber-950/70 border-amber-700/60 text-amber-300 hover:bg-amber-900/80'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{notionConfig.isConnected ? 'Connected: ' + (notionConfig.databaseName || 'Job Tracker') : 'Configure Notion API'}</span>
          </button>

          <button
            onClick={exportNotionCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Export CSV formatted for Notion Import"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium">Total Applied</span>
          <div className="text-2xl font-bold text-blue-400 font-mono mt-1">{appliedJobs.length}</div>
          <span className="text-[11px] text-slate-500">Logged into Notion</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium">Em Entrevistas</span>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">{countInterviewing}</div>
          <span className="text-[11px] text-slate-500">Pipeline ativo</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium">Propostas (Offers)</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{countOffer}</div>
          <span className="text-[11px] text-slate-500">Objetivo final</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium">Taxa de Resposta</span>
          <div className="text-2xl font-bold text-purple-400 font-mono mt-1">
            {appliedJobs.length > 0 ? Math.round(((countInterviewing + countOffer) / appliedJobs.length) * 100) : 0}%
          </div>
          <span className="text-[11px] text-slate-500">São Paulo Tech Market</span>
        </div>
      </div>

      {/* Database Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/70 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Visualizar status:</span>
          {(['all', 'applied', 'interviewing', 'offer', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors font-medium ${
                filterStatus === st
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st === 'all' ? `Todas (${appliedJobs.length})` : st}
            </button>
          ))}
        </div>

        <button
          onClick={onAddNewManualApplication}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nova Aplicação Manual</span>
        </button>
      </div>

      {/* Notion Database Table View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold font-mono text-[11px]">
                <th className="py-3 px-4">Job Title</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date Applied</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Job URL</th>
                <th className="py-3 px-4">Salary</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredAppliedJobs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 space-y-2">
                    <Database className="w-7 h-7 mx-auto text-slate-600" />
                    <div>Nenhuma candidatura registrada neste status ainda.</div>
                    <div className="text-[11px] text-slate-400">
                      Vá até a aba <strong>São Paulo Jobs</strong> e clique em <strong>"Aplicar &amp; Sincronizar"</strong> em qualquer vaga.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAppliedJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/50 transition-colors">
                    {/* Job Title */}
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="max-w-[200px] truncate" title={job.title}>
                        {job.title}
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-3 px-4 font-medium text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{job.company}</span>
                      </div>
                    </td>

                    {/* Status Select */}
                    <td className="py-3 px-4">
                      <select
                        value={job.status}
                        onChange={(e) => onUpdateJobStatus(job.id, e.target.value as any)}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offer">Offer 🎉</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Date Applied */}
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {job.appliedDate || 'Hoje'}
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-slate-400">
                      <div className="max-w-[120px] truncate" title={job.location}>
                        {job.location}
                      </div>
                    </td>

                    {/* Job URL */}
                    <td className="py-3 px-4">
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline max-w-[100px] truncate"
                        title={job.applyUrl}
                      >
                        <span>Link</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>

                    {/* Salary */}
                    <td className="py-3 px-4 font-mono text-emerald-400">
                      <div className="max-w-[130px] truncate" title={job.salaryRange || 'A combinar'}>
                        {job.salaryRange ? job.salaryRange.split('+')[0] : 'A combinar'}
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="py-3 px-4 text-slate-300">
                      <div className="max-w-[180px] truncate" title={job.appliedNotes || 'Sem notas'}>
                        {job.appliedNotes || '-'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          const newNote = prompt('Editar notas para ' + job.company, job.appliedNotes || '');
                          if (newNote !== null) {
                            onUpdateJobStatus(job.id, job.status, newNote);
                          }
                        }}
                        className="text-[11px] text-blue-400 hover:text-blue-300 underline"
                      >
                        Editar Nota
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
