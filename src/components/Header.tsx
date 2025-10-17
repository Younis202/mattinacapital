import { Sun, Moon, Download, Search, Filter, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLeadsStore } from '../store/useLeadsStore';
import * as XLSX from 'xlsx';

export const Header = () => {
  const { theme, toggleTheme, searchQuery, setSearchQuery, selectedDisposition, setSelectedDisposition, leads, clearAllLeads } = useLeadsStore();

  const handleExport = () => {
    const exportData = leads.map(lead => ({
      'Executive First Name': lead.executive_first_name,
      'Company Name': lead.company_name,
      'Phone Number Combined': lead.phone_number,
      'Address': lead.address,
      'Disposition': lead.disposition,
      'Notes': lead.notes,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, `leads-export-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all leads? This action cannot be undone.')) {
      clearAllLeads();
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Mattina Capital
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Mattina Capital lead management</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <select
              value={selectedDisposition}
              onChange={(e) => setSelectedDisposition(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white appearance-none cursor-pointer transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="interested">Interested</option>
              <option value="not_interested">Not Interested</option>
              <option value="unavailable">Unavailable</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            disabled={leads.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-5 w-5" />
            Export
          </button>

          <button
            onClick={handleClearAll}
            disabled={leads.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-5 w-5" />
            Clear All
          </button>

          <button
            onClick={toggleTheme}
            className="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
};
