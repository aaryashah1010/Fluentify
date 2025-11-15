// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Plus, Trophy, Calendar, Users, Edit, Trash2, Eye, ArrowLeft } from 'lucide-react';
// import { useAdminContests, useDeleteContest } from '../../../../hooks/useContest';
// import { Button } from '../../../../components';

// const ContestListPage = () => {
//   const navigate = useNavigate();
//   const { data: contests = [], isLoading } = useAdminContests();
//   const deleteContest = useDeleteContest();
//   const [deleteConfirm, setDeleteConfirm] = useState(null);

//   const getStatusBadge = (status) => {
//     const badges = {
//       DRAFT: 'bg-gray-100 text-gray-700',
//       PUBLISHED: 'bg-blue-100 text-blue-700',
//       ACTIVE: 'bg-green-100 text-green-700',
//       ENDED: 'bg-red-100 text-red-700',
//     };
//     return badges[status] || badges.DRAFT;
//   };

//   const handleDelete = async (contestId) => {
//     try {
//       await deleteContest.mutateAsync(contestId);
//       setDeleteConfirm(null);
//     } catch (error) {
//       console.error('Failed to delete contest:', error);
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleString('en-IN', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//         timeZone: 'Asia/Kolkata',
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-yellow-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => navigate('/admin-dashboard')}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5 text-gray-600" />
//               </button>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Contest Management</h1>
//                 <p className="text-sm text-gray-600 mt-1">Create and manage weekly contests</p>
//               </div>
//             </div>
//             <Button
//               onClick={() => navigate('/admin/contests/new')}
//               icon={<Plus className="w-4 h-4" />}
//             >
//               Create Contest
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         {isLoading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
//                 <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//               </div>
//             ))}
//           </div>
//         ) : contests.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-lg shadow-sm">
//             <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No Contests Yet</h3>
//             <p className="text-gray-600 mb-6">Create your first contest to get started</p>
//             <Button
//               onClick={() => navigate('/admin/contests/new')}
//               icon={<Plus className="w-4 h-4" />}
//             >
//               Create Your First Contest
//             </Button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {contests.map((contest) => (
//               <div
//                 key={contest.id}
//                 className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
//               >
//                 {/* Contest Header */}
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       {contest.title}
//                     </h3>
//                     <span
//                       className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusBadge(
//                         contest.status
//                       )}`}
//                     >
//                       {contest.status}
//                     </span>
//                   </div>
//                   <Trophy className="w-6 h-6 text-orange-500" />
//                 </div>

//                 {/* Contest Details */}
//                 <div className="space-y-2 mb-4 text-sm text-gray-600">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="w-4 h-4" />
//                     <span>Start: {formatDate(contest.start_time)}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Calendar className="w-4 h-4" />
//                     <span>End: {formatDate(contest.end_time)}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Users className="w-4 h-4" />
//                     <span>{contest.participant_count || 0} participants</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Trophy className="w-4 h-4" />
//                     <span>{contest.question_count || 0} questions</span>
//                   </div>
//                 </div>

//                 {/* Description */}
//                 {contest.description && (
//                   <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                     {contest.description}
//                   </p>
//                 )}

//                 {/* Actions */}
//                 <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
//                   <button
//                     onClick={() => navigate(`/admin/contests/${contest.id}`)}
//                     className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                   >
//                     <Eye className="w-4 h-4" />
//                     View
//                   </button>
//                   <button
//                     onClick={() => navigate(`/admin/contests/${contest.id}/edit`)}
//                     className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
//                   >
//                     <Edit className="w-4 h-4" />
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => setDeleteConfirm(contest.id)}
//                     className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Delete Confirmation Modal */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Contest?</h3>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this contest? This action cannot be undone.
//             </p>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setDeleteConfirm(null)}
//                 className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDelete(deleteConfirm)}
//                 disabled={deleteContest.isPending}
//                 className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
//               >
//                 {deleteContest.isPending ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContestListPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trophy,
  Calendar,
  Users,
  Edit,
  Trash2,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { useAdminContests, useDeleteContest } from '../../../../hooks/useContest';
import { Button } from '../../../../components';

const ContestListPage = () => {
  const navigate = useNavigate();
  const { data: contests = [], isLoading } = useAdminContests();
  const deleteContest = useDeleteContest();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const getStatusBadge = (status) => {
    const badges = {
      DRAFT: 'bg-gray-100 text-gray-700',
      PUBLISHED: 'bg-blue-100 text-blue-700',
      ACTIVE: 'bg-green-100 text-green-700',
      ENDED: 'bg-red-100 text-red-700',
    };
    return badges[status] || badges.DRAFT;
  };

  const handleDelete = async (contestId) => {
    try {
      await deleteContest.mutateAsync(contestId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete contest:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Back + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="p-2 rounded-xl bg-gradient-to-br from-orange-100 to-teal-100 hover:shadow transition"
            >
              <ArrowLeft className="w-5 h-5 text-teal-700" />
            </button>

            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-teal-600 text-transparent bg-clip-text">
                Contest Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Create, publish and track contests
              </p>
            </div>
          </div>

          {/* Create Button */}
          <Button
            onClick={() => navigate('/admin/contests/new')}
            icon={<Plus className="w-4 h-4 text-white" />}
            className="bg-gradient-to-r from-orange-500 to-teal-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-5 py-2"
          >
            Create Contest
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/70 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 animate-pulse shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : contests.length === 0 ? (

          /* Empty State */
          <div className="text-center py-16 bg-gradient-to-br from-orange-50 via-white to-teal-50 border border-orange-100 rounded-3xl shadow-lg">
  <Trophy className="w-16 h-16 text-teal-500 mx-auto mb-4" />

  <h3 className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent mb-2">
    No Contests Yet
  </h3>

  <p className="text-slate-600 mb-6">
    Create your first contest to begin
  </p>

  <Button
    onClick={() => navigate('/admin/contests/new')}
    icon={<Plus className="w-4 h-4 text-white" />}
    className="bg-gradient-to-r from-orange-500 to-teal-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
  >
    Create Your First Contest
  </Button>
</div>


        ) : (

          /* Contests Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {contests.map((contest) => (
              <div
                key={contest.id}
                className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition p-6"
              >

                {/* Contest Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {contest.title}
                    </h3>

                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-lg ${getStatusBadge(
                        contest.status
                      )}`}
                    >
                      {contest.status}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-teal-500 flex items-center justify-center shadow">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Contest Details */}
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>Start: {formatDate(contest.start_time)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>End: {formatDate(contest.end_time)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span>{contest.participant_count || 0} participants</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-teal-600" />
                    <span>{contest.question_count || 0} questions</span>
                  </div>
                </div>

                {/* Description */}
                {contest.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {contest.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/admin/contests/${contest.id}`)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>

                  <button
                    onClick={() => navigate(`/admin/contests/${contest.id}/edit`)}
                    className="flex-1 bg-teal-100 hover:bg-teal-200 text-teal-700 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>

                  <button
                    onClick={() => setDeleteConfirm(contest.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Contest?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Are you sure you want to delete?
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium transition"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteContest.isPending}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {deleteContest.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ContestListPage;
