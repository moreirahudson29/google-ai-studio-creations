import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { JobSearchSection } from './components/JobSearchSection';
import { NotebookViewer } from './components/NotebookViewer';
import { NotionTrackerView } from './components/NotionTrackerView';
import { ApplyModal } from './components/ApplyModal';
import { NotionSetupModal } from './components/NotionSetupModal';
import { DailySchedulerModal } from './components/DailySchedulerModal';
import { AiMatchModal } from './components/AiMatchModal';
import { INITIAL_JOBS } from './data/jobsData';
import { JobListing, NotionConfig } from './types';
import { 
  Download, 
  Sparkles, 
  Clock, 
  Database, 
  MapPin, 
  CheckCircle2, 
  ExternalLink,
  BookOpen,
  Search,
  Bell
} from 'lucide-react';
import { downloadIpynbNotebook } from './utils/downloadHelpers';

export default function App() {
  // Load saved state or use defaults
  const [jobs, setJobs] = useState<JobListing[]>(() => {
    try {
      const saved = localStorage.getItem('datajobs_sp_jobs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_JOBS;
  });

  const [notionConfig, setNotionConfig] = useState<NotionConfig>(() => {
    try {
      const saved = localStorage.getItem('datajobs_sp_notion_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      apiKey: 'secret_notion_demo_integration_sp_data_analytics_tracker',
      databaseId: '7c92b8d04e1f48039c28a8d9f1092e44',
      databaseName: 'Job Application Tracker',
      isConnected: true,
      lastSyncTime: 'Hoje às 08:00',
    };
  });

  const [activeTab, setActiveTab] = useState<'hunter' | 'notebook' | 'notion' | 'scheduler'>('hunter');
  const [isScanning, setIsScanning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [selectedApplyJob, setSelectedApplyJob] = useState<JobListing | null>(null);
  const [selectedAiJob, setSelectedAiJob] = useState<JobListing | null>(null);
  const [isNotionModalOpen, setIsNotionModalOpen] = useState(false);
  const [isSchedulerModalOpen, setIsSchedulerModalOpen] = useState(false);

  // Persist jobs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('datajobs_sp_jobs', JSON.stringify(jobs));
    } catch (e) {
      console.error(e);
    }
  }, [jobs]);

  // Persist Notion config
  useEffect(() => {
    try {
      localStorage.setItem('datajobs_sp_notion_config', JSON.stringify(notionConfig));
    } catch (e) {
      console.error(e);
    }
  }, [notionConfig]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleConfirmApply = (
    jobId: string, 
    notes: string, 
    status: JobListing['status'], 
    salary?: string
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status,
            appliedDate: todayStr,
            appliedNotes: notes,
            salaryRange: salary || j.salaryRange,
            notionPageId: `notion-page-${Date.now()}`,
          };
        }
        return j;
      })
    );
    showToast(`✅ Candidatura registrada e enviada para o Notion 'Job Application Tracker'!`);
  };

  const handleUpdateJobStatus = (
    jobId: string, 
    newStatus: JobListing['status'], 
    notes?: string
  ) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status: newStatus,
            appliedNotes: notes !== undefined ? notes : j.appliedNotes,
          };
        }
        return j;
      })
    );
    showToast(`Status atualizado no Notion para: ${newStatus}`);
  };

  const handleTriggerDailyScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Simulate finding new São Paulo positions
      const newJobsFound: JobListing[] = [
        {
          id: `sp-job-live-${Date.now()}`,
          title: 'Senior Analytics Engineer - Core Banking',
          company: 'C6 Bank',
          location: 'São Paulo, SP',
          neighborhood: 'Jardins / Faria Lima',
          workplaceType: 'Híbrido',
          level: 'Sênior',
          salaryRange: 'R$ 15.000 - R$ 19.000 / mês',
          tags: ['dbt', 'Snowflake', 'Python', 'Fintech', 'SQL'],
          description: 'Responsável pela arquitetura e governança das camadas dimensional e marts de dados para produtos de conta corrente e investimentos.',
          requirements: [
            'Experiência profunda em dbt (Core ou Cloud)',
            'Modelagem analítica em Snowflake',
            'Sólida experiência em ambientes bancários regulados'
          ],
          postedAt: 'Agora mesmo (Crawler Matinal)',
          applyUrl: 'https://c6bank.gupy.io/job/analytics-eng-sp',
          source: 'Gupy',
          matchScore: 95,
          status: 'discovered',
        },
        {
          id: `sp-job-live-${Date.now() + 1}`,
          title: 'Data Analyst Pleno - Adquirência & POS',
          company: 'PagBank',
          location: 'São Paulo, SP',
          neighborhood: 'Faria Lima',
          workplaceType: 'Híbrido',
          level: 'Pleno',
          salaryRange: 'R$ 8.500 - R$ 11.000 / mês + PLR',
          tags: ['SQL', 'Power BI', 'Python', 'BigQuery'],
          description: 'Acompanhamento de volume financeiro transacionado (TPV) e churn de lojistas na cidade de São Paulo e grande SP.',
          requirements: [
            'SQL avançado e modelagem relacional',
            'Criação de dashboards em Power BI',
            'Foco em metas e relacionamento com áreas de negócios'
          ],
          postedAt: 'Agora mesmo (Crawler Matinal)',
          applyUrl: 'https://pagbank.gupy.io/job/data-analyst-pos',
          source: 'Gupy',
          matchScore: 91,
          status: 'discovered',
        }
      ];

      setJobs(prev => {
        // avoid duplicate by title and company
        const existingKeys = new Set(prev.map(j => `${j.company}-${j.title}`));
        const filtered = newJobsFound.filter(j => !existingKeys.has(`${j.company}-${j.title}`));
        return [...filtered, ...prev];
      });

      setIsScanning(false);
      showToast(`🎉 Varredura concluída! 2 novas oportunidades em São Paulo identificadas.`);
    }, 1200);
  };

  const handleAddNewManualApplication = () => {
    const title = prompt('Título do Cargo (ex: Data Analyst Pleno):');
    if (!title) return;
    const company = prompt('Nome da Empresa (ex: Nubank):') || 'Empresa em SP';
    const link = prompt('Link da Vaga / URL:') || 'https://linkedin.com';
    const notes = prompt('Notas / Observações:') || 'Adicionado manualmente';

    const newJob: JobListing = {
      id: `manual-${Date.now()}`,
      title,
      company,
      location: 'São Paulo, SP',
      workplaceType: 'Híbrido',
      level: 'Pleno',
      tags: ['Data Analytics', 'SQL'],
      description: 'Aplicação registrada manualmente pelo usuário.',
      requirements: [],
      postedAt: 'Hoje',
      applyUrl: link,
      source: 'LinkedIn',
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      appliedNotes: notes,
      notionPageId: `notion-manual-${Date.now()}`
    };

    setJobs(prev => [newJob, ...prev]);
    showToast(`✅ Vaga manual inserida e sincronizada com o Notion!`);
  };

  const appliedCount = jobs.filter(j => j.status !== 'discovered' && j.status !== 'skipped').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900/90 border border-emerald-500/50 text-white px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Bell className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notionConfig={notionConfig}
        onOpenNotionModal={() => setIsNotionModalOpen(true)}
        onOpenSchedulerModal={() => setIsSchedulerModalOpen(true)}
        appliedCount={appliedCount}
        totalJobsCount={jobs.length}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* TAB 1: São Paulo Job Hunter */}
        {activeTab === 'hunter' && (
          <JobSearchSection
            jobs={jobs}
            onOpenApplyModal={(job) => setSelectedApplyJob(job)}
            onOpenAiMatchModal={(job) => setSelectedAiJob(job)}
            onTriggerDailyScan={handleTriggerDailyScan}
            isScanning={isScanning}
          />
        )}

        {/* TAB 2: Notebook Viewer (.ipynb) */}
        {activeTab === 'notebook' && (
          <NotebookViewer />
        )}

        {/* TAB 3: Notion Database Tracker */}
        {activeTab === 'notion' && (
          <NotionTrackerView
            jobs={jobs}
            notionConfig={notionConfig}
            onOpenNotionModal={() => setIsNotionModalOpen(true)}
            onUpdateJobStatus={handleUpdateJobStatus}
            onAddNewManualApplication={handleAddNewManualApplication}
          />
        )}

        {/* TAB 4: Automated Scheduler */}
        {activeTab === 'scheduler' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    Rotina Diária do Agente de Busca (São Paulo)
                  </h2>
                  <p className="text-xs text-slate-400">
                    O agente roda todo dia às 08:00 AM (Horário de Brasília) pesquisando posições de Data Analytics
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={downloadIpynbNotebook}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar .ipynb</span>
                  </button>
                  <button
                    onClick={() => setIsSchedulerModalOpen(true)}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                  >
                    <span>Configurar Cron / GitHub Actions</span>
                  </button>
                </div>
              </div>

              {/* Schedule Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-cyan-400 uppercase font-mono font-bold">1. Gatilho Matinal</span>
                  <div className="text-base font-bold text-white">08:00 AM BRT (Seg - Sex)</div>
                  <p className="text-xs text-slate-400">
                    Dispara a busca no início do expediente, quando a maioria das empresas paulistas publica novas vagas.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold">2. Fontes Analisadas</span>
                  <div className="text-base font-bold text-white">LinkedIn + Gupy + ATS SP</div>
                  <p className="text-xs text-slate-400">
                    Foco nas principais contratantes de São Paulo (Nubank, Itaú, iFood, Mercado Livre, Stone, QuintoAndar).
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-purple-400 uppercase font-mono font-bold">3. Sincronização Notion</span>
                  <div className="text-base font-bold text-white">Job Application Tracker</div>
                  <p className="text-xs text-slate-400">
                    Ao clicar em aplicar, a vaga é transferida com dados completos para sua tabela pessoal no Notion.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick action to open scheduler modal */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
              <h3 className="font-bold text-white">Pronto para rodar na nuvem ou no seu terminal?</h3>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Você pode executar este agente localmente pelo arquivo <code className="text-amber-400">.ipynb</code>, via linha de comando com <code className="text-emerald-400">agent.py</code>, ou configurá-lo no GitHub Actions para rodar 100% de graça na nuvem.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsSchedulerModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
                >
                  Abrir Detalhes do Agendador &amp; Logs
                </button>
                <button
                  onClick={downloadIpynbNotebook}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
                >
                  Baixar Notebook (.ipynb) Completo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ApplyModal
        job={selectedApplyJob}
        isOpen={Boolean(selectedApplyJob)}
        onClose={() => setSelectedApplyJob(null)}
        onConfirmApply={handleConfirmApply}
        notionConfig={notionConfig}
      />

      <NotionSetupModal
        isOpen={isNotionModalOpen}
        onClose={() => setIsNotionModalOpen(false)}
        notionConfig={notionConfig}
        onSaveConfig={(newConfig) => {
          setNotionConfig(newConfig);
          showToast(`Configuração do Notion salva com sucesso!`);
        }}
      />

      <DailySchedulerModal
        isOpen={isSchedulerModalOpen}
        onClose={() => setIsSchedulerModalOpen(false)}
        onTriggerDailyScan={handleTriggerDailyScan}
        isScanning={isScanning}
      />

      <AiMatchModal
        job={selectedAiJob}
        isOpen={Boolean(selectedAiJob)}
        onClose={() => setSelectedAiJob(null)}
        onApplyFromHere={(job) => {
          setSelectedApplyJob(job);
        }}
      />
    </div>
  );
}
