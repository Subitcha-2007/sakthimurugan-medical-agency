import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Pill,
  RotateCcw,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PackageX,
  Building2,
} from 'lucide-react';
import api from '../api/axios';
import MedicineCard from '../components/MedicineCard';

const MedicinesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ manufacturers: [], dosageForms: [] });
  const [loading, setLoading] = useState(true);

  // Filter and Sort states initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [manufacturer, setManufacturer] = useState(searchParams.get('manufacturer') || 'all');
  const [dosageForm, setDosageForm] = useState(searchParams.get('dosageForm') || 'all');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'featured');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Synchronize state whenever URL query params change (e.g. from Navbar search or Category links)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCat = searchParams.get('category') || 'all';
    const urlMfg = searchParams.get('manufacturer') || 'all';
    const urlDosage = searchParams.get('dosageForm') || 'all';
    const urlStock = searchParams.get('inStock') === 'true';
    const urlSort = searchParams.get('sortBy') || 'featured';
    const urlPage = parseInt(searchParams.get('page') || '1', 10);

    setSearch(urlSearch);
    setCategory(urlCat);
    setManufacturer(urlMfg);
    setDosageForm(urlDosage);
    setInStockOnly(urlStock);
    setSortBy(urlSort);
    setCurrentPage(urlPage);
  }, [searchParams]);

  // Fetch Categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Medicines when filters / pagination change
  useEffect(() => {
    let isMounted = true;
    const fetchMedicines = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (search.trim()) params.append('search', search.trim());
        if (category && category !== 'all') params.append('category', category);
        if (manufacturer && manufacturer !== 'all') params.append('manufacturer', manufacturer);
        if (dosageForm && dosageForm !== 'all') params.append('dosageForm', dosageForm);
        if (inStockOnly) params.append('inStockOnly', 'true');
        if (sortBy) params.append('sortBy', sortBy);
        params.append('page', currentPage);
        params.append('limit', '12');

        const res = await api.get(`/medicines?${params.toString()}`);
        if (isMounted && res.data.success) {
          setMedicines(res.data.medicines || []);
          setTotalPages(res.data.totalPages || 1);
          setTotalCount(res.data.total || 0);
          if (res.data.filterOptions) {
            setFilterOptions(res.data.filterOptions);
          }
        }
      } catch (err) {
        if (isMounted) console.error('Error fetching medicines:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMedicines();
    return () => {
      isMounted = false;
    };
  }, [search, category, manufacturer, dosageForm, inStockOnly, sortBy, currentPage]);

  const updateFiltersAndUrl = (updates) => {
    const newSearch = updates.search !== undefined ? updates.search : search;
    const newCategory = updates.category !== undefined ? updates.category : category;
    const newMfg = updates.manufacturer !== undefined ? updates.manufacturer : manufacturer;
    const newDosage = updates.dosageForm !== undefined ? updates.dosageForm : dosageForm;
    const newStock = updates.inStockOnly !== undefined ? updates.inStockOnly : inStockOnly;
    const newSort = updates.sortBy !== undefined ? updates.sortBy : sortBy;
    const newPage = updates.currentPage !== undefined ? updates.currentPage : 1;

    if (updates.search !== undefined) setSearch(newSearch);
    if (updates.category !== undefined) setCategory(newCategory);
    if (updates.manufacturer !== undefined) setManufacturer(newMfg);
    if (updates.dosageForm !== undefined) setDosageForm(newDosage);
    if (updates.inStockOnly !== undefined) setInStockOnly(newStock);
    if (updates.sortBy !== undefined) setSortBy(newSort);
    setCurrentPage(newPage);

    const newParams = {};
    if (newSearch && newSearch.trim()) newParams.search = newSearch.trim();
    if (newCategory && newCategory !== 'all') newParams.category = newCategory;
    if (newMfg && newMfg !== 'all') newParams.manufacturer = newMfg;
    if (newDosage && newDosage !== 'all') newParams.dosageForm = newDosage;
    if (newStock) newParams.inStock = 'true';
    if (newSort && newSort !== 'featured') newParams.sortBy = newSort;
    if (newPage > 1) newParams.page = String(newPage);

    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setManufacturer('all');
    setDosageForm('all');
    setInStockOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-medical-600 dark:text-medical-400">
            Wholesale Pharmaceutical Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Medicine Catalog & Sourcing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Showing <strong className="text-slate-900 dark:text-white">{totalCount}</strong> verified wholesale formulations available for immediate regional dispatch.
          </p>
        </div>

        {/* Search inside catalog */}
        <div className="w-full md:max-w-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateFiltersAndUrl({ search, currentPage: 1 });
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              placeholder="Filter by medicine, active salt, brand..."
              value={search}
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                setCurrentPage(1);
              }}
              onBlur={() => {
                updateFiltersAndUrl({ search, currentPage: 1 });
              }}
              className="w-full pl-10 pr-20 py-2.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-medical-500 outline-none transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  updateFiltersAndUrl({ search: '', currentPage: 1 });
                }}
                className="absolute right-14 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1"
                title="Clear search"
              >
                &times;
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 bg-medical-600 hover:bg-medical-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Filter Sidebar (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-medical-600" />
              <span>Filters</span>
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs text-medical-600 dark:text-medical-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Therapeutic Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-medical-500 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Manufacturers */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Manufacturer / Brand
            </label>
            <select
              value={manufacturer}
              onChange={(e) => {
                setManufacturer(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-medical-500 outline-none"
            >
              <option value="all">All Manufacturers</option>
              {filterOptions.manufacturers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Dosage Form */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Dosage Form
            </label>
            <select
              value={dosageForm}
              onChange={(e) => {
                setDosageForm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-medical-500 outline-none"
            >
              <option value="all">All Dosage Forms</option>
              {filterOptions.dosageForms.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Availability */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 text-medical-600 rounded focus:ring-medical-500"
              />
              <span>In Stock Only ({'> 0 units'})</span>
            </label>
          </div>

          {/* Wholesale Notice */}
          <div className="p-3 bg-medical-50 dark:bg-medical-950/40 rounded-xl border border-medical-200 dark:border-medical-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <p className="font-bold text-medical-900 dark:text-medical-200">Wholesale Purchase Note:</p>
            <p>Prices listed are B2B wholesale net rates. Minimum order quantities apply per trade strip / pack size.</p>
          </div>
        </div>

        {/* Right Product Grid Column */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Controls Bar: Sort, View Toggle, Mobile Filter trigger */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden px-3.5 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters ({category !== 'all' || manufacturer !== 'all' ? 'Active' : 'All'})</span>
            </button>

            {/* Results count */}
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing <strong className="text-slate-900 dark:text-white">{medicines.length}</strong> of {totalCount} medicines
            </p>

            {/* Sort Options */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-medical-500 outline-none"
              >
                <option value="featured">Featured & Popular</option>
                <option value="name">Medicine Name (A - Z)</option>
                <option value="price-low">Wholesale Price (Low &rarr; High)</option>
                <option value="price-high">Wholesale Price (High &rarr; Low)</option>
                <option value="stock">Stock Availability</option>
                <option value="newest">Newly Added</option>
              </select>
            </div>
          </div>

          {/* Mobile Filter Expandable Drawer */}
          {isMobileFilterOpen && (
            <div className="lg:hidden p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 p-2 text-xs bg-slate-50 dark:bg-slate-900 border rounded-lg"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">Manufacturer</label>
                  <select
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full mt-1 p-2 text-xs bg-slate-50 dark:bg-slate-900 border rounded-lg"
                  >
                    <option value="all">All Manufacturers</option>
                    {filterOptions.manufacturers.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500">Dosage Form</label>
                  <select
                    value={dosageForm}
                    onChange={(e) => setDosageForm(e.target.value)}
                    className="w-full mt-1 p-2 text-xs bg-slate-50 dark:bg-slate-900 border rounded-lg"
                  >
                    <option value="all">All Forms</option>
                    {filterOptions.dosageForms.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span>In Stock Only</span>
                </label>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-medical-600 font-bold"
                >
                  Reset All
                </button>
              </div>
            </div>
          )}

          {/* Medicines Cards Grid */}
          {loading ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-medical-600 mb-3" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Fetching inventory from warehouse...</p>
            </div>
          ) : medicines.length === 0 ? (
            <div className="p-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Medicines Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                We couldn't find any wholesale medicines matching your filter criteria. Try searching by active chemical composition or reset your filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-medical-600 hover:bg-medical-700 text-white rounded-xl text-xs font-bold shadow transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map((medicine) => (
                <MedicineCard key={medicine._id} medicine={medicine} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition ${currentPage === page ? 'bg-medical-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default MedicinesPage;
