import React, { useState, useEffect } from 'react';
import { X, Database, Check, ExternalLink, Calendar, Building2, DollarSign, Tag, Sparkles } from 'lucide-react';
import { JobListing, NotionConfig } from '../types';

interface ApplyModalProps {
  job: JobListing | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmApply: (jobId: string, notes: string, status: JobListing['status'], salary?: string) => void;
  notionConfig: NotionConfig;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  isOpen,
  onClose,
  onConfirmApply,
  notionConfig,
}) => {
  if (!isOpen || !job) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const [notes, setNotes] = useState(job.appliedNotes || '');
  const [status, setStatus] = useState<JobListing['status']>(job.status === 'discovered' ? 'applied' : job.status);
  const [salary, setSalary] = useState(job.salaryRange || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    setNotes(job.appliedNotes || '');
    setStatus(job.status === 'discovered' ? 'applied' : job.status);
    setSalary(job.salaryRange || '');
    setSyncSuccess(false);
  }, [job]);

  const quickNotes = [
    'Aplicado via Gupy com teste de fit cultural',
    'Indicação direta de colega na equipe de BI',
    'Enviado CV versão Fintech / Python',
    'Pretensão salarial informada: R$ 12.000 CLT',
    'Contato feito com Recrutador no LinkedIn'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onConfirmApply(job.id, notes, status, salary);
      setIsSubmitting(false);
      setSyncSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Registrar Candidatura no Notion</h3>
              <p className="text-xs text-slate-400">Banco: Job Application Tracker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Target Job Overview */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white">{job.title}</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {job.level}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                {job.company}
              </span>
              <span>•</span>
              <span>{job.location}</span>
            </div>
            <div className="pt-1">
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
              >
                <span>{job.applyUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Status da Candidatura</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="applied">Applied (Candidatou-se)</option>
                <option value="interviewing">Interviewing (Entrevista)</option>
                <option value="offer">Offer (Proposta)</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Data de Envio</label>
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-300 font-mono">
                <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400" />
                <span>{todayStr}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Pretensão / Salário Informado</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Ex: R$ 12.000 CLT + Benefícios"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-medium">Notas &amp; Detalhes da Aplicação</label>
              <span className="text-[10px] text-slate-500">Salvo no Notion "Notes"</span>
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Indicado por Carlos, enviado CV versão Dados & Python, resposta prevista para próxima semana..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickNotes.map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => setNotes(prev => prev ? `${prev}. ${chip}` : chip)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-colors"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Destination Notification */}
          <div className="bg-blue-950/40 border border-blue-900/50 rounded-xl p-3 flex items-start gap-2.5 text-blue-200">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-semibold text-white">Sincronização Automática com Notion</div>
              <p className="text-[11px] text-blue-300">
                Uma nova linha será gravada com o cargo, empresa, link, data ({todayStr}) e suas anotações no database <strong>Job Application Tracker</strong>.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || syncSuccess}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
                syncSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {syncSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Sincronizado no Notion!</span>
                </>
              ) : isSubmitting ? (
                <span>Gravando no Notion...</span>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Confirmar &amp; Salvar no Notion</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
