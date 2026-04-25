import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, MapPin, Navigation } from 'lucide-react';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import SearchableSelect from '../../shared/SearchableSelect';
import { useAdminStore } from '../../../../store/useAdminStore';
import { toast } from 'react-hot-toast';

/**
 * RouteForm for creating Route Templates.
 * Manages Source, Destination, and a dynamic list of intermediate stops.
 */
const RouteForm = ({ initialData, onSave, onCancel, isEditing, isSubmitting }) => {
  const locations = useAdminStore((s) => s.locations);
  
  const [formData, setFormData] = useState(initialData || {
    name: '',
    source: '',
    destination: '',
    stops: []
  });

  const locationOptions = locations.map(loc => ({
    label: loc,
    value: loc
  }));

  // Logic: Mutually exclusive options
  const sourceOptions = locationOptions.filter(opt => opt.value !== formData.destination);
  const destinationOptions = locationOptions.filter(opt => opt.value !== formData.source);

  const [errors, setErrors] = useState({});

  const validate = (data = formData) => {
    const newErrors = {};
    if (!data.name) newErrors.name = 'Route Name is required';
    if (!data.source) newErrors.source = 'Source is required';
    if (!data.destination) newErrors.destination = 'Destination is required';
    if (data.source && data.destination && data.source.toLowerCase() === data.destination.toLowerCase()) {
      newErrors.destination = 'Source and Destination must be distinct';
      toast.error("Source and destination cannot be identical");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    validate(newData);
  };

  const isFormValid = formData.name && formData.source && formData.destination && Object.keys(errors).length === 0;

  const handleAddStop = () => {
    setFormData({
      ...formData,
      stops: [...formData.stops, { location: '', order: formData.stops.length + 1 }]
    });
  };

  const handleRemoveStop = (index) => {
    const newStops = formData.stops.filter((_, i) => i !== index)
      .map((stop, i) => ({ ...stop, order: i + 1 }));
    setFormData({ ...formData, stops: newStops });
  };

  const handleUpdateStop = (index, value) => {
    const newStops = [...formData.stops];
    newStops[index].location = value;
    setFormData({ ...formData, stops: newStops });
  };

  const handleMoveStop = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.stops.length - 1) return;

    const newStops = [...formData.stops];
    const itemToMove = newStops[index];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = itemToMove;

    const finalStops = newStops.map((s, i) => ({ ...s, order: i + 1 }));
    setFormData({ ...formData, stops: finalStops });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate() && !isSubmitting) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
           <Input 
             label="Route Designator (Name)"
             placeholder="e.g. South Express A1"
             value={formData.name}
             onChange={(e) => handleChange('name', e.target.value)}
             error={errors.name}
             required
             disabled={isSubmitting}
           />
        </div>
        
        <SearchableSelect 
          label="Source City"
          placeholder="Select source city..."
          options={sourceOptions}
          value={formData.source}
          onChange={(val) => handleChange('source', val)}
          error={errors.source}
          required
          disabled={isSubmitting}
        />
        
        <SearchableSelect 
          label="Destination City"
          placeholder="Select destination city..."
          options={destinationOptions}
          value={formData.destination}
          onChange={(val) => handleChange('destination', val)}
          error={errors.destination}
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Stops */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Intermediate Boarding Points</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Order determines the transit logic</p>
          </div>
          <button
            type="button"
            onClick={handleAddStop}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-100 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add Stop
          </button>
        </div>

        <div className="space-y-3">
          {formData.stops.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-300">
               <Navigation className="w-10 h-10 mb-2 opacity-20" />
               <p className="text-xs font-bold italic uppercase tracking-widest">No intermediate stops defined for this template</p>
            </div>
          ) : (
            formData.stops.map((stop, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-in slide-in-from-right-4 duration-300"
              >
                <div className="flex flex-col gap-1 items-center justify-center">
                   <button 
                     type="button" 
                     onClick={() => handleMoveStop(index, 'up')}
                     disabled={index === 0 || isSubmitting}
                     className="text-slate-300 hover:text-primary-500 disabled:opacity-30 p-1"
                   >
                     <ArrowUp className="w-4 h-4" />
                   </button>
                   <span className="text-[10px] font-black text-slate-400">{index + 1}</span>
                   <button 
                     type="button" 
                     onClick={() => handleMoveStop(index, 'down')}
                     disabled={index === formData.stops.length - 1 || isSubmitting}
                     className="text-slate-300 hover:text-primary-500 disabled:opacity-30 p-1"
                   >
                     <ArrowDown className="w-4 h-4" />
                   </button>
                </div>

                <div className="flex-1 relative group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 outline-none text-sm font-bold text-slate-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all disabled:bg-slate-50"
                    placeholder="Enter boarding point name..."
                    value={stop.location}
                    onChange={(e) => handleUpdateStop(index, e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveStop(index)}
                  disabled={isSubmitting}
                  className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-30"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-slate-100">
        <Button 
          type="button" 
          variant="secondary" 
          fullWidth 
          onClick={onCancel}
          disabled={isSubmitting}
          className="uppercase tracking-widest font-black"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          fullWidth 
          shadow
          disabled={!isFormValid || isSubmitting}
          className="uppercase tracking-widest font-black disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            isEditing ? 'Save Template' : 'Create Route'
          )}
        </Button>
      </div>
    </form>
  );
};

export default RouteForm;
