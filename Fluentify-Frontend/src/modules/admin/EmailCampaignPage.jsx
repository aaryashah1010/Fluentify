import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Download, 
  Send, 
  Users, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  getLearnersForCampaign, 
  triggerEmailCampaign, 
  exportLearnersCSV 
} from '../../api/admin';

const EmailCampaignPage = () => {
  const navigate = useNavigate();
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchLearners();
  }, []);

  const fetchLearners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLearnersForCampaign();
      
      if (response.success) {
        setLearners(response.data.learners || []);
      } else {
        setError('Failed to fetch learners');
      }
    } catch (err) {
      console.error('Error fetching learners:', err);
      setError(err.message || 'Failed to fetch learners');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerCampaign = async () => {
    if (learners.length === 0) {
      setError('No learners available to append to Google Sheet');
      return;
    }

    if (!window.confirm(`Are you sure you want to append ${learners.length} learner(s) to Google Sheet and trigger the N8N workflow?`)) {
      return;
    }

    try {
      setTriggering(true);
      setError(null);
      setSuccess(null);
      
      const response = await triggerEmailCampaign();
      
      if (response.success) {
        const { learnerCount, updatedRows, spreadsheetId } = response.data || {};
        setSuccess(
          `✅ Successfully appended ${learnerCount || learners.length} learners to Google Sheet! ` +
          `${updatedRows ? `(${updatedRows} rows updated)` : ''} N8N workflow triggered.`
        );
      } else {
        setError(response.message || 'Failed to append learners to Google Sheet');
      }
    } catch (err) {
      console.error('Error triggering campaign:', err);
      setError(err.message || 'Failed to append learners to Google Sheet');
    } finally {
      setTriggering(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      setError(null);
      
      const blob = await exportLearnersCSV();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learners-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess('Learners exported successfully!');
    } catch (err) {
      console.error('Error exporting CSV:', err);
      setError(err.message || 'Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 text-slate-50 relative overflow-x-hidden">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-16 right-10 text-7xl opacity-10 animate-bounce" style={{ animationDuration: '3.4s' }}>📚</div>
        <div className="absolute top-40 left-6 text-6xl opacity-10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.6s' }}>🌍</div>
        <div className="absolute bottom-10 left-10 text-6xl opacity-10 animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '0.9s' }}>✨</div>
        <div className="absolute bottom-16 right-16 text-7xl opacity-5 animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '1.1s' }}>✨</div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-lg sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/admin-dashboard')}
                  className="p-2 hover:bg-slate-800/60 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-200" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900/80 border border-white/10">
                      <Mail className="w-5 h-5 text-teal-300" />
                    </span>
                    Email Campaign
                  </h1>
                  <p className="text-sm text-slate-300 mt-1">
                    Append learners who will receive the email campaign
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  disabled={exporting || learners.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-800/80 text-slate-200 rounded-xl border border-white/10 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exporting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-200" />
                  ) : (
                    <Download className="w-4 h-4 text-slate-200" />
                  )}
                  Export CSV
                </button>
                <button
                  onClick={handleTriggerCampaign}
                  disabled={triggering || learners.length === 0}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-orange-500 rounded-xl shadow-lg hover:from-teal-600 hover:to-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {triggering ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full px-4 py-8 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-3xl border border-emerald-400/60 bg-emerald-950/60 p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-100">{success}</p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="text-emerald-200 hover:text-emerald-50"
            >
              ×
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-3xl border border-rose-500/60 bg-rose-950/70 p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-rose-100">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-200 hover:text-rose-50"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900/90 border border-white/10 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <p className="text-sm text-slate-300">Total Learners</p>
              <p className="text-3xl font-bold text-slate-50">{learners.length}</p>
            </div>
          </div>
        </div>

        {/* Learners Table */}
        <div className="rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 bg-slate-900/80">
            <h2 className="text-lg font-semibold text-slate-50">Learner List</h2>
            <p className="text-sm text-slate-300 mt-1">
              All learners who will receive the email campaign
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
            </div>
          ) : learners.length === 0 ? (
            <div className="text-center py-12 text-slate-200">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-sm text-slate-300">No learners found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Joined Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-950/90 divide-y divide-slate-800">
                  {learners.map((learner, index) => (
                    <tr key={index} className="hover:bg-slate-900/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-50">
                          {learner.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">
                          {learner.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {learner.created_at ? new Date(learner.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>


        </main>
      </div>
    </div>
  );
};

export default EmailCampaignPage;
