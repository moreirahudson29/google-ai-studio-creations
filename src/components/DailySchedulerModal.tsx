import React, { useState } from 'react';
import { X, Clock, Terminal, CheckCircle2, Download, Play, Calendar, AlertCircle, Copy, Check } from 'lucide-react';
import { downloadWorkflowYml } from '../utils/downloadHelpers';

interface DailySchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerDailyScan: () => void;
  isScanning: boolean;
}

export const DailySchedulerModal: React.FC<DailySchedulerModalProps> = ({
  isOpen,
  onClose,
  onTriggerDailyScan,
  isScanning,
}) => {
  if (!isOpen) return null;

  const [copiedYml, setCopiedYml] = useState(false);
  const [scheduledLogs, setScheduledLogs] = useState<string[]>([
    '🤖 Scheduler initialized: Daily frequency set to 08:00 AM BRT (Monday - Friday)',
    '📍 Target: São Paulo Metropolitan Area (Data Analytics / BI / Analytics Eng)',
    '📁 Deduplication cache: jobs_tracker_data.json active',
    '📊 Last successful run: Today at 08:00 AM (Discovered 5 fresh openings in SP)'
  ]);

  const workflowYmlCode = `name: Daily São Paulo Data Jobs Search
on:
  schedule:
    # 08:00 AM São Paulo time (11:00 UTC) Mon-Fri
    - cron: '0 11 * * 1-5'
  workflow_dispatch:

jobs:
  daily-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install requests
      - name: Run search agent
        env:
          NOTION_API_KEY: \${{ secrets.NOTION_API_KEY }}
          NOTION_DATABASE_ID: \${{ secrets.NOTION_DATABASE_ID }}
        run: python agent.py search
`;

  const copyYml = () => {
    navigator.clipboard.writeText(workflowYmlCode);
    setCopiedYml(true);
    setTimeout(() => setCopiedYml(false), 2000);
  };

  const handleSimulateSchedule = () => {
    onTriggerDailyScan();
    setScheduledLogs(prev => [
      `[${new Date().toLocaleTimeString()}] 🚀 Manual run triggered from UI`,
      `[${new Date().toLocaleTimeString()}] Crawling LinkedIn, Gupy, Greenhouse, and Glassdoor for São Paulo...`,
      `[${new Date().toLocaleTimeString()}] ✅ Scan complete! New openings added to review queue.`,
      ...prev
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Agendamento Diário Automático</h3>
              <p className="text-xs text-slate-400">Busca matinal às 08:00 AM (Horário de Brasília)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 text-xs overflow-y-auto">
          {/* Overview */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Rotina Automática Sem Servidor (GitHub Actions)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-800">
                100% Gratuito
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Você não precisa deixar seu computador ligado o dia todo. Ao salvar o arquivo de fluxo abaixo no seu repositório GitHub privado, o GitHub executa o script todo dia às <strong>08:00 de São Paulo</strong>, descobre as vagas novas e as deixa prontas no arquivo de controle.
            </p>
          </div>

          {/* Workflow Code Block */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-mono text-[11px] font-semibold text-emerald-400">
                .github/workflows/daily_job_search.yml
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyYml}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {copiedYml ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedYml ? 'Copiado!' : 'Copiar YAML'}</span>
                </button>
                <button
                  onClick={downloadWorkflowYml}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/60"
                >
                  <Download className="w-3 h-3" />
                  <span>Baixar .yml</span>
                </button>
              </div>
            </div>
            <pre className="bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono text-[11px] text-cyan-300/90 overflow-x-auto leading-relaxed">
              {workflowYmlCode}
            </pre>
          </div>

          {/* Terminal Logs Simulation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold flex items-center gap-1.5 text-slate-200">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Logs da Execução do Agente
              </span>
              <button
                onClick={handleSimulateSchedule}
                disabled={isScanning}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>{isScanning ? 'Executando...' : 'Testar Execução Agora'}</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono text-[11px] space-y-1 text-slate-400 max-h-36 overflow-y-auto">
              {scheduledLogs.map((log, i) => (
                <div key={i} className="text-slate-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
