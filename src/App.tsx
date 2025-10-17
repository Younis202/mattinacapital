import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FileUpload } from './components/FileUpload';
import { LeadsTable } from './components/LeadsTable';
import { useLeadsStore } from './store/useLeadsStore';

function App() {
  const theme = useLeadsStore(state => state.theme);
  const leads = useLeadsStore(state => state.leads);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />

        {leads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <FileUpload />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 text-center"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Welcome to Mattina Capital leads
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                Upload your Excel or CSV file containing lead information to get started.
                We support Phone Number Combined, Executive First Name, Address, and Company Name columns.
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <Dashboard />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Lead Management
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Click on status badges to change disposition, edit leads inline, or export your data
                </p>
              </div>

              <LeadsTable />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Add More Leads
                </h3>
                <FileUpload />
              </div>
            </motion.div>
          </motion.div>
        )}

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm"
        >
          <p>Mattina Capital - Professional Lead Management</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
