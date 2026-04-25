import React, { useState } from 'react';
import SearchableSelect from '../../shared/SearchableSelect';
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import { Calendar, Clock, Banknote, ShieldAlert } from 'lucide-react';

/**
 * TripForm - Used to schedule an instance of a Route.
 * Prevents manual data entry by selecting from existing Routes and Buses.
 */
const TripForm = ({ routes = [], buses = [], initialData, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState(initialData || {
    route_id: '',
    bus_id: '',
    departure_time: '',
    arrival_time: '',
    price: ''
  });
  const [errors, setErrors] = useState({});

  const validate = (data = formData) => {
    const newErrors = {};
    if (!data.route_id) newErrors.route_id = 'Route is required';
    if (!data.bus_id) newErrors.bus_id = 'Vehicle assignment is required';
    if (!data.departure_time) newErrors.departure_time = 'Departure time is required';
    if (!data.arrival_time) newErrors.arrival_time = 'Arrival time is required';
    if (!data.price) newErrors.price = 'Base ticket price is required';

    if (data.departure_time && data.arrival_time) {
      if (new Date(data.departure_time) >= new Date(data.arrival_time)) {
        newErrors.arrival_time = 'Arrival must be after departure';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    validate(newData);
  };

  const isFormValid = formData.route_id && formData.bus_id && formData.departure_time && formData.arrival_time && formData.price && Object.keys(errors).length === 0;

  // Prepare options for SearchableSelect
  const routeOptions = routes.map(r => ({
    value: r.id,
    label: r.name || `${r.source} to ${r.destination}`,
    sublabel: `${r.source} → ${r.destination}`
  }));

  const busOptions = buses.map(b => ({
    value: b.id,
    label: b.name,
    sublabel: `${b.vehicle_number} | ${b.total_seats} Seats`
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SearchableSelect 
          label="Select Network Route"
          options={routeOptions}
          value={formData.route_id}
          onChange={(val) => handleChange('route_id', val)}
          placeholder="Search defined routes..."
          error={errors.route_id}
          required
        />
        
        <SearchableSelect 
          label="Assign Available Vehicle"
          options={busOptions}
          value={formData.bus_id}
          onChange={(val) => handleChange('bus_id', val)}
          placeholder="Search fleet..."
          error={errors.bus_id}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group">
          <Calendar className="absolute left-4 top-14 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 z-10 pointer-events-none" />
          <Input 
            label="Departure Date & Time"
            type="datetime-local"
            value={formData.departure_time}
            onChange={(e) => handleChange('departure_time', e.target.value)}
            error={errors.departure_time}
            className="pl-12"
            required
          />
        </div>

        <div className="relative group">
          <Clock className="absolute left-4 top-14 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 z-10 pointer-events-none" />
          <Input 
            label="Expected Arrival Date & Time"
            type="datetime-local"
            value={formData.arrival_time}
            onChange={(e) => handleChange('arrival_time', e.target.value)}
            error={errors.arrival_time}
            className="pl-12"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group">
          <Banknote className="absolute left-4 top-14 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 z-10 pointer-events-none" />
          <Input 
            label="Base Fare (Price per seat)"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            error={errors.price}
            className="pl-12"
            required
          />
        </div>
        
        <div className="flex items-center gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100 self-end h-[72px]">
           <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
           <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase tracking-tighter">
             System will check for bus availability & overlaps upon launching.
           </p>
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
          {isEditing ? 'Update Schedule' : 'Launch Trip'}
        </Button>
      </div>
    </form>
  );
};

export default TripForm;
