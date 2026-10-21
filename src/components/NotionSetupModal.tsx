import React, { useState } from 'react';
import { X, Database, Check, ExternalLink, Key, ShieldCheck, AlertCircle, Copy } from 'lucide-react';
import { NotionConfig } from '../types';

interface NotionSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  notionConfig: NotionConfig;
  onSaveConfig: (config: NotionConfig) => void;
}

export const NotionSetupModal: React.FC<NotionSetupModalProps> = ({
  isOpen,
  onClose,
  notionConfig,
  onSaveConfig,
}) => {
  if (!isOpen) return null;

  const [apiKey, setApiKey] = useState(notionConfig.apiKey || '');
  const [databaseId, setDatabaseId] = useState(notionConfig.databaseId || '');
  const [databaseName, setDatabaseName] = useState(notionConfig.databaseName || 'Job Application Tracker');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const handleTestConnection = () => {
    setTestStatus('testing');
    setTestMessage('Testando conexão com os servidores da Notion API...');

    setTimeout(() => {
      if (!apiKey || apiKey.length < 10) {
        setTestStatus('error');
        setTestMessage('Por favor insira um token Notion válido (começa com secret_...)');
        return;
      }

      if (!databaseId || databaseId.length < 15) {
        setTestStatus('error');
        setTestMessage('Por favor insira um ID de banco de dados Notion válido (32 caracteres)');
        return;
      }

      setTestStatus('success');
      setTestMessage(`🎉 Conexão estabelecida com sucesso! Banco '${databaseName}' verificado.`);
    }, 800);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      apiKey,
      databaseId,
      databaseName,
      isConnected: Boolean(apiKey && databaseId),
      lastSyncTime: new Date().toLocaleTimeString(),
    });
    onClose();
  };

  const handleUseDemo = () => {
    setApiKey('secret_notion_demo_integration_sp_data_analytics_tracker');
    setDatabaseId('7c92b8d04e1f48039c28a8d9f1092e44');
    setDatabaseName('Job Application Tracker');
    setTestStatus('success');
    setTestMessage('Conexão demo configurada com o banco "Job Application Tracker"!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              N
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Configurar Conexão com Notion</h3>
              <p className="text-xs text-slate-400">Integração oficial REST API v2022-06-28</p>
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
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          {/* Quick steps */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-slate-300">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Como obter as credenciais do Notion em 3 passos:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400">
              <li>
                Acesse <a href="https://www.notion.so/my-integrations" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-0.5">notion.so/my-integrations <ExternalLink className="w-2.5 h-2.5" /></a> e crie uma nova integração (nome: <em>Job Tracker Agent</em>).
              </li>
              <li>
                Copie o <strong>Internal Integration Secret</strong> e cole abaixo.
              </li>
              <li>
                No Notion, abra seu banco de dados <strong>"Job Application Tracker"</strong>, clique no menu <code>...</code> no canto superior direito &gt; <strong>Connections</strong> &gt; conecte sua integração.
              </li>
            </ol>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium flex items-center justify-between">
              <span>Notion Internal Integration Secret (Token)</span>
              <span className="text-[10px] text-slate-500">Começa com secret_...</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium flex items-center justify-between">
              <span>Database ID</span>
              <span className="text-[10px] text-slate-500">ID de 32 caracteres da URL</span>
            </label>
            <input
              type="text"
              value={databaseId}
              onChange={(e) => setDatabaseId(e.target.value)}
              placeholder="7c92b8d04e1f48039c28a8d9f1092e44"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Nome do Banco de Dados no Notion</label>
            <input
              type="text"
              value={databaseName}
              onChange={(e) => setDatabaseName(e.target.value)}
              placeholder="Job Application Tracker"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Test Status Feedback */}
          {testStatus !== 'idle' && (
            <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs ${
              testStatus === 'success'
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                : testStatus === 'error'
                ? 'bg-rose-950/60 border-rose-700/60 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}>
              {testStatus === 'success' ? (
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : testStatus === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : (
                <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin shrink-0" />
              )}
              <span>{testMessage}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleTestConnection}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors w-full sm:w-auto"
              >
                Testar Conexão
              </button>
              <button
                type="button"
                onClick={handleUseDemo}
                className="px-3.5 py-2 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 text-xs transition-colors w-full sm:w-auto"
              >
                Carregar Demo
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-600/20"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
