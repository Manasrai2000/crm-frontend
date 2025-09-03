import React, { useState, useEffect } from 'react';
import { RefreshCw, Edit, Filter } from 'lucide-react';
import Pagination from './Pagination';

// --- Type Definitions ---
type RowData = {
    TITLE: string;
    VALUE: string | number;
    COLOR?: string;
    IS_CLICK?: boolean;
    CLICK_URL?: string;
    REQUEST_VALUE?: string;
    BTN_TYPE?: string;
    BTN_CLICK_TYPE?: string;
};

type ItemData = {
    ID: number;
    TITLE: string;
    ROW_DATA: RowData[];
};

type ListHeader = { TITLE: string }[];

type DepartmentData = {
    STATUS: string;
    MESSAGE: string;
    TOTAL_COUNT: number;
    DATA: {
        ITEM_DATA: ItemData[];
        LIST_HEADER: ListHeader[];
    };
};

type SubMenu = {
  public_secret: string;
  title: string;
  icon: string;
  actions?: Action[];
};

type Action = {
  public_secret: string;
  name: string;
  description: string;
}

type DataTableProps = {
    submenu: SubMenu;
};

// --- Component ---
const DataTable: React.FC<DataTableProps> = ({ submenu }) => {
    const [data, setData] = useState<DepartmentData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce searchTerm
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const fetchDepartmentData = async (page = 1, query = '') => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token') || '642ed967-ec74-4efd-9993-16aaf1180c1a';
            const response = await fetch(`https://advisor-connect-apis.codebright.in/${submenu.title}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    CBT_REQUEST_DATA: {
                        COMPANY_ID: '',
                        USER_ID: '2',
                        PR_QUERY: query,
                        PR_PAGE_NO: page,
                        PR_TOKEN: token,
                        PR_LIMIT: 20,
                    },
                    CBT_TRACKING_DATA: {
                        PR_LOCATION: '',
                        PR_IP_ADDRESS: '',
                        PR_LAT_LONG: 'asdas',
                        PR_BATTERY: 'rewrw',
                        PR_OS: 'dewrewr',
                        PR_PHONE_BRAND: '',
                        PR_ACTIVITY_TYPE: '',
                        PR_KM: '',
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setData(result as DepartmentData);
        } catch (err) {
            setError('Failed to fetch department data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when submenu, currentPage, or debouncedSearchTerm changes
    useEffect(() => {
        fetchDepartmentData(currentPage, debouncedSearchTerm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submenu, currentPage, debouncedSearchTerm]);

    const handleEdit = (id: string | undefined, url: string | undefined) => {
        alert(`Edit department ID: ${id}\nForm URL: ${url}`);
    };

    const filteredData =
        data?.DATA?.ITEM_DATA?.filter(
            item =>
                item.TITLE.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                item.ROW_DATA.some(row =>
                    row.VALUE?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                )
        ) || [];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="m-0 p-0 w-full">
            <div className="flex justify-between items-center mb-3">
                <input
                    type="text"
                    className="border border-gray-300 rounded px-3 py-2 w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Search ${submenu.title.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded disabled:opacity-50 transition"
                    onClick={() => fetchDepartmentData(currentPage, debouncedSearchTerm)}
                    disabled={loading}
                >
                    <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={16} /> Refresh
                </button>
            </div>
            {loading ? (
                <div className="text-center py-20">
                    <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <p className="mt-4 text-gray-600">Loading {submenu.title.toLowerCase()} data...</p>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-6 rounded text-center">
                    <p className="mb-2">{error}</p>
                    <button
                        className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
                        onClick={() => fetchDepartmentData(currentPage)}
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded shadow">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    {data?.DATA?.LIST_HEADER?.[0]?.map((header, index) => (
                                        <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                                            {header.TITLE}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map(item => (
                                    <tr key={item.ID} className="hover:bg-gray-50">
                                        {item.ROW_DATA.map((cell, idx) => (
                                            <td key={idx} className="px-4 py-2 border-b">
                                                {cell.VALUE === 'BUTTON' ? (
                                                    <button
                                                        className="flex items-center border border-blue-500 text-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-50 transition"
                                                        onClick={() => handleEdit(cell.REQUEST_VALUE, cell.CLICK_URL)}
                                                    >
                                                        <Edit size={14} className="mr-1" /> Edit
                                                    </button>
                                                ) : cell.TITLE === 'Status' ? (
                                                    <span
                                                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                                            cell.VALUE === 'Active'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {cell.VALUE}
                                                    </span>
                                                ) : (
                                                    <span>{cell.VALUE}</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredData.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <Filter size={40} className="mx-auto mb-3" />
                            <h5 className="text-lg font-semibold">No {submenu.title.toLowerCase()} found</h5>
                            <p>
                                {searchTerm
                                    ? 'Try adjusting your search terms.'
                                    : `No ${submenu.title.toLowerCase()} data available.`}
                            </p>
                        </div>
                    )}
                </>
            )}

            {data?.TOTAL_COUNT && (
                <Pagination
                    totalPages={data.TOTAL_COUNT}
                    currentPage={currentPage}
                    onPageChange={page => handlePageChange(page)}
                />
            )}

            <div className="text-center text-gray-400 mt-8">
                <p>{data?.MESSAGE || ''}</p>
                <small>Last updated: {new Date().toLocaleString()}</small>
            </div>
        </div>
    );
};

export default DataTable;