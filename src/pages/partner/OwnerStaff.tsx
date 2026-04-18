import { useState, useRef } from 'react';
import { usePartner } from '@/contexts/PartnerContext';
import { Star, Plus, MoreVertical, Camera, X } from 'lucide-react';
import ActionDrawer from '@/components/partner/ActionDrawer';
import CustomerTypeBadges from '@/components/partner/CustomerTypeBadges';

const OwnerStaff = () => {
  const { staff, appointments, addStaffMember, getStaffLeavesThisMonth } = usePartner();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', role: 'Barber', phone: '', email: '', specialties: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addStaffMember({
      name: form.name.trim(),
      role: form.role,
      avatar: '',
      image: imagePreview || '',
      phone: form.phone,
      email: form.email,
    });
    setForm({ name: '', role: 'Barber', phone: '', email: '', specialties: '' });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setDrawerOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-safe">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Staff Directory</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your team, track performance, and oversee availability.</p>
      </div>

      <button
        onClick={() => setDrawerOpen(true)}
        className="w-full py-3 rounded-xl border-2 border-dashed border-primary/40 text-primary text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Staff Member
      </button>

      <div className="flex flex-col gap-4">
        {staff.map(s => {
          const staffAppts = appointments.filter(a => a.staffId === s.id);
          const onlineCount = staffAppts.filter(a => a.type === 'online').length;
          const walkinCount = staffAppts.filter(a => a.type === 'walkin').length;
          const leavesThisMonth = getStaffLeavesThisMonth(s.id);

          return (
            <div key={s.id} className="bg-card rounded-2xl p-4 card-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-full overflow-hidden bg-secondary border-2 ${
                  s.status === 'busy' ? 'border-destructive' : 'border-emerald-500'
                }`}>
                  {s.image ? (
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                      {s.initials}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.role}</p>
                </div>
                <button className="p-1 text-muted-foreground">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-secondary/50 rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Today</p>
                  <p className="text-lg font-bold text-foreground">₹{s.earnings.today.toLocaleString('en-IN') || '—'}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Leaves (Month)</p>
                  <p className="text-lg font-bold text-foreground">{leavesThisMonth}</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Month</p>
                  <p className="text-lg font-bold text-foreground">₹{(s.earnings.month / 1000).toFixed(1)}k</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">Customers</p>
                  <CustomerTypeBadges onlineCount={onlineCount} walkinCount={walkinCount} size="sm" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Staff Drawer */}
      <ActionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Staff Member" description="Onboard a new team member">
        <div className="flex flex-col gap-4">
          {/* Photo upload */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-xs text-muted-foreground font-medium">Profile Photo</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full overflow-hidden bg-secondary border-2 border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center group"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                    <Camera className="w-5 h-5" />
                    <span className="text-[9px] font-medium">Upload</span>
                  </div>
                )}
              </button>
              {imagePreview && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Full Name *</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Arjun Sharma"
              className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Role</label>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground"
            >
              <option>Barber</option>
              <option>Senior Stylist</option>
              <option>Master Stylist</option>
              <option>Junior Stylist</option>
              <option>Trainee</option>
              <option>Nail Technician</option>
              <option>Spa Therapist</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Phone Number</label>
            <input
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="9876543210"
              type="tel"
              className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Email (optional)</label>
            <input
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="staff@salon.com"
              type="email"
              className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={!form.name.trim()}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm active:scale-95 transition-transform disabled:opacity-30"
          >
            Add to Team
          </button>
        </div>
      </ActionDrawer>
    </div>
  );
};

export default OwnerStaff;
