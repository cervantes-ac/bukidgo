import { Star, ShieldCheck, Calendar, Briefcase, Award, Users, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import { LOCAL_BUDDIES } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import { useFirebase } from "../contexts/FirebaseContext";
import { db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { useToast, ToastContainer } from "../components/Toast";
import { formatErrorMessage } from "../utils/errorMessages";
import { PageHeader } from "../components/PageHeader";
import { FilterBar } from "../components/FilterBar";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { EmptyState } from "../components/EmptyState";
import { Pagination } from "../components/Pagination";

const THEME = {
  darkBg: "#1B4D2E",
  mainBg: "#F5F9F7",
  primaryAccent: "#2D7A4A",
  secondaryAccent: "#7BC97F",
  text: "#1A3A2A",
  borders: "#C8DDD4",
  earthBrown: "#8B6F47",
  goldenAccent: "#D4A574",
  lightText: "rgba(245, 249, 247, 0.45)",
  darkText: "#1A1208",
  lightBg: "#F5F0E8",
  brownAccent: "#C4622D",
  verifiedGreen: "#4A7C59",
};

const ITEMS_PER_PAGE = 10;

export default function GuidesEnhanced() {
  const [selectedBuddy, setSelectedBuddy] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState(0);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { user } = useFirebase();
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();
  const [liveGuides, setLiveGuides] = useState<any[]>(LOCAL_BUDDIES || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toasts, addToast, removeToast } = useToast();

  // Data fetching with error handling
  useEffect(() => {
    let unsubGuides: (() => void) | null = null;
    let timeoutId: NodeJS.Timeout;

    try {
      unsubGuides = onSnapshot(
        collection(db, "guides"),
        (snapshot) => {
          try {
            if (!snapshot.empty) {
              setLiveGuides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
            setLoading(false);
            setError(null);
          } catch (err) {
            console.error('Error processing guides:', err);
            setError('Failed to load guides');
          }
        },
        (err) => {
          console.error('Firestore error:', err);
          setError('Failed to load guides. Please refresh the page.');
          setLoading(false);
        }
      );

      timeoutId = setTimeout(() => {
        if (loading) {
          setError('Loading took too long. Please refresh the page.');
          setLoading(false);
        }
      }, 10000);
    } catch (err) {
      setError('Failed to initialize data loading');
      setLoading(false);
    }

    return () => {
      if (unsubGuides) unsubGuides();
      clearTimeout(timeoutId);
    };
  }, [retryCount]);

  // Compute specialties
  const allSpecialties = useMemo(() => {
    const s = new Set<string>();
    liveGuides.forEach(b => {
      if (b.specialties) b.specialties.forEach((sp: string) => s.add(sp));
    });
    return Array.from(s).sort();
  }, [liveGuides]);

  // Filter guides
  const filteredGuides = useMemo(() => {
    return liveGuides.filter(buddy => {
      const matchesSearch = buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buddy.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buddy.specialties?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const years = parseInt(buddy.experience) || 0;
      return matchesSearch &&
        years >= minExperience &&
        (buddy.pricePerDay || 0) <= maxPrice &&
        buddy.rating >= minRating &&
        (specialties.length === 0 || buddy.specialties?.some((s: string) => specialties.includes(s)));
    });
  }, [liveGuides, searchQuery, minExperience, maxPrice, minRating, specialties]);

  // Pagination
  const totalPages = Math.ceil(filteredGuides.length / ITEMS_PER_PAGE);
  const paginatedGuides = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGuides.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGuides, currentPage]);

  // Handlers
  const handleBook = async () => {
    if (!user) { navigate('/auth'); return; }
    setIsBooking(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email,
        buddyId: selectedBuddy.uid,
        buddyName: selectedBuddy.name,
        date: new Date().toISOString(),
        status: "pending",
        createdAt: serverTimestamp(),
        type: "buddy"
      });
      setBooked(true);
      addToast(`Booking request sent to ${selectedBuddy.name}!`, 'success');
      setTimeout(() => { setBooked(false); setSelectedBuddy(null); }, 3000);
    } catch (error) {
      const errorMsg = formatErrorMessage(error);
      addToast(errorMsg, 'error');
      handleFirestoreError(error, OperationType.WRITE, "bookings");
    } finally {
      setIsBooking(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryCount(prev => prev + 1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setMinExperience(0);
    setMaxPrice(5000);
    setMinRating(0);
    setSpecialties([]);
    setCurrentPage(1);
  };

  const toggleSpecialty = (s: string) => {
    setSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    setCurrentPage(1);
  };

  const badgeFor = (r: number) =>
    r >= 4.8 ? { label: "Elite", variant: "primary" as const } :
    r >= 4.5 ? { label: "Top Rated", variant: "warning" as const } :
    { label: "Verified", variant: "success" as const };

  const hasActiveFilters = searchQuery || minExperience > 0 || maxPrice < 5000 || minRating > 0 || specialties.length > 0;

  return (
    <ErrorBoundary>
      <div style={{ background: THEME.mainBg, color: THEME.text, minHeight: "100vh" }}>
        <PageHeader
          subtitle="Mountain Guides"
          title="Your Local Buddies"
          description="Verified guides who know every hidden gem, secret trail, and authentic experience."
          background={`linear-gradient(135deg, ${THEME.darkBg} 0%, ${THEME.primaryAccent} 100%)`}
        />

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#FFEBEE',
              border: '1px solid #F44336',
              borderRadius: '4px',
              padding: '1.5rem',
              margin: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
            role="alert"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertCircle style={{ width: 20, height: 20, color: '#C62828', flexShrink: 0 }} />
              <div>
                <p style={{ color: '#C62828', fontWeight: 600, margin: 0, marginBottom: '4px' }}>Error Loading Guides</p>
                <p style={{ color: '#E53935', fontSize: '14px', margin: 0 }}>{error}</p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<RefreshCw style={{ width: 14, height: 14 }} />}
              onClick={handleRetry}
            >
              Retry
            </Button>
          </motion.div>
        )}

        {/* Filter Bar */}
        {!loading && !error && (
          <FilterBar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onReset={hasActiveFilters ? handleReset : undefined}
            hasActiveFilters={hasActiveFilters}
            placeholder="Search by name or specialty..."
          >
            <select
              value={minExperience}
              onChange={(e) => { setMinExperience(Number(e.target.value)); setCurrentPage(1); }}
              style={{
                padding: '8px 12px',
                background: '#fff',
                border: '1px solid #E8DCC8',
                borderRadius: '4px',
                fontSize: '12px',
                color: THEME.text,
                outline: 'none',
                cursor: 'pointer'
              }}
              aria-label="Filter by experience"
            >
              <option value={0}>Any Experience</option>
              <option value={1}>1+ Year</option>
              <option value={3}>3+ Years</option>
              <option value={5}>5+ Years</option>
            </select>

            <select
              value={minRating}
              onChange={(e) => { setMinRating(Number(e.target.value)); setCurrentPage(1); }}
              style={{
                padding: '8px 12px',
                background: '#fff',
                border: '1px solid #E8DCC8',
                borderRadius: '4px',
                fontSize: '12px',
                color: THEME.text,
                outline: 'none',
                cursor: 'pointer'
              }}
              aria-label="Filter by rating"
            >
              <option value={0}>Any Rating</option>
              <option value={4.0}>4.0+ ★</option>
              <option value={4.5}>4.5+ ★</option>
              <option value={4.8}>4.8+ ★</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="price-range" style={{ fontSize: '12px', color: THEME.earthBrown, fontWeight: 600 }}>
                ≤ ₱{maxPrice}
              </label>
              <input
                id="price-range"
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
                style={{ width: '120px', accentColor: THEME.primaryAccent }}
                aria-label="Filter by price"
              />
            </div>
          </FilterBar>
        )}

        {/* Specialty Tags */}
        {!loading && !error && allSpecialties.length > 0 && (
          <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '1rem 2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {allSpecialties.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSpecialty(s)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    transition: 'all 0.15s',
                    background: specialties.includes(s) ? THEME.darkBg : 'transparent',
                    color: specialties.includes(s) ? THEME.mainBg : THEME.earthBrown,
                    borderColor: specialties.includes(s) ? THEME.darkBg : THEME.borders,
                    textTransform: 'capitalize'
                  }}
                  aria-pressed={specialties.includes(s)}
                  aria-label={`Filter by ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '2rem' }}>
          {loading ? (
            <SkeletonLoader count={5} type="row" />
          ) : error ? (
            <EmptyState
              icon={AlertCircle}
              title="Unable to Load Guides"
              description="There was an error loading the guides. Please try again."
              action={<Button onClick={handleRetry} icon={<RefreshCw style={{ width: 14, height: 14 }} />}>Retry</Button>}
            />
          ) : filteredGuides.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Guides Found"
              description="Try adjusting your filters to find the perfect guide for your adventure."
            />
          ) : (
            <>
              {/* Guides Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${THEME.borders}` }}>
                      <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 700, color: THEME.earthBrown, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guide</th>
                      <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 700, color: THEME.earthBrown, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience</th>
                      <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 700, color: THEME.earthBrown, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</th>
                      <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 700, color: THEME.earthBrown, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedGuides.map((buddy, idx) => {
                      const badge = badgeFor(buddy.rating);
                      return (
                        <motion.tr
                          key={buddy.uid || buddy.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          onClick={() => setSelectedBuddy(buddy)}
                          style={{
                            borderBottom: `1px solid ${THEME.borders}`,
                            cursor: 'pointer',
                            background: selectedBuddy?.uid === buddy.uid ? 'rgba(45, 122, 74, 0.05)' : 'transparent',
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedBuddy?.uid !== buddy.uid) {
                              e.currentTarget.style.background = 'rgba(45, 122, 74, 0.03)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedBuddy?.uid !== buddy.uid) {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img
                                src={buddy.photoURL}
                                alt={buddy.name}
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '4px',
                                  objectFit: 'cover',
                                  border: `2px solid ${THEME.borders}`
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, marginBottom: '4px' }}>{buddy.name}</div>
                                <Badge variant="success" size="sm">Verified</Badge>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center', color: THEME.earthBrown }}>{buddy.experience}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                              <Star style={{ width: 14, height: 14, fill: '#D4A853', color: '#D4A853' }} />
                              <span style={{ fontWeight: 700 }}>{buddy.rating}</span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: THEME.primaryAccent }}>₱{buddy.pricePerDay}/day</td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={filteredGuides.length}
                />
              )}
            </>
          )}
        </div>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </ErrorBoundary>
  );
}
