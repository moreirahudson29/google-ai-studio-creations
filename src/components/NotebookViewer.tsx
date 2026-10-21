import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  Play, 
  FileCode2, 
  Terminal, 
  Sparkles, 
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { NOTEBOOK_CELLS } from '../data/notebookContent';
import { 
  downloadIpynbNotebook, 
  downloadPythonScript, 
  downloadWorkflowYml, 
  downloadEnvTemplate 
} from '../utils/downloadHelpers';

export const NotebookViewer: React.FC = () => {
  const [copiedCellId, setCopiedCellId] = useState<string | null>(null);
  const [executedCells, setExecutedCells] = useState<Record<string, boolean>>({
    'cell-2': true,
    'cell-3': true,
    'cell-4': true,
    'cell-5': true,
    'cell-6': true,
    'cell-7': true,
  });
  const [activeTab, setActiveTab] = useState<'cells' | 'quickstart' | 'raw'>('cells');

  const copyCellCode = (id: string, code: string[]) => {
    navigator.clipboard.writeText(code.join(''));
    setCopiedCellId(id);
    setTimeout(() => setCopiedCellId(null), 2000);
  };

  const handleExecuteCell = (id: string) => {
    setExecutedCells(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Download Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5" />
                job_application_tracker_agent.ipynb
              </span>
              <span className="text-xs text-slate-400">Jupyter Notebook v4 (nbformat 4.5)</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Downloadable Jupyter Notebook &amp; Autonomous Agent
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Complete, end-to-end Python agent that queries São Paulo Data Analytics openings daily, filters out duplicate roles, provides interactive review widgets, and automatically inserts applied positions directly into your Notion <strong>"Job Application Tracker"</strong> database.
            </p>
          </div>

          {/* Action Download Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={downloadIpynbNotebook}
              className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] border border-amber-300/40"
            >
              <Download className="w-5 h-5" />
              <span>Download .ipynb Notebook</span>
            </button>

            <button
              onClick={downloadPythonScript}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-3.5 rounded-xl text-xs border border-slate-700 shadow-md transition-colors"
              title="Download standalone agent.py script"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>agent.py</span>
            </button>

            <button
              onClick={downloadWorkflowYml}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-3.5 rounded-xl text-xs border border-slate-700 shadow-md transition-colors"
              title="Download GitHub Actions workflow for daily 08:00 AM cloud run"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>cron.yml</span>
            </button>
          </div>
        </div>

        {/* Quick Tabs inside Viewer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-4 text-xs">
          <button
            onClick={() => setActiveTab('cells')}
            className={`font-semibold pb-1 transition-colors border-b-2 ${
              activeTab === 'cells'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Notebook Cells ({NOTEBOOK_CELLS.length})
          </button>
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`font-semibold pb-1 transition-colors border-b-2 ${
              activeTab === 'quickstart'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Google Colab &amp; VS Code Guide
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`font-semibold pb-1 transition-colors border-b-2 ${
              activeTab === 'raw'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Notion Schema Checklist
          </button>
        </div>
      </div>

      {/* Guide Tab */}
      {activeTab === 'quickstart' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm">
          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/60 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold font-mono">
              1
            </div>
            <h4 className="font-bold text-white">Google Colab (Recommended)</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              1. Download the <code className="text-amber-400 font-mono">.ipynb</code> file above.<br/>
              2. Go to <a href="https://colab.research.google.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-0.5">colab.research.google.com <ExternalLink className="w-3 h-3"/></a>.<br/>
              3. Click <strong>Upload</strong> and drag the notebook.<br/>
              4. Run cells sequentially with Shift+Enter.
            </p>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/60 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono">
              2
            </div>
            <h4 className="font-bold text-white">VS Code or Cursor</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              1. Open VS Code in any directory.<br/>
              2. Place the <code className="text-amber-400 font-mono">job_application_tracker_agent.ipynb</code> in your folder.<br/>
              3. Install the <strong>Jupyter</strong> extension.<br/>
              4. Select your Python 3 kernel and click <strong>Run All</strong>.
            </p>
          </div>

          <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/60 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono">
              3
            </div>
            <h4 className="font-bold text-white">Notion Setup (2 minutes)</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              1. Create database <strong>Job Application Tracker</strong>.<br/>
              2. Add columns: <em>Job Title</em>, <em>Company</em>, <em>Status</em>, <em>Date Applied</em>, <em>Location</em>, <em>Job URL</em>, <em>Notes</em>.<br/>
              3. Connect to your Internal Integration Token.<br/>
              4. Paste credentials in Cell 3 of the notebook.
            </p>
          </div>
        </div>
      )}

      {/* Notion Schema Tab */}
      {activeTab === 'raw' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Required Notion Database Properties for Automatic Sync
            </h3>
            <button
              onClick={downloadEnvTemplate}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              Download .env template
            </button>
          </div>
          <p className="text-xs text-slate-300">
            The Python agent directly uses the official Notion REST API (<code className="text-cyan-400">POST https://api.notion.com/v1/pages</code>).
            Ensure your database matches these names so property mapping executes without errors:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Property Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Example Value</th>
                  <th className="py-2.5 px-3">Agent Behavior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">Job Title</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">Title</td>
                  <td className="py-2.5 px-3">Senior Data Analyst - Growth</td>
                  <td className="py-2.5 px-3 text-slate-400">Auto-extracted from job title</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">Company</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">Text</td>
                  <td className="py-2.5 px-3">Nubank, Itaú, iFood</td>
                  <td className="py-2.5 px-3 text-slate-400">Auto-extracted from employer</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">Status</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">Select</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300">Applied</span></td>
                  <td className="py-2.5 px-3 text-slate-400">Set automatically to 'Applied'</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">Date Applied</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">Date</td>
                  <td className="py-2.5 px-3">2026-10-21</td>
                  <td className="py-2.5 px-3 text-slate-400">Auto-filled with today's date</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">Location</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">Text</td>
                  <td className="py-2.5 px-3">São Paulo, SP (Pinheiros)</td>
                  <td className="py-2.5 px-3 text-slate-400">São Paulo neighborhood & modality</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">Job URL</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">URL</td>
                  <td className="py-2.5 px-3 text-cyan-400 truncate max-w-xs">https://gupy.io/job/...</td>
                  <td className="py-2.5 px-3 text-slate-400">Direct apply link</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">Salary</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">Text</td>
                  <td className="py-2.5 px-3">R$ 14.000 - R$ 18.000 / mês</td>
                  <td className="py-2.5 px-3 text-slate-400">Extracted salary range</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">Notes</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">Text</td>
                  <td className="py-2.5 px-3">Referred by Carlos, CV v2</td>
                  <td className="py-2.5 px-3 text-slate-400">Your custom review note input</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cells List */}
      {activeTab === 'cells' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>Interactive Cell-by-Cell Notebook Code Viewer</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Jupyter, Colab &amp; VS Code
            </span>
          </div>

          {NOTEBOOK_CELLS.map((cell, idx) => (
            <div
              key={cell.id}
              className={`rounded-xl border transition-all ${
                cell.cell_type === 'code'
                  ? 'bg-slate-950 border-slate-800 shadow-md'
                  : 'bg-slate-900/90 border-slate-800/80'
              }`}
            >
              {/* Cell Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/70 bg-slate-900/50 rounded-t-xl text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                    cell.cell_type === 'code'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                      : 'bg-blue-950/80 text-blue-400 border border-blue-800/50'
                  }`}>
                    {cell.cell_type === 'code' ? `In [${cell.execution_count ?? idx}]` : 'Markdown'}
                  </span>
                  <span className="font-semibold text-slate-200">
                    {cell.title || `Cell ${idx + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {cell.explanation && (
                    <span className="text-[11px] text-slate-400 hidden md:inline max-w-sm truncate">
                      {cell.explanation}
                    </span>
                  )}
                  
                  {cell.cell_type === 'code' && (
                    <button
                      onClick={() => handleExecuteCell(cell.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium"
                      title="Simulate Cell Execution"
                    >
                      <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                      <span>Run</span>
                    </button>
                  )}

                  <button
                    onClick={() => copyCellCode(cell.id, cell.source)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs"
                    title="Copy cell code to clipboard"
                  >
                    {copiedCellId === cell.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Cell Body */}
              <div className="p-4 overflow-x-auto text-xs font-mono">
                {cell.cell_type === 'code' ? (
                  <pre className="text-emerald-300/90 leading-relaxed whitespace-pre font-mono">
                    {cell.source.join('')}
                  </pre>
                ) : (
                  <div className="text-slate-300 font-sans space-y-2 whitespace-pre-wrap leading-relaxed text-sm">
                    {cell.source.join('')}
                  </div>
                )}
              </div>

              {/* Simulated Output for Code Cells */}
              {cell.cell_type === 'code' && executedCells[cell.id] && (
                <div className="border-t border-slate-800 bg-slate-900/70 p-3 rounded-b-xl text-xs font-mono">
                  <div className="text-[10px] text-slate-500 font-semibold mb-1 uppercase tracking-wider">
                    Cell Output:
                  </div>
                  {cell.id === 'cell-2' && (
                    <div className="text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Successfully installed requests pandas ipywidgets tabulate python-dateutil
                    </div>
                  )}
                  {cell.id === 'cell-3' && (
                    <div className="text-slate-300 space-y-0.5">
                      <div>🎯 Target Location: São Paulo, Brazil</div>
                      <div>🔍 Search Query: "Data Analytics" OR "Analista de Dados" OR "Analytics Engineer"</div>
                      <div>📁 Local Storage: jobs_tracker_data.json</div>
                    </div>
                  )}
                  {cell.id === 'cell-4' && (
                    <div className="text-slate-300">
                      NotionSyncClient initialized (REST API v2022-06-28)
                    </div>
                  )}
                  {cell.id === 'cell-5' && (
                    <div className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      🎉 Ready to sync with Notion database: 'Job Application Tracker'
                    </div>
                  )}
                  {cell.id === 'cell-6' && (
                    <div className="text-slate-300">
                      JobSearchEngine ready with local deduplication cache.
                    </div>
                  )}
                  {cell.id === 'cell-7' && (
                    <div className="text-slate-300 space-y-1">
                      <div>🚀 Running daily online scan for Data Analytics in São Paulo, Brazil...</div>
                      <div className="text-emerald-400 font-bold">✨ 5 fresh openings discovered today (Nubank, Itaú, iFood, Meli, QuintoAndar)</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
