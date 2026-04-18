import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { usePartner } from '@/contexts/PartnerContext';
import {
  mockServices, timeToMins, minsToTime12,
  OPEN_TIME, CLOSE_TIME, PPM,
  type Appointment,
} from '@/data/partnerMockData';
import StatusBadge from '@/components/partner/StatusBadge';
import DateChipStrip from '@/components/partner/DateChipStrip';
import PartnerTimeline, { type PartnerTimelineHandle } from '@/components/partner/PartnerTimeline';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calendar, Clock, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Check, X, Smartphone, User, AlertTriangle,
} from 'lucide-react';

/* ── Min card height so all elements fit in 15-min slots ── */
const MIN_CARD_PX = 110;

/* ── Collision-free layout ── */
interface LayoutSlot {
  id: string;
  visualTop: number;
  visualHeight: number;
  booking: Appointment;
}

const computeLayout = (bookings: Appointment[], timelineStartMins: number): LayoutSlot[] => {
  const sorted = [...bookings].sort((a, b) => timeToMins(a.scheduledTime) - timeToMins(b.scheduledTime));
  const slots: LayoutSlot[] = [];
  let maxBottom = 0;
  for (const booking of sorted) {
    const bStart = timeToMins(booking.scheduledTime);
    const naturalTop = (bStart - timelineStartMins) * PPM;
    const height = Math.max(booking.duration * PPM, MIN_CARD_PX);
    const top = Math.max(naturalTop, maxBottom + 2);
    slots.push({ id: booking.id, visualTop: top, visualHeight: height, booking });
    maxBottom = top + height;
  }
  return slots;
};

/* ── Date helpers ── */
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/* ── Node color helper ── */
const getNodeStyle = (status: Appointment['status']) => {
  switch (status) {
    case 'serving': return { bg: 'bg-blue-500', ring: 'ring-blue-200 dark:ring-blue-900' };
    case 'completed': return { bg: 'bg-emerald-500', ring: 'ring-emerald-200 dark:ring-emerald-900' };
    case 'cancelled': return { bg: 'bg-destructive', ring: 'ring-red-200 dark:ring-red-900' };
    default: return { bg: 'bg-amber-400', ring: 'ring-amber-200 dark:ring-amber-900' };
  }
};

const getTrackColor = (status: Appointment['status']) => {
  switch (status) {
    case 'completed': return 'bg-emerald-400/60';
    case 'cancelled': return 'bg-destructive/40';
    case 'serving': return 'bg-blue-400/60';
    default: return 'bg-border/40';
  }
};

const OwnerBookings = () => {
  const { appointments, staff, getStaffLogs } = usePartner();
  const today = new Date();

  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(today);
  const [showDateInput, setShowDateInput] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const timelineRef = useRef<PartnerTimelineHandle>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const lastScrollTop = useRef(0);
  const manualOverride = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Scroll-driven auto-collapse for date strip
  useEffect(() => {
    const el = timelineRef.current?.getScrollElement();
    if (!el) return;
    const onScroll = () => {
      if (manualOverride.current) return;
      const st = el.scrollTop;
      if (st > 30 && st > lastScrollTop.current) {
        setHeaderCollapsed(true);
      } else if (st < 10) {
        setHeaderCollapsed(false);
      }
      lastScrollTop.current = st;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const toggleHeader = useCallback(() => {
    manualOverride.current = true;
    setHeaderCollapsed(prev => !prev);
    setTimeout(() => { manualOverride.current = false; }, 1000);
  }, []);

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const isToday = isSameDay(selectedDate, today);

  const filtered = useMemo(() => {
    let result = [...appointments];
    result = result.filter(a => a.date === selectedDateStr);
    if (selectedStaffId !== 'all') result = result.filter(a => a.staffId === selectedStaffId);
    if (filterStatus !== 'all') result = result.filter(a => a.status === filterStatus);
    return result.sort((a, b) => timeToMins(a.scheduledTime) - timeToMins(b.scheduledTime));
  }, [appointments, selectedDateStr, selectedStaffId, filterStatus]);

  const completedCount = filtered.filter(a => a.status === 'completed').length;
  const servingCount = filtered.filter(a => a.status === 'serving').length;
  const waitingCount = filtered.filter(a => a.status === 'waiting').length;
  const totalCount = filtered.length;

  const nowMins = currentTime.getHours() * 60 + currentTime.getMinutes();
  const timelineStartMins = 0;

  const layoutSlots = computeLayout(filtered, timelineStartMins);
  const lastSlotBottom = layoutSlots.length > 0
    ? layoutSlots[layoutSlots.length - 1].visualTop + layoutSlots[layoutSlots.length - 1].visualHeight
    : 0;
  const totalHeight = Math.max(24 * 60 * PPM, lastSlotBottom + 40);

  const staffLogs = useMemo(() => {
    if (selectedStaffId === 'all') {
      return staff.flatMap(s => getStaffLogs(s.id));
    }
    return getStaffLogs(selectedStaffId);
  }, [selectedStaffId, staff, getStaffLogs]);
  const hasStaffLogs = staffLogs.length > 0;

  // Smart auto-scroll on date/staff change
  useEffect(() => {
    const el = timelineRef.current?.getScrollElement();
    if (!el) return;
      const raf = requestAnimationFrame(() => {
        setTimeout(() => {
          const sortedBookings = [...filtered]
            .sort((a, b) => timeToMins(a.scheduledTime) - timeToMins(b.scheduledTime));
          const firstBookingMins = sortedBookings.length > 0 ? timeToMins(sortedBookings[0].scheduledTime) : null;
          let targetMins: number;
          if (isToday) {
            if (nowMins < OPEN_TIME && firstBookingMins !== null) {
              targetMins = firstBookingMins;
            } else if (nowMins >= CLOSE_TIME && firstBookingMins !== null) {
              targetMins = firstBookingMins;
            } else {
              targetMins = nowMins;
            }
          } else {
            targetMins = firstBookingMins ?? OPEN_TIME;
          }
          const offset = Math.min(Math.max(el.clientHeight * 0.32, 120), 220);
          el.scrollTop = Math.max(0, targetMins * PPM - offset);
        }, 50);
      });
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateStr, selectedStaffId]);

  return (
    <div className="flex flex-col h-full min-h-0 min-w-0 w-full bg-background md:rounded-[28px] md:border md:border-border/60 md:bg-card/30 md:shadow-[0_20px_50px_-24px_hsl(var(--foreground)/0.25)]">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-3 pb-2 relative md:px-6 lg:px-7 md:rounded-t-[28px]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-heading font-bold text-foreground">Bookings</h1>
          <div className="flex items-center gap-1 text-primary">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-bold font-mono tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
            </span>
          </div>
        </div>

        {/* Staff Selector Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          <button
            onClick={() => setSelectedStaffId('all')}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl shrink-0 transition-all ${
              selectedStaffId === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-bold">
              All
            </div>
            <span className="text-[10px] font-semibold">Everyone</span>
          </button>
          {staff.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStaffId(s.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl shrink-0 transition-all ${
                selectedStaffId === s.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border-2 ${
                s.status === 'busy' ? 'border-destructive' : 'border-emerald-500'
              } bg-card`}>
                {s.image ? (
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-base">{s.avatar}</span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{s.name}</span>
            </button>
          ))}
        </div>

        {/* Collapsible: Date Navigation Strip + Date input */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: headerCollapsed ? 0 : (showDateInput ? 140 : 80), opacity: headerCollapsed ? 0 : 1 }}
        >
          <div className="mt-1">
            <DateChipStrip
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              rangeBefore={7}
              rangeAfter={7}
              showDateInput={showDateInput}
              onToggleDateInput={() => setShowDateInput(!showDateInput)}
            />
          </div>

          {showDateInput && (
            <div className="mt-2 flex items-center gap-2 bg-secondary/60 rounded-xl p-2 border border-border/40">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <input
                type="date"
                value={selectedDateStr}
                onChange={e => {
                  const d = new Date(e.target.value + 'T00:00:00');
                  if (!isNaN(d.getTime())) setSelectedDate(d);
                }}
                className="flex-1 bg-transparent text-sm text-foreground outline-none font-medium"
              />
            </div>
          )}
        </div>

        {/* Quick filters - always visible */}
        <div className={`flex flex-wrap items-center gap-1.5 ${headerCollapsed ? '' : 'mt-2'}`}>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
              filterStatus === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilterStatus('waiting')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
              filterStatus === 'waiting' ? 'bg-amber-500 text-white' : 'bg-secondary text-muted-foreground'
            }`}
          >
            Waiting ({waitingCount})
          </button>
          <button
            onClick={() => setFilterStatus('serving')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
              filterStatus === 'serving' ? 'bg-blue-500 text-white' : 'bg-secondary text-muted-foreground'
            }`}
          >
            Serving ({servingCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
              filterStatus === 'completed' ? 'bg-emerald-500 text-white' : 'bg-secondary text-muted-foreground'
            }`}
          >
            Done ({completedCount})
          </button>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-2 mt-2 bg-secondary/60 rounded-lg px-3 py-1.5 md:max-w-xl">
          <span className="text-[10px] text-muted-foreground">{completedCount}/{totalCount} completed</span>
          <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleHeader}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center w-7 h-7 rounded-full bg-background border-2 border-primary/40 shadow-md transition-transform active:scale-90 hover:border-primary/60"
          aria-label={headerCollapsed ? 'Expand header' : 'Collapse header'}
        >
          {headerCollapsed ? <ChevronDown className="w-4 h-4 text-foreground" /> : <ChevronUp className="w-4 h-4 text-foreground" />}
        </button>
      </div>

      {/* ── Timeline (shared component) ── */}
      <PartnerTimeline
        ref={timelineRef}
        selectedDate={selectedDate}
        canvasHeight={totalHeight}
        empty={filtered.length === 0}
        className={hasStaffLogs ? 'pb-24 md:pb-32' : 'pb-[calc(var(--inset-bottom)+8rem)] md:pb-40'}
        jumpBottomClass={hasStaffLogs ? 'bottom-6 md:bottom-28' : 'bottom-[calc(var(--inset-bottom)+6rem)] md:bottom-32'}
      >
        {/* Colored track segments per booking */}
        {layoutSlots.map(slot => (
          <div
            key={`track-${slot.id}`}
            className={`absolute left-0 w-0.5 ${getTrackColor(slot.booking.status)} transition-colors`}
            style={{ top: `${slot.visualTop}px`, height: `${slot.visualHeight}px` }}
          />
        ))}

        {/* Booking cards */}
        {layoutSlots.map(slot => {
          const booking = slot.booking;
          const bStart = timeToMins(booking.scheduledTime);
          const bEnd = bStart + booking.duration;
          const isSmall = slot.visualHeight <= MIN_CARD_PX + 10;
          const isExpanded = expandedCardId === booking.id;
          const staffMember = staff.find(s => s.id === booking.staffId);
          const serviceNames = booking.serviceIds
            .map(sid => mockServices.find(s => s.id === sid)?.name)
            .filter(Boolean);
          const nodeStyle = getNodeStyle(booking.status);
          const bookingOvertime = booking.status === 'serving' && nowMins > bEnd;

          const borderColor = booking.status === 'completed'
            ? 'border-l-emerald-400'
            : booking.status === 'cancelled'
              ? 'border-l-destructive'
              : booking.type === 'online'
                ? 'border-l-blue-500'
                : 'border-l-green-500';

          const bgColor = booking.status === 'completed'
            ? 'bg-muted/50'
            : booking.status === 'cancelled'
              ? 'bg-destructive/5'
              : 'bg-card';

          return (
            <div key={booking.id} className="absolute left-0 right-0" style={{ top: `${slot.visualTop}px`, zIndex: isExpanded ? 30 : 10 }}>
              {/* Timeline node */}
              <div className="absolute left-0 top-3 -translate-x-1/2 z-10">
                <div className={`w-4 h-4 rounded-full ${nodeStyle.bg} ring-2 ${nodeStyle.ring} flex items-center justify-center`}>
                  {booking.status === 'completed' && <Check className="w-2.5 h-2.5 text-white" />}
                  {booking.status === 'cancelled' && <X className="w-2.5 h-2.5 text-white" />}
                  {booking.status === 'serving' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                </div>
              </div>

              {/* Card */}
              <div
                onClick={() => isSmall && setExpandedCardId(isExpanded ? null : booking.id)}
                className={`${isExpanded ? 'timeline-card-expanded' : 'timeline-card'} ml-4 ${bgColor} rounded-xl border border-border border-l-4 ${borderColor} transition-all duration-200 ${
                  isSmall ? 'cursor-pointer' : ''
                } ${isExpanded ? 'shadow-xl ring-1 ring-primary/20 relative' : 'shadow-sm overflow-hidden'}`}
                style={{ height: isExpanded ? 'auto' : `${slot.visualHeight}px`, minHeight: isExpanded ? undefined : undefined }}
              >
                <div className={`p-2 h-full flex flex-col ${isExpanded ? '' : 'overflow-hidden'}`}>
                  {/* Row 1: Tags */}
                  <div className="flex flex-wrap items-center gap-0.5 mb-0.5">
                    <span className="tc-tag font-bold bg-foreground/10 text-foreground px-1 py-px rounded-full leading-none">#{booking.queueNo}</span>
                    <span className={`tc-tag font-medium px-1 py-px rounded-full flex items-center gap-px leading-none ${
                      booking.type === 'online' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' : 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400'
                    }`}>
                      {booking.type === 'online' ? <Smartphone className="w-2 h-2" /> : <User className="w-2 h-2" />}
                      {booking.type === 'online' ? 'Online' : 'Walk-in'}
                    </span>
                    {booking.status === 'serving' && (
                      <span className="tc-tag font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-1 py-px rounded-full animate-pulse leading-none">Serving</span>
                    )}
                    {booking.status === 'waiting' && (
                      <span className="tc-tag font-medium bg-secondary text-muted-foreground px-1 py-px rounded-full leading-none">Waiting</span>
                    )}
                    {booking.status === 'completed' && (
                      <span className="tc-tag font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-1 py-px rounded-full flex items-center gap-0.5 leading-none">
                        <Check className="w-2 h-2" /> Finished
                      </span>
                    )}
                    {booking.status === 'cancelled' && (
                      <span className="tc-tag font-bold bg-destructive/15 text-destructive px-1 py-px rounded-full flex items-center gap-0.5 leading-none">
                        <X className="w-2 h-2" /> Cancelled
                      </span>
                    )}
                    {bookingOvertime && (
                      <span className="tc-tag font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-1 py-px rounded-full flex items-center gap-0.5 leading-none">
                        <AlertTriangle className="w-2 h-2" /> OT
                      </span>
                    )}
                  </div>

                  {/* Row 2: Name + time + staff */}
                  <div className="flex items-center justify-between gap-1">
                    <p className={`tc-name font-bold truncate ${booking.status === 'completed' || booking.status === 'cancelled' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {booking.clientName}
                    </p>
                    <span className="tc-meta text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {minsToTime12(bStart)}–{minsToTime12(bEnd)}
                    </span>
                  </div>

                  {/* Staff name (when viewing all) */}
                  {selectedStaffId === 'all' && staffMember && (
                    <p className="tc-meta text-primary font-medium">{staffMember.avatar} {staffMember.name}</p>
                  )}

                  {/* Row 3: Services as #hashtags */}
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {(isExpanded ? serviceNames : serviceNames.slice(0, 2)).map((name, i) => (
                      <span key={i} className="tc-service font-bold text-primary bg-primary/10 px-1 py-px rounded leading-none">
                        #{name}
                      </span>
                    ))}
                    {!isExpanded && serviceNames.length > 2 && (
                      <span className="tc-service text-primary font-semibold px-1 py-px leading-none">+{serviceNames.length - 2}</span>
                    )}
                  </div>

                  {/* Price */}
                  <span className="tc-price font-semibold text-foreground mt-0.5">₹{booking.price}</span>

                  {/* Expand hint */}
                  {isSmall && !isExpanded && serviceNames.length > 2 && (
                    <span className="tc-hint text-primary font-medium mt-auto">Tap to expand</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </PartnerTimeline>

      {/* Service Logs Footer */}
      {staffLogs.length > 0 && (
        <div className="border-t border-border bg-card px-4 py-2 md:px-6 lg:px-7 md:rounded-b-[28px]">
          <p className="text-[10px] text-muted-foreground font-medium mb-1">
            Completed Logs ({staffLogs.length})
          </p>
          <ScrollArea className="max-h-[120px]">
            <div className="flex flex-col gap-1 pr-2">
              {staffLogs.slice().reverse().slice(0, 5).map(log => {
                const svcNames = log.serviceIds.map(sid => mockServices.find(sv => sv.id === sid)?.name).filter(Boolean);
                return (
                  <div key={log.id} className="flex items-center justify-between bg-secondary rounded-lg px-2.5 py-1.5">
                    <div>
                      <p className="text-[10px] font-medium text-foreground">{log.clientName}</p>
                      <p className="text-[9px] text-muted-foreground">{svcNames.join(', ')} · {log.duration}min</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">₹{log.price}</span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
