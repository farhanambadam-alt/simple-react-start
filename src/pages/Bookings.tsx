import { useState, useRef } from 'react';
import { CalendarDays, Clock, MapPin, ChevronRight, ChevronDown, Scissors, ArrowLeft, Camera, Star, ImagePlus, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bookings as initialBookings } from '@/data/mockData';
import type { Booking } from '@/types/salon';
import AppHeader from '@/components/AppHeader';
import ScrollToTop from '@/components/ScrollToTop';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const BookingsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [bookingsList, setBookingsList] = useState<Booking[]>(initialBookings);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, { text: string; rating: number }>>({});
  const beforeInputRef = useRef<Record<string, HTMLInputElement | null>>({});
  const afterInputRef = useRef<Record<string, HTMLInputElement | null>>({});

  const filtered = bookingsList.filter((b) => b.status === tab);

  const handleCancel = (id: string) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b))
    );
  };

  const handleBeforeUpload = (id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setBookingsList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, beforeImage: url } : b))
    );
  };

  const handleAfterUpload = (id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setBookingsList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, afterImage: url } : b))
    );
  };

  const handleSubmitReview = (id: string) => {
    const draft = reviewDrafts[id];
    if (!draft || draft.rating === 0) return;
    setBookingsList((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, reviewText: draft.text, reviewRating: draft.rating } : b
      )
    );
    setReviewDrafts((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const getDraft = (id: string) => reviewDrafts[id] || { text: '', rating: 0 };

  const updateDraft = (id: string, partial: Partial<{ text: string; rating: number }>) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [id]: { ...getDraft(id), ...partial },
    }));
  };

  const tabs = [
    { key: 'upcoming' as const, label: 'Upcoming', count: bookingsList.filter(b => b.status === 'upcoming').length },
    { key: 'completed' as const, label: 'Completed', count: bookingsList.filter(b => b.status === 'completed').length },
    { key: 'cancelled' as const, label: 'Cancelled', count: bookingsList.filter(b => b.status === 'cancelled').length },
  ];

  const headerLeft = (
    <div className="flex items-center gap-3">
      <button
        onClick={() => window.appBack?.()}
        className="min-w-[48px] min-h-[48px] rounded-full bg-secondary flex items-center justify-center"
        aria-label="Go back"
      >
        <ArrowLeft size={18} className="text-foreground" />
      </button>
      <div>
        <h1 className="font-heading font-bold text-xl text-foreground">My Bookings</h1>
        <p className="text-xs font-body text-muted-foreground mt-0.5">Manage your appointments</p>
      </div>
    </div>
  );

  const renderPhotoReviewSection = (booking: Booking) => {
    const isUpcoming = booking.status === 'upcoming';
    const isCompleted = booking.status === 'completed';
    if (!isUpcoming && !isCompleted) return null;

    const draft = getDraft(booking.id);
    const hasSubmittedReview = !!booking.reviewText;

    return (
      <div className="mt-3 pt-3 border-t border-border/60 space-y-3">
        {/* Before / After Photo Section */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Before Photo */}
          <div>
            <p className="text-[10px] font-heading text-muted-foreground uppercase tracking-wide mb-1.5">Before</p>
            {booking.beforeImage ? (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <img src={booking.beforeImage} alt="Before" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-[9px] font-heading font-semibold text-white/90">BEFORE</span>
              </div>
            ) : (
              <button
                onClick={() => beforeInputRef.current[booking.id]?.click()}
                className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-1.5 hover:bg-primary/10 transition-colors"
              >
                <Camera size={20} className="text-primary/60" />
                <span className="text-[10px] font-heading font-medium text-primary/70">Upload Before</span>
              </button>
            )}
            <input
              ref={(el) => { beforeInputRef.current[booking.id] = el; }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleBeforeUpload(booking.id, file);
              }}
            />
          </div>

          {/* After Photo */}
          <div>
            <p className="text-[10px] font-heading text-muted-foreground uppercase tracking-wide mb-1.5">After</p>
            {isUpcoming ? (
              /* Phase 1: Locked */
              <div className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex flex-col items-center justify-center gap-1.5">
                <Lock size={18} className="text-muted-foreground/40" />
                <span className="text-[9px] font-heading text-muted-foreground/50 text-center px-2">Available after service</span>
              </div>
            ) : booking.afterImage ? (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <img src={booking.afterImage} alt="After" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-[9px] font-heading font-semibold text-white/90">AFTER</span>
              </div>
            ) : (
              /* Phase 2: Unlocked */
              <button
                onClick={() => afterInputRef.current[booking.id]?.click()}
                className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 flex flex-col items-center justify-center gap-1.5 hover:bg-emerald-500/10 transition-colors"
              >
                <ImagePlus size={20} className="text-emerald-500/60" />
                <span className="text-[10px] font-heading font-medium text-emerald-600/70">Upload After</span>
              </button>
            )}
            <input
              ref={(el) => { afterInputRef.current[booking.id] = el; }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAfterUpload(booking.id, file);
              }}
            />
          </div>
        </div>

        {/* Review Section */}
        <div>
          <p className="text-[10px] font-heading text-muted-foreground uppercase tracking-wide mb-1.5">Review</p>
          {isUpcoming ? (
            /* Phase 1: Locked */
            <div className="rounded-xl border border-muted-foreground/15 bg-muted/30 p-3 flex items-center gap-2">
              <Lock size={14} className="text-muted-foreground/40" />
              <span className="text-[11px] font-body text-muted-foreground/50">Review unlocks after service is completed</span>
            </div>
          ) : hasSubmittedReview ? (
            /* Already submitted */
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-0.5 mb-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={s <= (booking.reviewRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}
                  />
                ))}
              </div>
              <p className="text-[12px] font-body text-foreground/80 leading-relaxed">{booking.reviewText}</p>
            </div>
          ) : (
            /* Phase 2: Unlocked — write review */
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateDraft(booking.id, { rating: s })}
                    className="p-0.5"
                  >
                    <Star
                      size={22}
                      className={`transition-colors ${s <= draft.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30 hover:text-amber-300'}`}
                    />
                  </button>
                ))}
                {draft.rating > 0 && (
                  <span className="text-[10px] font-heading text-muted-foreground ml-1">{draft.rating}/5</span>
                )}
              </div>
              <textarea
                value={draft.text}
                onChange={(e) => updateDraft(booking.id, { text: e.target.value })}
                placeholder="Share your experience (optional)..."
                rows={2}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-[12px] font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <button
                onClick={() => handleSubmitReview(booking.id)}
                disabled={draft.rating === 0}
                className="w-full py-2 rounded-xl text-[11px] font-heading font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[40px]"
              >
                Submit Review
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-safe">
      <AppHeader leftSlot={headerLeft} showLocation={false} />

      {/* Tab bar */}
      <div className="flex gap-2 px-4 py-3 max-w-7xl mx-auto w-full">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-full text-xs font-heading font-medium capitalize transition-colors duration-200 min-h-[40px] ${
              tab === t.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center ${
                tab === t.key ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      <div className="px-5 space-y-4 mt-1 max-w-7xl mx-auto md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
        {filtered.map((booking) => {
          const isExpanded = expandedId === booking.id;
          const showExpandable = booking.status === 'upcoming' || booking.status === 'completed';

          return (
            <div
              key={booking.id}
              className="bg-card rounded-2xl overflow-hidden border border-border animate-fade-in-up"
              style={{ boxShadow: '0 2px 12px -2px hsl(var(--foreground) / 0.06)' }}
            >
              <div className="relative h-28 overflow-hidden">
                <img
                  src={booking.salonImage}
                  alt={booking.salonName}
                  className="w-full h-full object-cover"
                  decoding="async"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-sm text-white">{booking.salonName}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={10} className="text-white/70" />
                      <span className="text-[10px] font-body text-white/70">Bangalore</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-heading font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                    booking.status === 'upcoming'
                      ? 'bg-primary/90 text-primary-foreground'
                      : booking.status === 'completed'
                      ? 'bg-emerald-500/90 text-white'
                      : 'bg-destructive/90 text-white'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="p-3.5">
                <div className="flex items-start gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Scissors size={13} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-heading font-medium text-muted-foreground uppercase tracking-wide">Services</p>
                    <p className="text-[13px] font-body text-foreground mt-0.5 leading-snug">{booking.services.join(' • ')}</p>
                  </div>
                </div>

                <div className="flex gap-3 mb-3">
                  <div className="flex items-center gap-1.5 flex-1">
                    <div className="w-7 h-7 rounded-lg bg-accent/60 flex items-center justify-center flex-shrink-0">
                      <CalendarDays size={13} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-heading text-muted-foreground uppercase tracking-wide">Date</p>
                      <p className="text-[12px] font-body font-medium text-foreground">{booking.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-1">
                    <div className="w-7 h-7 rounded-lg bg-accent/60 flex items-center justify-center flex-shrink-0">
                      <Clock size={13} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] font-heading text-muted-foreground uppercase tracking-wide">Time</p>
                      <p className="text-[12px] font-body font-medium text-foreground">{booking.time}</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border/60 mb-3" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-heading text-muted-foreground uppercase tracking-wide">Total</p>
                    <span className="font-heading font-bold text-base text-foreground">₹{booking.totalPrice}</span>
                  </div>

                  {booking.status === 'upcoming' && (
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="px-4 py-2 rounded-xl text-[11px] font-heading font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors min-h-[44px]">
                            Cancel
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl max-w-[320px]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-heading text-base">Cancel Booking?</AlertDialogTitle>
                            <AlertDialogDescription className="font-body text-[13px]">
                              Are you sure you want to cancel your appointment at <strong>{booking.salonName}</strong> on {booking.date}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-row gap-2">
                            <AlertDialogCancel className="rounded-xl flex-1 mt-0 font-heading text-xs min-h-[44px]">Keep</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancel(booking.id)}
                              className="rounded-xl flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 font-heading text-xs min-h-[44px]"
                            >
                              Yes, Cancel
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/booking/${booking.id}`, { state: { reschedule: true } }); }}
                        className="px-4 py-2 rounded-xl text-[11px] font-heading font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors min-h-[44px] flex items-center gap-1"
                      >
                        Reschedule <ChevronRight size={12} />
                      </button>
                    </div>
                  )}

                  {booking.status === 'completed' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/salon/${booking.id}`); }}
                      className="px-4 py-2 rounded-xl text-[11px] font-heading font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors min-h-[44px] flex items-center gap-1"
                    >
                      Rebook <ChevronRight size={12} />
                    </button>
                  )}
                </div>

                {/* Expandable Photos & Review section */}
                {showExpandable && (
                  <>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                      className="w-full flex items-center justify-center gap-1 mt-3 pt-2 border-t border-border/40 text-[11px] font-heading font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Camera size={13} />
                      {isExpanded ? 'Hide' : 'Photos & Review'}
                      <ChevronDown size={13} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {isExpanded && renderPhotoReviewSection(booking)}
                  </>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-20 col-span-full">
            <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
              <CalendarDays size={28} className="text-muted-foreground/40" />
            </div>
            <p className="font-heading font-semibold text-sm text-foreground">No {tab} bookings</p>
            <p className="text-xs font-body text-muted-foreground/60 mt-1">Your bookings will appear here</p>
          </div>
        )}
      </div>

      <ScrollToTop />
    </div>
  );
};

export default BookingsPage;
