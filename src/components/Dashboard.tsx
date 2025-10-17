import { motion } from 'framer-motion';
import { Users, Clock, ThumbsUp, ThumbsDown, Phone, Building2 } from 'lucide-react';
import { useLeadsStore } from '../store/useLeadsStore';

export const Dashboard = () => {
  const leads = useLeadsStore(state => state.leads);

  const stats = {
    total: leads.length,
    pending: leads.filter(l => l.disposition === 'pending').length,
    interested: leads.filter(l => l.disposition === 'interested').length,
    notInterested: leads.filter(l => l.disposition === 'not_interested').length,
    unavailable: leads.filter(l => l.disposition === 'unavailable').length,
    corporate: leads.filter(l => l.disposition === 'corporate').length,
  };

  const statCards = [
    { label: 'Total Leads', value: stats.total, icon: Users, color: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-500', gradient: 'from-yellow-500 to-yellow-600' },
    { label: 'Interested', value: stats.interested, icon: ThumbsUp, color: 'bg-green-500', gradient: 'from-green-500 to-green-600' },
    { label: 'Not Interested', value: stats.notInterested, icon: ThumbsDown, color: 'bg-red-500', gradient: 'from-red-500 to-red-600' },
    { label: 'Unavailable', value: stats.unavailable, icon: Phone, color: 'bg-gray-500', gradient: 'from-gray-500 to-gray-600' },
    { label: 'Corporate', value: stats.corporate, icon: Building2, color: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const percentage = stats.total > 0 ? (stat.value / stats.total) * 100 : 0;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}></div>

            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>

              <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  className={`h-full bg-gradient-to-r ${stat.gradient}`}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
