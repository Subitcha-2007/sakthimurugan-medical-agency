import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  Search,
  ShoppingCart,
  User,
  Sun,
  Moon,
  MapPin,
  Menu,
  X,
  Pill,
  FileText,
  ShieldCheck,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Truck,
  PhoneCall,
  Clock,
  Package,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import PincodeCheckerModal from './PincodeCheckerModal';

const Navbar = () => {
  const { user, logout, isApprovedClient, isAdmin, isStaff, isOperationalStaff } = useAuth();
  const { totalItemsCount } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Medicines Catalog', path: '/medicines' },
    { name: 'Delivery Areas', path: '/delivery-areas' },
    { name: 'Business Information', path: '/about-contact' },
    { name: 'Register Business', path: '/register', hideIfAuth: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Top Corporate Trust Bar */}
        <div className="bg-medical-900 text-white text-xs py-1.5 px-4 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-medical-200">
                <Building2 className="w-3.5 h-3.5 text-medical-400" />
                <span>50, 1st Floor, Kamaraj Street, Erode, Tamil Nadu</span>
              </span>
              <span className="flex items-center gap-1.5 text-medical-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Wholesale Drug License: Form 20B & 21B Authorized</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-medical-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-medical-400" />
                <span>Wholesale Desk: 9:00 AM – 9:00 PM</span>
              </span>
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white">9994446994 / 9865730150</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo & Brand Name */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medical-600 to-medical-800 flex items-center justify-center text-white shadow-md shadow-medical-600/20 group-hover:scale-105 transition-transform">
                <Pill className="w-7 h-7 rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white leading-tight">
                  SAKTHIMURUGAN
                </span>
                <span className="text-[11px] font-bold tracking-wider text-medical-600 dark:text-medical-400 uppercase">
                  Medical Agency &bull; Erode
                </span>
              </div>
            </Link>

            {/* Desktop Medicine Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-4">
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search 1,000+ medicines, generic salts, brands (e.g. Paracetamol, Augmentin)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-24 py-2.5 bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-full border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white dark:focus:bg-slate-800 transition"
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-1.5 bg-medical-600 hover:bg-medical-700 text-white rounded-full text-xs font-semibold tracking-wide transition shadow-sm"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Delivery Availability Button */}
              <button
                onClick={() => setIsPincodeModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-medical-600 dark:hover:text-medical-400 bg-slate-100 dark:bg-slate-800 hover:bg-medical-50 dark:hover:bg-medical-950/40 rounded-xl border border-slate-200 dark:border-slate-700 transition"
                title="Check Regional Delivery Service"
              >
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span className="hidden xl:inline">Check Pincode</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Dark / Light Theme"
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>

              {/* Wholesale Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-medical-50 dark:hover:bg-medical-950/50 hover:text-medical-600 dark:hover:text-medical-400 transition"
                title="Wholesale Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-medical-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </Link>

              {/* User Profile / Auth Actions */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-medical-600 text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div className="hidden md:block max-w-[120px] truncate">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                        {user.businessDetails?.shopName || user.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                        {user.role} {user.accountStatus === 'approved' ? '✓' : `(${user.accountStatus})`}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-fade-in"
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-medical-600 dark:text-medical-400 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-medical-50 dark:hover:bg-medical-950/50 hover:text-medical-600"
                        >
                          <LayoutDashboard className="w-4 h-4 text-medical-600" />
                          <span>Admin Control Panel</span>
                        </Link>
                      )}

                      {isStaff && (
                        <Link
                          to="/staff"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-medical-50 dark:hover:bg-medical-950/50 hover:text-medical-600"
                        >
                          <Package className="w-4 h-4 text-medical-600" />
                          <span>Operations Dashboard</span>
                        </Link>
                      )}

                      {user.role === 'client' && (
                        <>
                          <Link
                            to="/client-dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-medical-50 dark:hover:bg-medical-950/50 hover:text-medical-600"
                          >
                            <LayoutDashboard className="w-4 h-4 text-medical-600" />
                            <span>Client Account Hub</span>
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-medical-50 dark:hover:bg-medical-950/50 hover:text-medical-600"
                          >
                            <Truck className="w-4 h-4 text-emerald-600" />
                            <span>My Orders & Invoices</span>
                          </Link>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-t border-slate-100 dark:border-slate-700 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-medical-700 dark:text-medical-300 hover:text-medical-800 bg-medical-50 dark:bg-medical-950/50 rounded-xl hover:bg-medical-100 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-medical-600 hover:bg-medical-700 rounded-xl shadow-sm hover:shadow transition"
                  >
                    B2B Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Secondary Desktop Navigation Row */}
          <div className="hidden lg:flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-8">
              <Link
                to="/medicines"
                className={`hover:text-medical-600 dark:hover:text-medical-400 flex items-center gap-1.5 transition ${location.pathname === '/medicines' ? 'text-medical-600 dark:text-medical-400 font-bold' : ''}`}
              >
                <Pill className="w-4 h-4 text-medical-500" />
                <span>All Medicines</span>
              </Link>
              <Link
                to="/delivery-areas"
                className={`hover:text-medical-600 dark:hover:text-medical-400 flex items-center gap-1.5 transition ${location.pathname === '/delivery-areas' ? 'text-medical-600 dark:text-medical-400 font-bold' : ''}`}
              >
                <Truck className="w-4 h-4 text-emerald-500" />
                <span>Proposed Service Regions (Erode / Karur / Namakkal / Salem)</span>
              </Link>
              <Link
                to="/about-contact"
                className={`hover:text-medical-600 dark:hover:text-medical-400 flex items-center gap-1.5 transition ${location.pathname === '/about-contact' ? 'text-medical-600 dark:text-medical-400 font-bold' : ''}`}
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Business Credentials & Contact</span>
              </Link>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live Wholesale Dispatch Online</span>
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search medicines, brands, salts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <button
                type="submit"
                className="absolute right-2 top-1.5 px-3 py-1.5 bg-medical-600 text-white rounded-lg text-xs font-semibold"
              >
                Search
              </button>
            </form>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsPincodeModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm"
            >
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Check Delivery Availability</span>
            </button>

            <div className="flex flex-col space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-sm">
              <Link
                to="/medicines"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
              >
                Medicines Marketplace
              </Link>
              <Link
                to="/delivery-areas"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
              >
                Proposed Service Regions
              </Link>
              <Link
                to="/about-contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
              >
                Business Information & Contact
              </Link>

              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg bg-medical-50 dark:bg-medical-950/50 text-medical-600 font-bold"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {isStaff && (
                    <Link
                      to="/staff"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg bg-medical-50 dark:bg-medical-950/50 text-medical-600 font-bold"
                    >
                      Staff Dashboard
                    </Link>
                  )}
                  {user.role === 'client' && (
                    <Link
                      to="/client-dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-2 rounded-lg bg-medical-50 dark:bg-medical-950/50 text-medical-600 font-bold"
                    >
                      Client Account
                    </Link>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl font-bold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2 bg-medical-600 text-white rounded-xl font-bold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Pincode checker modal */}
      <PincodeCheckerModal isOpen={isPincodeModalOpen} onClose={() => setIsPincodeModalOpen(false)} />
    </>
  );
};

export default Navbar;
