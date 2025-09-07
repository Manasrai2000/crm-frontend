import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, Edit, Filter, Search, ChevronUp, ChevronDown, Delete } from 'lucide-react';
import axios from 'axios';
import Pagination from './Pagination';
import ActionPill from './ActionPill';
import AddModuleForm from '../addmodulesform';

// --- Type Definitions ---
type ModuleData = {
  public_secret: string;
  module_code: string;
  name: string;
  description: string;
  is_active: boolean;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: ModuleData[];
  count: number;
};

type DataTableProps = {
  endpoint: string;
  title: string;
  itemsPerPage?: number;
};

// --- DataTable Component ---
const DataTable: React.FC<DataTableProps> = ({
  endpoint,
  title,
  itemsPerPage = 10
}) => {
  const [data, setData] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false)
  const [editModule, setEditModule] = useState<ModuleData | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ModuleData;
    direction: 'asc' | 'desc'
  } | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('access') || '' : '';

      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      // Add pagination parameters to the API call
      const response = await axios.get<ApiResponse>(
        `${endpoint}?page=${page}&page_size=${itemsPerPage}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setData(response.data.data);
        setTotalCount(response.data.count);
      } else {
        setError(response.data.message || 'Failed to fetch data');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'API Error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [endpoint, itemsPerPage]);

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  const handleSort = (key: keyof ModuleData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return sortedData;

    const term = searchTerm.toLowerCase();
    return sortedData.filter(item =>
      item.module_code.toLowerCase().includes(term) ||
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
  }, [sortedData, searchTerm]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderSortIcon = (key: keyof ModuleData) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronUp size={16} className="opacity-30" />;
    }
    return sortConfig.direction === 'asc' ?
      <ChevronUp size={16} className="text-blue-600" /> :
      <ChevronDown size={16} className="text-blue-600" />;
  };

  return (
    <div className="bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <ActionPill
          loading={loading}
          onRefresh={() => fetchData(currentPage)}
          onAdd={() => setOpen(true)}
          onFilter={() => console.log("filter clicked")}
          onSearch={(e) => setSearchTerm(e)}
        />
      </div>
      <AddModuleForm
        mode={editModule ? 'edit' : 'add'}
        open={open}
        onClose={() => {
          setOpen(false);
          setEditModule(null);
        }}
        initialData={editModule ?? undefined}
        onSuccess={() => {
          setOpen(false);
          setEditModule(null);
          fetchData(currentPage);
        }}
      />
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
          <p className="text-red-700 mb-2">{error}</p>
          <button
            onClick={() => fetchData(currentPage)}
            className="text-red-600 border border-red-600 rounded-md px-4 py-1 hover:bg-red-600 hover:text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('module_code')}
                  >
                    <div className="flex items-center gap-1">
                      Code
                      {renderSortIcon('module_code')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {renderSortIcon('name')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('description')}
                  >
                    <div className="flex items-center gap-1">
                      Description
                      {renderSortIcon('description')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('is_active')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {renderSortIcon('is_active')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.public_secret} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.module_code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          onClick={() => {
                            setEditModule(item);
                            setOpen(true);
                          }}
                        >
                          <Edit size={16} className="inline mr-1" />
                        </button>
                        <button
                          className="text-red-600 hover:text-blue-900 mr-4"
                          onClick={() => {
                            setEditModule(item);
                            setOpen(true);
                          }}
                        >
                          <Delete size={16} className="inline mr-1" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Filter size={40} className="mb-2 opacity-50" />
                        <p className="text-lg font-medium">No modules found</p>
                        <p className="mt-1">
                          {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'No module data available'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default DataTable;