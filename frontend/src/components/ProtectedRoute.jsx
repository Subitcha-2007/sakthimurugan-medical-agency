import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert, Clock, XCircle } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [], requireApproval = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-medical-600 mb-4" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Verifying session clearance...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-lg">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Access Restricted</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Your account role (<span className="font-semibold uppercase">{user.role}</span>) does not have operational permissions to access this control portal.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-5 py-2.5 bg-medical-600 hover:bg-medical-700 text-white text-sm font-semibold rounded-xl"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Check client approval status
  if (requireApproval && user.role === 'client') {
    if (user.accountStatus === 'pending') {
      return (
        <div className="max-w-xl mx-auto my-16 p-8 bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-amber-800 text-center shadow-xl">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Account Approval In Progress</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            "Your business account is awaiting admin approval." Our pharmaceutical compliance team at Erode is actively reviewing your submitted Drug License & GST credentials.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-left text-xs text-slate-600 dark:text-slate-400 space-y-1.5 mb-6 border border-slate-200 dark:border-slate-700">
            <p><span className="font-semibold text-slate-800 dark:text-slate-200">Registered Business:</span> {user.businessDetails?.shopName}</p>
            <p><span className="font-semibold text-slate-800 dark:text-slate-200">License Number:</span> {user.businessDetails?.drugLicenseNumber || 'Under Review'}</p>
            <p><span className="font-semibold text-slate-800 dark:text-slate-200">Desk Helpline:</span> 9994446994 / 9865730150</p>
          </div>
          <p className="text-xs text-slate-400 mb-6">You will be automatically cleared to place wholesale orders immediately upon verification.</p>
        </div>
      );
    }

    if (user.accountStatus === 'rejected') {
      return (
        <div className="max-w-xl mx-auto my-16 p-8 bg-white dark:bg-slate-800 rounded-2xl border border-rose-200 dark:border-rose-800 text-center shadow-xl">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Application Not Approved</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            "Your business account application was not approved."
          </p>
          {user.rejectionReason && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-xl text-xs text-left mb-6 border border-rose-200 dark:border-rose-800 font-medium">
              <strong>Admin Compliance Note:</strong> {user.rejectionReason}
            </div>
          )}
          <p className="text-xs text-slate-500 mb-6">
            Please contact Sakthimurugan Medical Agency support at <strong>9994446994</strong> or <strong>9865730150</strong> with your renewed drug license documentation.
          </p>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
