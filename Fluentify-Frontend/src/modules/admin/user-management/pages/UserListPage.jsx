import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getLearners } from '../../../../api/admin';
import UserTable from '../components/UserTable';

const useDebounced = (value, delay) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const UserListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ items: [], total: 0 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const page = useMemo(() => parseInt(searchParams.get('page') || '1', 10), [searchParams]);
  const pageSize = 20;
  const debounced = useDebounced(search, 400);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resp = await getLearners({ search: debounced, page, limit: pageSize });
      setData({ items: resp.data || resp.items || [], total: resp.total || resp.data?.total || resp.meta?.total || 0 });
    } catch (e) {
      console.error(e);
      setData({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [debounced, page]);

  const onPageChange = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    if (debounced) next.set('search', debounced); else next.delete('search');
    setSearchParams(next);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-600">Manage learners and view their progress</p>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      <UserTable
        learners={data.items}
        total={data.total}
        loading={loading}
        page={page}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onRowClick={(u) => navigate(`/admin/users/${u.id}`)}
      />
    </div>
  );
};

export default UserListPage;


