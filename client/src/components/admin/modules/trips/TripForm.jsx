import React, { useState } from 'react';
import SearchableSelect from '../../shared/SearchableSelect';
import Input from '../../../ui/Input';
import Button from '../../../ui/Button';
import { Calendar, Clock, Banknote, ShieldAlert, MapPin, Navigation } from 'lucide-react';

/**
 * TripForm - Manual entry version for Source, Destination and Routing Points.
 */
const TripForm = ({ buses = [], initialData, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState(initialData || {
    source: '',
    destination: '',
    routing_points: '',
    bus_id: '',
    departure_time: '',
    arrival_time: '',
    price: ''
  });
  const [errors, setErrors] = useState({});

  const validate = (data = formData) => {
    const newErrors = {};
    if (!data.source) newErrors.source = 'Source is required';
    if (!data.destination) newErrors.destination = 'Destination is required';
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

  const isFormValid = formData.source && formData.destination && formData.bus_id && formData.departure_time && formData.arrival_time && formData.price && Object.keys(errors).length === 0;

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
        <Input 
          label="Source City"
          placeholder="e.g. Hyderabad"
          value={formData.source}
          onChange={(e) => handleChange('source', e.target.value)}
          error={errors.source}
          required
        />
        <Input 
          label="Destination City"
          placeholder="e.g. Bangalore"
          value={formData.destination}
          onChange={(e) => handleChange('destination', e.target.value)}
          error={errors.destination}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Routing Points (Optional)"
          placeholder="e.g. Kurnool, Anantapur"
          value={formData.routing_points}
          onChange={(e) => handleChange('routing_points', e.target.value)}
          helperText="Comma separated list of intermediate stops"
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
