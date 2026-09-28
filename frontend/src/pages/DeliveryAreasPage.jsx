import React, { useState, useEffect } from 'react';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Building2,
  Clock,
  PhoneCall,
  Search,
  Loader2,
  Navigation,
} from 'lucide-react';
import api from '../api/axios';
import PincodeCheckerModal from '../components/PincodeCheckerModal';

const DeliveryAreasPage = () => {
  const [areas, setAreas] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [selectedArea, setSelectedArea] = useState('all');
  const [searchPincode, setSearchPincode] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        setLoading(true);
        const [areaRes, pinRes] = await Promise.all([
          api.get('/delivery-areas'),
          api.get('/pincodes'),
        ]);

        if (areaRes.data.success) {
          setAreas(areaRes.data.areas || []);
        }
        if (pinRes.data.success) {
          setPincodes(pinRes.data.pincodes || []);
        }
      } catch (err) {
        console.error('Error fetching delivery areas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryData();
  }, []);

  const filteredPincodes = pincodes.filter((pin) => {
    const matchesArea = selectedArea === 'all' || pin.deliveryArea?._id === selectedArea || pin.district.toLowerCase() === selectedArea.toLowerCase();
    const matchesSearch = !searchPincode.trim() ||
      pin.pincode.includes(searchPincode.trim()) ||
      pin.areaName.toLowerCase().includes(searchPincode.toLowerCase()) ||
      pin.district.toLowerCase().includes(searchPincode.toLowerCase());
    return matchesArea && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-medical-900 via-medical-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Regional Cold Chain & Van Logistics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Proposed Service Regions & Serviced PIN Codes
          </h1>
          <p className="text-sm text-slate-200 leading-relaxed">
            Sakthimurugan Medical Agency runs daily dedicated wholesale replenishment circuits across 4 prime medical districts in Western Tamil Nadu: <strong>Erode (Headquarters), Karur, Namakkal, and Salem</strong>.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition"
            >
              <MapPin className="w-4 h-4" />
              <span>Instant PIN Code Serviceability Check</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Regional Hubs Overview */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-medical-600 dark:text-medical-400">
            Regional Coverage
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Active Distribution Hubs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area) => (
            <div
              key={area._id}
              className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold rounded-md">
                    Active Circuit
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{area.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{area.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 space-y-2 text-xs">
                <p className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  <span className="truncate">{area.hubAddress || 'Regional Hub'}</span>
                </p>
                <p className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{area.estimatedDeliveryTime}</span>
                </p>
                <p className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                  <PhoneCall className="w-3.5 h-3.5 text-medical-600 flex-shrink-0" />
                  <span>Help: {area.contactPhone}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PIN Code Search & Directory Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Serviced Wholesale PIN Codes Directory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified delivery postal codes across Western Tamil Nadu
            </p>
          </div>

          {/* Search inside pincodes */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <input
                type="text"
                placeholder="Search PIN code or town..."
                value={searchPincode}
                onChange={(e) => setSearchPincode(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-medical-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-white outline-none"
            >
              <option value="all">All Districts</option>
              <option value="Erode">Erode</option>
              <option value="Karur">Karur</option>
              <option value="Namakkal">Namakkal</option>
              <option value="Salem">Salem</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-12 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-medical-600 mx-auto mb-2" />
            <p className="text-xs">Loading pincodes...</p>
          </div>
        ) : filteredPincodes.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No matching PIN codes found for current query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase text-[10px] font-extrabold">
                  <th className="py-3 px-3">PIN Code</th>
                  <th className="py-3 px-3">Locality / Medical Cluster</th>
                  <th className="py-3 px-3">District</th>
                  <th className="py-3 px-3">Servicing Hub</th>
                  <th className="py-3 px-3">Estimated Dispatch</th>
                  <th className="py-3 px-3 text-right">Route Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPincodes.map((pin) => (
                  <tr key={pin._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white text-sm">
                      {pin.pincode}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {pin.areaName}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {pin.district}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {pin.deliveryAreaName || pin.deliveryArea?.name || 'Central Hub'}
                    </td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                      {pin.estimatedDeliveryDays === 1 ? 'Same Day (Within 24h)' : `${pin.estimatedDeliveryDays} Days Express`}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold rounded-full">
                        Active ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      <PincodeCheckerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
};

export default DeliveryAreasPage;
