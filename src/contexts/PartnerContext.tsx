import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  mockStaff, mockAppointments, StaffMember, Appointment, BreakInfo,
  mockServices, timeToMins, minsToTime, OPEN_TIME, CLOSE_TIME,
} from '@/data/partnerMockData';

export interface ServiceLog {
  id: string;
  appointmentId: string;
  staffId: string;
  clientName: string;
  serviceIds: string[];
  duration: number;
  price: number;
  type: 'online' | 'walkin';
  scheduledTime: string;
  startedAt: number;
  completedAt: number;
  date: string;
}

export interface LeaveRecord {
  id: string;
  staffId: string;
  date: string; // ISO date string
  takenAt: number; // timestamp
}

interface PartnerState {
  activeStaffId: string | null;
  staff: StaffMember[];
  appointments: Appointment[];
  breaks: Record<string, BreakInfo | null>;
  serviceLogs: ServiceLog[];
  leaves: LeaveRecord[];
  setActiveStaff: (id: string) => void;
  toggleStaffStatus: (id: string) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status'], reason?: string) => void;
  completeService: (id: string) => void;
  startService: (id: string) => void;
  addWalkIn: (barberId: string, name: string, serviceIds: string[], duration: number, price: number) => string | null;
  setBreak: (staffId: string, durationMins: number) => void;
  clearBreak: (staffId: string) => void;
  getNextAvailableSlot: (barberId: string, duration: number) => number | null;
  activeStaff: StaffMember | null;
  staffAppointments: Appointment[];
  getStaffLogs: (staffId: string) => ServiceLog[];
  addStaffMember: (data: { name: string; role: string; avatar: string; image?: string; phone?: string; email?: string }) => void;
  undoComplete: (appointmentId: string) => void;
  undoCancel: (appointmentId: string) => void;
  getBreakConflicts: (staffId: string, startMins: number, endMins: number) => Appointment[];
  takeLeave: (staffId: string) => void;
  getStaffLeavesThisMonth: (staffId: string) => number;
  getStaffLeavesThisYear: (staffId: string) => number;
  getStaffLeaves: (staffId: string) => LeaveRecord[];
}

const PartnerContext = createContext<PartnerState | null>(null);

export const usePartner = () => {
  const ctx = useContext(PartnerContext);
  if (!ctx) throw new Error('usePartner must be inside PartnerProvider');
  return ctx;
};

export const PartnerProvider = ({ children }: { children: ReactNode }) => {
  const [activeStaffId, setActiveStaffId] = useState<string | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [breaks, setBreaks] = useState<Record<string, BreakInfo | null>>({});
  const [serviceLogs, setServiceLogs] = useState<ServiceLog[]>([]);
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);

  const setActiveStaff = useCallback((id: string) => setActiveStaffId(id), []);

  const toggleStaffStatus = useCallback((id: string) => {
    setStaff(prev => prev.map(s =>
      s.id === id
        ? { ...s, status: s.status === 'free' ? 'busy' : 'free', busySince: s.status === 'free' ? Date.now() : undefined }
        : s
    ));
  }, []);

  const updateAppointmentStatus = useCallback((id: string, status: Appointment['status'], reason?: string) => {
    setAppointments(prev => prev.map(a => {
      if (a.id !== id) return a;
      if (status === 'cancelled') {
        return { ...a, status, cancelReason: reason, cancelledAt: Date.now() };
      }
      return { ...a, status };
    }));
  }, []);

  const completeService = useCallback((id: string) => {
    setAppointments(prev => {
      const target = prev.find(a => a.id === id);
      if (!target) return prev;
      // Log the completed service
      const log: ServiceLog = {
        id: `log-${Date.now()}`,
        appointmentId: target.id,
        staffId: target.staffId,
        clientName: target.clientName,
        serviceIds: target.serviceIds,
        duration: target.duration,
        price: target.price,
        type: target.type,
        scheduledTime: target.scheduledTime,
        startedAt: target.startedAt || Date.now(),
        completedAt: Date.now(),
        date: target.date,
      };
      setServiceLogs(logs => [...logs, log]);
      // Update staff earnings + bookingsCompleted
      setStaff(prevStaff => prevStaff.map(s => s.id === target.staffId
        ? {
            ...s,
            earnings: {
              today: s.earnings.today + target.price,
              week: s.earnings.week + target.price,
              month: s.earnings.month + target.price,
            },
            bookingsCompleted: s.bookingsCompleted + 1,
          }
        : s
      ));
      return prev.map(a => a.id === id ? { ...a, status: 'completed' as const, completedAt: Date.now() } : a);
    });
  }, []);

  const startService = useCallback((id: string) => {
    setAppointments(prev => {
      const target = prev.find(a => a.id === id);
      if (!target) return prev;
      return prev.map(a => {
        if (a.id === id) return { ...a, status: 'serving' as const, startedAt: Date.now() };
        if (a.staffId === target.staffId && a.status === 'serving') return { ...a, status: 'waiting' as const };
        return a;
      });
    });
  }, []);

  const getNextAvailableSlot = useCallback((barberId: string, duration: number): number | null => {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const barberBookings = appointments
      .filter(b => b.staffId === barberId && b.status !== 'completed' && b.status !== 'cancelled')
      .map(b => ({ start: timeToMins(b.scheduledTime), end: timeToMins(b.scheduledTime) + b.duration }))
      .sort((a, b) => a.start - b.start);

    const breakData = breaks[barberId];
    let searchPointer = Math.max(nowMins, OPEN_TIME);

    // No hard upper limit - allow overtime
    const maxTime = 24 * 60;
    while (searchPointer + duration <= maxTime) {
      const bookingConflict = barberBookings.find(b =>
        (searchPointer >= b.start && searchPointer < b.end) ||
        (searchPointer + duration > b.start && searchPointer + duration <= b.end) ||
        (searchPointer <= b.start && searchPointer + duration >= b.end)
      );
      const breakConflict = breakData && searchPointer < breakData.endMins && searchPointer + duration > breakData.startMins;

      if (bookingConflict) {
        searchPointer = bookingConflict.end;
      } else if (breakConflict) {
        searchPointer = breakData!.endMins;
      } else {
        return searchPointer;
      }
    }
    return null;
  }, [appointments, breaks]);

  const addWalkIn = useCallback((barberId: string, name: string, serviceIds: string[], duration: number, price: number): string | null => {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const slot = getNextAvailableSlot(barberId, duration) ?? nowMins;

    const today = new Date().toISOString().split('T')[0];
    const maxQueue = appointments
      .filter(a => a.staffId === barberId && a.date === today)
      .reduce((max, a) => Math.max(max, a.queueNo), 0);
    const clientId = `WI-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    const clientName = name.trim() ? `${name.trim()} (${clientId})` : clientId;
    const newAppt: Appointment = {
      id: `w${Date.now()}`,
      clientName,
      clientPhone: '',
      bookingCount: 0,
      noShowCount: 0,
      staffId: barberId,
      serviceIds,
      date: new Date().toISOString().split('T')[0],
      scheduledTime: minsToTime(slot),
      duration,
      price,
      status: 'waiting',
      type: 'walkin',
      queueNo: maxQueue + 1,
    };
    setAppointments(prev => [...prev, newAppt]);
    return newAppt.id;
  }, [appointments, getNextAvailableSlot]);

  const setBreak = useCallback((staffId: string, durationMins: number) => {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    setBreaks(prev => ({ ...prev, [staffId]: { startMins: nowMins, endMins: nowMins + durationMins } }));
  }, []);

  const clearBreak = useCallback((staffId: string) => {
    // Truncate the break to actual elapsed time so the timeline reflects reality
    setBreaks(prev => {
      const current = prev[staffId];
      if (!current) return prev;
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();
      // If break already ended naturally, just clear it
      if (nowMins >= current.endMins) {
        return { ...prev, [staffId]: null };
      }
      // If cancelled before it even started (shouldn't happen but safe), clear
      if (nowMins <= current.startMins) {
        return { ...prev, [staffId]: null };
      }
      // Otherwise, snap end to now — preserves the historical block on the timeline
      return { ...prev, [staffId]: { ...current, endMins: nowMins, endedEarly: true } };
    });
  }, []);

  const getStaffLogs = useCallback((staffId: string) => {
    return serviceLogs.filter(l => l.staffId === staffId);
  }, [serviceLogs]);

  const addStaffMember = useCallback((data: { name: string; role: string; avatar: string; image?: string; phone?: string; email?: string }) => {
    const newStaff: StaffMember = {
      id: `s${Date.now()}`,
      name: data.name,
      initials: data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      avatar: data.avatar,
      image: data.image || '',
      role: data.role,
      status: 'free',
      earnings: { today: 0, week: 0, month: 0 },
      bookingsCompleted: 0,
      noShows: 0,
      rating: 0,
      reviews: [],
      skills: [],
    };
    setStaff(prev => [...prev, newStaff]);
  }, []);

  const undoComplete = useCallback((appointmentId: string) => {
    setServiceLogs(logs => {
      const log = logs.find(l => l.appointmentId === appointmentId);
      if (!log) return logs;
      // Roll back staff earnings + bookingsCompleted
      setStaff(prevStaff => prevStaff.map(s => s.id === log.staffId
        ? {
            ...s,
            earnings: {
              today: Math.max(0, s.earnings.today - log.price),
              week: Math.max(0, s.earnings.week - log.price),
              month: Math.max(0, s.earnings.month - log.price),
            },
            bookingsCompleted: Math.max(0, s.bookingsCompleted - 1),
          }
        : s
      ));
      // Restore appointment to 'serving'
      setAppointments(prev => prev.map(a => a.id === appointmentId
        ? { ...a, status: 'serving' as const, completedAt: undefined }
        : a
      ));
      return logs.filter(l => l.appointmentId !== appointmentId);
    });
  }, []);

  const undoCancel = useCallback((appointmentId: string) => {
    setAppointments(prev => prev.map(a => a.id === appointmentId
      ? { ...a, status: 'waiting' as const, cancelReason: undefined, cancelledAt: undefined }
      : a
    ));
  }, []);

  const getBreakConflicts = useCallback((staffId: string, startMins: number, endMins: number): Appointment[] => {
    return appointments.filter(a => {
      if (a.staffId !== staffId) return false;
      if (a.status === 'completed' || a.status === 'cancelled') return false;
      const aStart = timeToMins(a.scheduledTime);
      const aEnd = aStart + a.duration;
      return aStart < endMins && aEnd > startMins;
    });
  }, [appointments]);

  const takeLeave = useCallback((staffId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const alreadyTaken = leaves.some(l => l.staffId === staffId && l.date === today);
    if (alreadyTaken) return;
    setLeaves(prev => [...prev, { id: `lv-${Date.now()}`, staffId, date: today, takenAt: Date.now() }]);
  }, [leaves]);

  const getStaffLeaves = useCallback((staffId: string) => {
    return leaves.filter(l => l.staffId === staffId);
  }, [leaves]);

  const getStaffLeavesThisMonth = useCallback((staffId: string) => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return leaves.filter(l => {
      if (l.staffId !== staffId) return false;
      const d = new Date(l.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;
  }, [leaves]);

  const getStaffLeavesThisYear = useCallback((staffId: string) => {
    const year = new Date().getFullYear();
    return leaves.filter(l => l.staffId === staffId && new Date(l.date).getFullYear() === year).length;
  }, [leaves]);

  const activeStaff = staff.find(s => s.id === activeStaffId) ?? null;
  const staffAppointments = appointments.filter(a => a.staffId === activeStaffId);

  return (
    <PartnerContext.Provider value={{
      activeStaffId, staff, appointments, breaks, serviceLogs, leaves, setActiveStaff, toggleStaffStatus,
      updateAppointmentStatus, completeService, startService, addWalkIn, setBreak, clearBreak,
      getNextAvailableSlot, activeStaff, staffAppointments, getStaffLogs, addStaffMember,
      undoComplete, undoCancel, getBreakConflicts,
      takeLeave, getStaffLeavesThisMonth, getStaffLeavesThisYear, getStaffLeaves,
    }}>
      {children}
    </PartnerContext.Provider>
  );
};
