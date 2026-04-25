import React, { useState } from 'react';
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import { Bus, Settings2, ShieldCheck, Zap } from 'lucide-react';

/**
 * BusForm for Fleet Management.
 */
const BusForm = ({ initialData, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    category: 'Delux',
    busSubType: '2+2 Layout',
    vehicle_number: '',
    total_seats: 40,
    status: 'active'
  });
  const [errors, setErrors] = useState({});

  const validate = (data = formData) => {
    const newErrors = {};
    if (!data.name) newErrors.name = 'Operator/Bus name is required';
    if (!data.vehicle_number) newErrors.vehicle_number = 'Vehicle number is required';
    if (!data.total_seats || data.total_seats < 1) newErrors.total_seats = 'Valid seat count required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    // Real-time validation
    validate(newData);
  };

  const isFormValid = formData.name && formData.vehicle_number && formData.total_seats > 0 && Object.keys(errors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="md:col-span-2">
         <Input 
           label="Operator / Fleet Name"
           placeholder="e.g. Greenline Volvo"
           value={formData.name}
           onChange={(e) => handleChange('name', e.target.value)}
           error={errors.name}
           required
         />
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Vehicle Category</label>
            <select 
              className="w-full bg-slate-50 border-2 border-transparent focus:border-primary-500 rounded-2xl p-4 text-sm font-bold focus:outline-none transition-all"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="Delux">Delux (2+2)</option>
              <option value="Luxury">Luxury Sleeper</option>
              <option value="AC">AC Semi-Sleeper</option>
              <option value="Non-AC">Non-AC Seater</option>
            </select>
         </div>
         <Input 
            label="Total Capacity (Seats)"
            type="number"
            value={formData.total_seats}
            onChange={(e) => handleChange('total_seats', parseInt(e.target.value))}
            error={errors.total_seats}
            required
         />
      </div>

      <div className="grid grid-cols-2 gap-6">
         <Input 
            label="Vehicle Number Plate"
            placeholder="KA 04 XY 1234"
            value={formData.vehicle_number}
            onChange={(e) => handleChange('vehicle_number', e.target.value)}
            error={errors.vehicle_number}
            required
         />
         <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Fleet Status</label>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
               <button
                  type="button"
                  onClick={() => handleChange('status', 'active')}
                  className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'active' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400'}`}
               >
                  Active
               </button>
               <button
                  type="button"
                  onClick={() => handleChange('status', 'inactive')}
                  className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === 'inactive' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400'}`}
               >
                  Inactive
               </button>
            </div>
         </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-slate-100">
        <Button 
          type="button" 
          variant="secondary" 
          fullWidth 
          onClick={onCancel}
          className="uppercase tracking-widest font-black"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          fullWidth 
          shadow
          disabled={!isFormValid}
          className="uppercase tracking-widest font-black disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
        >
          {isEditing ? 'Save Changes' : 'Register Vehicle'}
        </Button>
      </div>
    </form>
  );
};

export default BusForm;
