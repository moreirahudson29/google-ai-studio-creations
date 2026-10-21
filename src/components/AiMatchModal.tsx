import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Copy, Check, Building2, Tag, BookOpen, AlertTriangle } from 'lucide-react';
import { JobListing } from '../types';

interface AiMatchModalProps {
  job: JobListing | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyFromHere: (job: JobListing) => void;
}

export const AiMatchModal: React.FC<AiMatchModalProps> = ({
  job,
  isOpen,
  onClose,
  onApplyFromHere,
}) => {
  if (!isOpen || !job) return null;

  const [copiedCover, setCopiedCover] = useState(false);

  const sampleCoverLetter = `Olá time de recrutamento da ${job.company},

Acompanho a trajetória de inovação da ${job.company} e fiquei muito entusiasmado com a oportunidade de ${job.title}.

Tenho sólida experiência em modelagem e análise de dados utilizando ${job.tags.slice(0, 3).join(', ')}, com foco direto na geração de insights acionáveis e suporte à tomada de decisão de produto e negócios.

Acredito que posso contribuir imediatamente para os desafios da equipe de dados em ${job.location}. Fico à disposição para conversar!

Atenciosamente,
[Seu Nome] | São Paulo, SP`;

  const copyCover = () => {
    navigator.clipboard.writeText(sampleCoverLetter);
    setCopiedCover(true);
    setTimeout(() => setCopiedCover(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Análise de Match &amp; Dicas ATS (São Paulo)</h3>
              <p className="text-xs text-slate-400">{job.company} — {job.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs overflow-y-auto">
          {/* Match Score Indicator */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">Índice de Aderência ao Perfil</span>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                {job.matchScore || 92}% de Match
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400">Plataforma de Candidatura</span>
              <div className="text-xs font-bold text-white mt-0.5 flex items-center gap-1 justify-end">
                <Tag className="w-3 h-3 text-cyan-400" />
                {job.source}
              </div>
            </div>
          </div>

          {/* Key ATS Keywords */}
          <div className="space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Palavras-Chave Obrigatórias no seu CV para esta Vaga:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {job.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 font-mono text-[11px] border border-slate-700">
                  {t}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
                Modelagem Dimensional
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
                São Paulo (Híbrido)
              </span>
            </div>
          </div>

          {/* Platform Specific Advice */}
          <div className="bg-indigo-950/40 border border-indigo-900/50 p-3.5 rounded-xl space-y-1 text-slate-300">
            <span className="font-bold text-indigo-300 text-[11px] uppercase tracking-wider block">
              Dica para o Mercado de Tecnologia em São Paulo:
            </span>
            <p className="text-xs leading-relaxed text-indigo-100">
              {job.source === 'Gupy'
                ? 'Para processos na Gupy, a IA prioriza candidatos que incluem exatamente os termos de requisitos na descrição de experiências anteriores. Realize os testes de lógica/fit logo após se cadastrar.'
                : 'Esta vaga em ATS corporativo (Greenhouse/Lever) prioriza projetos reais descritos com métricas de impacto (ex: "Redução de tempo de processamento de queries em 40% com dbt").'}
            </p>
          </div>

          {/* Quick Cover Note */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold text-white">Carta de Apresentação / Mensagem Rápida:</span>
              <button
                onClick={copyCover}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                {copiedCover ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCover ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">
              {sampleCoverLetter}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            Fechar
          </button>

          <button
            onClick={() => {
              onClose();
              onApplyFromHere(job);
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-lg shadow-emerald-600/20"
          >
            Ir para Candidatura &amp; Notion
          </button>
        </div>
      </div>
    </div>
  );
};
