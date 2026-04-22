import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../ui/Input';
import { User, Calendar, Users } from 'lucide-react';

/**
 * Passenger form fields for a single seat.
 * Rendered inside a react-hook-form FormProvider context.
 */
const PassengerFormRow = ({ index, seatId }) => {
  const { register, formState: { errors } } = useFormContext();
  const base = `passengers.${index}`;
  const err = errors?.passengers?.[index];

  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-primary-600" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Seat {seatId} — Passenger {index + 1}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Hidden seat ID field */}
        <input type="hidden" {...register(`${base}.seatId`)} value={seatId} />

        {/* Name */}
        <div className="sm:col-span-1">
          <Input
            label="Full Name"
            placeholder="e.g. Rahul Sharma"
            leftIcon={<User className="w-4 h-4" />}
            error={err?.name?.message}
            required
            {...register(`${base}.name`, {
              required: 'Name is required',
              minLength: { value: 2, message: 'Min 2 characters' },
            })}
          />
        </div>

        {/* Age */}
        <div>
          <Input
            label="Age"
            type="number"
            placeholder="e.g. 28"
            leftIcon={<Calendar className="w-4 h-4" />}
            error={err?.age?.message}
            required
            {...register(`${base}.age`, {
              required: 'Age is required',
              min: { value: 1, message: 'Min age: 1' },
              max: { value: 120, message: 'Max age: 120' },
              valueAsNumber: true,
            })}
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">
            Gender <span className="text-primary-500">*</span>
          </label>
          <div className="relative">
            <Users className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              className={[
                'w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-white transition-colors',
                err?.gender ? 'border-red-400' : 'border-slate-200 hover:border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
              ].join(' ')}
              {...register(`${base}.gender`, { required: 'Gender is required' })}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          {err?.gender && <p className="text-xs text-red-500">⚠ {err.gender.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default PassengerFormRow;
