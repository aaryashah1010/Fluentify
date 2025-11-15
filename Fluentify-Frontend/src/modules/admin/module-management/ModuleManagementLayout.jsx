// import React from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import { LanguageListPage, CourseListPage, CourseEditorPage } from './index';
// import { ArrowLeft } from 'lucide-react';

// const ModuleManagementLayout = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate('/admin-dashboard')}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5 text-gray-600" />
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Module Management</h1>
//               <p className="text-sm text-gray-600">Create and manage language courses</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         <Routes>
//           <Route index element={<LanguageListPage />} />
//           <Route path=":language" element={<CourseListPage />} />
//           {/* Course Editor routes */}
//           <Route path="course/new" element={<CourseEditorPage />} />
//           <Route path="course/edit/:courseId" element={<CourseEditorPage />} />
//           <Route path="course/view/:courseId" element={<CourseEditorPage />} />
//           <Route path="*" element={<Navigate to="/admin/modules" replace />} />
//         </Routes>
//       </main>
//     </div>
//   );
// };

// export default ModuleManagementLayout;


import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LanguageListPage, CourseListPage, CourseEditorPage } from './index';
import { ArrowLeft } from 'lucide-react';

const ModuleManagementLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md border-b border-orange-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="p-2 rounded-xl bg-gradient-to-br from-orange-100 to-teal-100 hover:from-orange-200 hover:to-teal-200 shadow-sm transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-teal-700" />
            </button>

            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
                Module Management
              </h1>
              <p className="text-sm text-gray-600 ml-1">
                Create and manage language courses
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl shadow-md p-6">
          <Routes>
            <Route index element={<LanguageListPage />} />
            <Route path=":language" element={<CourseListPage />} />

            {/* Course Editor routes */}
            <Route path="course/new" element={<CourseEditorPage />} />
            <Route path="course/edit/:courseId" element={<CourseEditorPage />} />
            <Route path="course/view/:courseId" element={<CourseEditorPage />} />

            <Route path="*" element={<Navigate to="/admin/modules" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default ModuleManagementLayout;
