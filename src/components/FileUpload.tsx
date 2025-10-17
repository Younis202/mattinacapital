import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { Lead } from '../lib/supabase';
import { useLeadsStore } from '../store/useLeadsStore';

const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.toString().replace(/\D/g, '');
  if (cleaned.length === 10) return `+1${cleaned}`;
  if (cleaned.length === 11 && cleaned.startsWith('1')) return `+${cleaned}`;
  return `+1${cleaned}`;
};

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const addLeads = useLeadsStore(state => state.addLeads);

  const processFile = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      let jsonData: any[] = [];

      if (fileExtension === 'csv') {
        const text = await file.text();
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        jsonData = result.data;
      } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        jsonData = XLSX.utils.sheet_to_json(worksheet);
      }

      const now = new Date().toISOString();
      const leadsToAdd: Lead[] = jsonData.map((row: any) => ({
        id: generateId(),
        phone_number: formatPhoneNumber(row['Phone Number Combined'] || row['phone_number'] || ''),
        executive_first_name: row['Executive First Name'] || row['executive_first_name'] || '',
        address: row['Address'] || row['address'] || '',
        company_name: row['Company Name'] || row['company_name'] || '',
        disposition: 'pending' as const,
        notes: '',
        created_at: now,
        updated_at: now,
      }));

      addLeads(leadsToAdd);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please check the format.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
        isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileInput}
        disabled={isUploading}
      />

      <label htmlFor="file-upload" className="cursor-pointer">
        <motion.div
          animate={{ scale: isDragging ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Processing...</p>
            </div>
          ) : (
            <>
              <FileSpreadsheet className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
              <div className="flex items-center justify-center gap-2 mb-2">
                <Upload className="h-5 w-5 text-blue-500" />
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Drop your Excel or CSV file here
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                or click to browse
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Supports: Phone Number Combined, Executive First Name, Address, Company Name
              </p>
            </>
          )}
        </motion.div>
      </label>
    </motion.div>
  );
};
