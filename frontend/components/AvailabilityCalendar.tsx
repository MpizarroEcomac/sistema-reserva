'use client';

import React, { useState, useEffect } from 'react';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import { TimeSlot as APITimeSlot, Resource as APIResource, resourcesApi, formatDateForAPI } from '../lib/api';
import { Card, Button, Badge } from './ui';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

// Definir interfaz local para compatibilidad con el componente existente
interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  bookingId?: number;
}

interface AvailabilityCalendarProps {
  siteId: string;
  resourceType: string;
  onTimeSlotSelect?: (resourceId: string, timeSlot: TimeSlot) => void;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  siteId,
  resourceType,
  onTimeSlotSelect,
  selectedDate = new Date(),
  onDateChange,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [resources, setResources] = useState<APIResource[]>([]);
  const [availability, setAvailability] = useState<Record<string, TimeSlot[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Generate time slots for a day (8:00 AM to 8:00 PM in 30-minute intervals)
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 8; // 8:00 AM
    const endHour = 20; // 8:00 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes of [0, 30]) {
        const start = new Date(date);
        start.setHours(hour, minutes, 0, 0);
        
        const end = new Date(start);
        end.setMinutes(start.getMinutes() + 30);
        
        slots.push({
          start: start.toISOString(),
          end: end.toISOString(),
          available: Math.random() > 0.3, // Mock availability - 70% chance of being available
        });
      }
    }
    
    return slots;
  };

  // Cargar recursos y disponibilidad desde las APIs
  useEffect(() => {
    if (!siteId || !resourceType) return;

    const loadResourcesAndAvailability = async () => {
      try {
        setIsLoading(true);
        
        // Cargar recursos por tipo y sede
        const resourcesData = await resourcesApi.getByType(resourceType);
        const filteredResources = resourcesData.filter(r => r.siteId === siteId);
        
        setResources(filteredResources);
        
        // Cargar disponibilidad para cada recurso en paralelo
        const dateStr = formatDateForAPI(currentDate);
        const availabilityPromises = filteredResources.map(async (resource) => {
          try {
            const availability = await resourcesApi.getAvailability(resource.id, dateStr);
            return {
              resourceId: resource.id,
              slots: availability.timeSlots.map((slot: APITimeSlot) => ({
                start: `${dateStr}T${slot.startTime}:00.000Z`,
                end: `${dateStr}T${slot.endTime}:00.000Z`,
                available: slot.available,
                bookingId: slot.bookingId,
              })),
            };
          } catch (error) {
            console.error(`Error loading availability for ${resource.id}:`, error);
            return {
              resourceId: resource.id,
              slots: [],
            };
          }
        });
        
        const availabilityResults = await Promise.all(availabilityPromises);
        const newAvailability: Record<string, TimeSlot[]> = {};
        
        availabilityResults.forEach(result => {
          newAvailability[result.resourceId] = result.slots;
        });
        
        setAvailability(newAvailability);
      } catch (error) {
        console.error('Error loading resources:', error);
        toast.error('Error al cargar los recursos y disponibilidad');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadResourcesAndAvailability();
  }, [siteId, resourceType, currentDate]);

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
    onDateChange?.(newDate);
  };

  const handlePreviousDay = () => {
    const previousDay = addDays(currentDate, -1);
    handleDateChange(previousDay);
  };

  const handleNextDay = () => {
    const nextDay = addDays(currentDate, 1);
    handleDateChange(nextDay);
  };

  const handleTimeSlotClick = (resourceId: string, timeSlot: TimeSlot) => {
    if (timeSlot.available) {
      onTimeSlotSelect?.(resourceId, timeSlot);
    }
  };

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), 'HH:mm');
  };

  const formatDate = (date: Date) => {
    return format(date, 'EEEE, d \'de\' MMMM \'de\' yyyy', { locale: es });
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 12 }).map((_, j) => (
                    <div key={j} className="h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Disponibilidad
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousDay}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextDay}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Date Display */}
        <div className="text-center">
          <h4 className="text-xl font-semibold text-gray-900 capitalize">
            {formatDate(currentDate)}
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            Selecciona un horario disponible para reservar
          </p>
        </div>

        {/* Resources and Time Slots */}
        <div className="space-y-6">
          {resources.map((resource) => (
            <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
              {/* Resource Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {resource.name}
                    </h5>
                    <p className="text-sm text-gray-500">
                      {resource.location}
                      {resource.capacity && ` • Capacidad: ${resource.capacity} personas`}
                    </p>
                  </div>
                </div>
                
                {/* Resource Features */}
                <div className="flex items-center space-x-2">
                  {resource.config?.hasProjector && (
                    <Badge size="sm">Proyector</Badge>
                  )}
                  {resource.config?.hasVideoConference && (
                    <Badge size="sm">Videoconf.</Badge>
                  )}
                  {resource.config?.isAccessible && (
                    <Badge size="sm">Accesible</Badge>
                  )}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                {availability[resource.id]?.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeSlotClick(resource.id, slot)}
                    disabled={!slot.available}
                    className={clsx(
                      'p-2 text-xs font-medium rounded transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-offset-1',
                      slot.available
                        ? 'bg-success-100 text-success-800 border border-success-200 hover:bg-success-200 focus:ring-success-500 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed',
                      slot.booking && 'bg-error-100 text-error-800 border-error-200'
                    )}
                    title={slot.available ? 'Disponible' : 'No disponible'}
                  >
                    <div className="flex flex-col items-center">
                      <ClockIcon className="h-3 w-3 mb-1" />
                      <span>{formatTime(slot.start)}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center space-x-4 mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-success-200 rounded"></div>
                  <span className="text-xs text-gray-600">Disponible</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <span className="text-xs text-gray-600">No disponible</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-error-200 rounded"></div>
                  <span className="text-xs text-gray-600">Ocupado</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {resources.length === 0 && (
          <div className="text-center py-8">
            <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              No se encontraron recursos para mostrar
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Selecciona una sede y tipo de recurso para ver la disponibilidad
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AvailabilityCalendar;