'use client';

import { useState } from 'react';
import { Play, Loader2, Globe, Database, AlertCircle, Download, CheckCircle } from 'lucide-react';

interface ScrapedData {
  name: string;
  link_or_email: string;
  description: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('Go to news.ycombinator.com, find the top 3 story headlines, and extract their links.');
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState<ScrapedData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTableData(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const resJson = await response.json();

      if (resJson.status === 'success') {
        // If the backend parsed JSON arrays successfully, drop them straight into state
        if (Array.isArray(resJson.data)) {
          setTableData(resJson.data);
        } else {
          setError('Data was retrieved but could not be parsed into clean rows.');
        }
      } else {
        setError(resJson.detail || 'An error occurred inside the agent logic.');
      }
    } catch (err) {
      setError('Could not establish connection to the backend system api gateway.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!tableData) return;
    const headers = ['Name', 'Link/Email', 'Description'];
    const csvRows = [
      headers.join(','),
      ...tableData.map(row => 
        `"${row.name.replace(/"/g, '""')}", "${row.link_or_email.replace(/"/g, '""')}", "${row.description.replace(/"/g, '""')}"`
      )
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'scraped_leads.csv');
    a.click();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        
        {/* Header Dashboard Grid */}
        <header className="mb-10 flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Database className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Enterprise Lead Gen & Web Scraping AI Engine
            </h1>
            <p className="text-xs text-slate-400">Autonomous Real-Time Vision Automation Pipeline</p>
          </div>
        </header>

        <div className="space-y-6">
          {/* User Input Module Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <form onSubmit={handleRunAgent} className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 font-bold rounded-lg text-sm transition-all duration-150 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Agent Orchestrating Browser Core...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Execute Extraction Pipeline
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Real-time Loader Component */}
          {loading && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
              <p className="text-sm font-semibold text-slate-300">Executing browser workflow steps...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {/* High-Grade Corporate Data Table Grid Layout */}
          {tableData && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-slate-850 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <span className="text-sm font-bold flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" /> Pipeline Structured Records Found ({tableData.length})
                </span>
                <button
                  onClick={downloadCSV}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md text-xs transition-all duration-150 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export Clean CSV
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-xs font-semibold tracking-wider uppercase">
                      <th className="px-6 py-3">Entity Title / Name</th>
                      <th className="px-6 py-3">Target Reference Link / Contact</th>
                      <th className="px-6 py-3">Context Summary Extraction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {tableData.map((row, index) => (
                      <tr key={index} className="hover:bg-slate-850/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-200 whitespace-nowrap">{row.name}</td>
                        <td className="px-6 py-4 font-mono text-xs text-cyan-400 max-w-xs truncate">{row.link_or_email}</td>
                        <td className="px-6 py-4 text-slate-400 max-w-md">{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}