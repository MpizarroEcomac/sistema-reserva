'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BookmarkIcon, UserGroupIcon, TruckIcon } from '@heroicons/react/24/outline';
import { BookingFormData, TimeSlot, Resource } from '../../types';
import { Card, Button, Input, Modal } from '../ui';

interface BookingFormProps {
  resource: Resource;
  timeSlot: TimeSlot;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
  isLoading?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  resource,
  timeSlot,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [attendeeEmails, setAttendeeEmails] = useState<string[]>(['']);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<BookingFormData>();

  const isParking = resource.resourceType?.code === 'parking';
  const watchedAttendeeCount = watch('attendeeCount');

  const handleFormSubmit = (data: BookingFormData) => {
    const formData: BookingFormData = {
      ...data,
      siteId: resource.siteId,
      resourceId: resource.id,
      startTime: timeSlot.start,
      endTime: timeSlot.end,
      attendees: attendeeEmails.filter(email => email.trim() !== ''),
    };
    
    onSubmit(formData);
  };

  const handleClose = () => {
    reset();
    setAttendeeEmails(['']);
    onClose();
  };

  const addAttendeeEmail = () => {
    setAttendeeEmails([...attendeeEmails, '']);
  };

  const removeAttendeeEmail = (index: number) => {
    setAttendeeEmails(attendeeEmails.filter((_, i) => i !== index));
  };

  const updateAttendeeEmail = (index: number, email: string) => {
    const newEmails = [...attendeeEmails];
    newEmails[index] = email;
    setAttendeeEmails(newEmails);
  };

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), 'HH:mm');
  };

  const formatDate = (timeString: string) => {
    return format(new Date(timeString), 'EEEE, d \'de\' MMMM', { locale: es });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nueva Reserva"
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Booking Summary */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <BookmarkIcon className="h-5 w-5 text-primary-600" />
            <h4 className="font-semibold text-primary-900">Detalles de la Reserva</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-primary-700 font-medium">Recurso:</span>
              <p className="text-primary-900">{resource.name}</p>
              <p className="text-primary-600">{resource.location}</p>
            </div>
            
            <div>
              <span className="text-primary-700 font-medium">Horario:</span>
              <p className="text-primary-900 capitalize">
                {formatDate(timeSlot.start)}
              </p>
              <p className="text-primary-900">
                {formatTime(timeSlot.start)} - {formatTime(timeSlot.end)}
              </p>
            </div>
          </div>
        </div>

        {/* Purpose Field */}
        <Input
          label="Propósito de la reserva"
          placeholder={isParking ? "Ej: Reunión con cliente" : "Ej: Reunión de equipo de desarrollo"}
          {...register('purpose', {
            required: 'El propósito es obligatorio',
            minLength: {
              value: 5,
              message: 'El propósito debe tener al menos 5 caracteres'
            },
            maxLength: {
              value: 500,
              message: 'El propósito no puede exceder 500 caracteres'
            }
          })}
          error={errors.purpose?.message}
          required
        />

        {/* Attendee Count for Meeting Rooms */}
        {!isParking && (
          <Input
            label="Número de asistentes"
            type="number"
            min="1"
            max={resource.capacity || 50}
            placeholder="Ej: 5"
            {...register('attendeeCount', {
              min: {
                value: 1,
                message: 'Debe haber al menos 1 asistente'
              },
              max: {
                value: resource.capacity || 50,
                message: `No puede exceder la capacidad de ${resource.capacity || 50} personas`
              }
            })}
            error={errors.attendeeCount?.message}
            helpText={`Capacidad máxima: ${resource.capacity || 50} personas`}
          />
        )}

        {/* Attendee Emails */}
        {!isParking && watchedAttendeeCount && parseInt(watchedAttendeeCount.toString()) > 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserGroupIcon className="inline h-4 w-4 mr-1" />
              Correos de asistentes (opcional)
            </label>
            
            <div className="space-y-2">
              {attendeeEmails.map((email, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder={`Correo del asistente ${index + 1}`}
                    value={email}
                    onChange={(e) => updateAttendeeEmail(index, e.target.value)}
                    className="flex-1"
                  />
                  {attendeeEmails.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAttendeeEmail(index)}
                    >
                      Quitar
                    </Button>
                  )}
                </div>
              ))}
              
              {attendeeEmails.length < parseInt(watchedAttendeeCount.toString()) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAttendeeEmail}
                >
                  + Agregar correo
                </Button>
              )}
            </div>
          </div>
        )}

        {/* License Plate for Parking */}
        {isParking && (
          <Input
            label="Patente del vehículo"
            placeholder="Ej: ABCD12"
            {...register('licensePlate', {
              required: isParking ? 'La patente es obligatoria para estacionamientos' : false,
              pattern: {
                value: /^[A-Z0-9]{4,8}$/i,
                message: 'Ingresa una patente válida (4-8 caracteres alfanuméricos)'
              }
            })}
            error={errors.licensePlate?.message}
            icon={<TruckIcon className="h-5 w-5" />}
            required={isParking}
            helpText="Formato: ABCD12 (sin guiones ni espacios)"
          />
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas adicionales (opcional)
          </label>
          <textarea
            {...register('notes', {
              maxLength: {
                value: 500,
                message: 'Las notas no pueden exceder 500 caracteres'
              }
            })}
            className="input resize-none"
            rows={3}
            placeholder={isParking ? 
              "Ej: Requiero acceso temprano al edificio" : 
              "Ej: Necesitamos configuración especial del proyector"
            }
          />
          {errors.notes && (
            <p className="mt-2 text-sm text-error-600">
              {errors.notes.message}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creando reserva...' : 'Crear Reserva'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookingForm;