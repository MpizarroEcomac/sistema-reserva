'use client';

import React, { useState } from 'react';
import SiteResourceSelector from '../components/SiteResourceSelector';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import BookingForm from '../components/forms/BookingForm';
import MyBookings from '../components/MyBookings';
import { TimeSlot, Resource, BookingFormData, Booking } from '../types';
import toast, { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const handleSelectionChange = (siteId: string, resourceType?: string) => {
    setSelectedSiteId(siteId);
    setSelectedResourceType(resourceType || '');
  };

  const handleTimeSlotSelect = (resourceId: string, timeSlot: TimeSlot) => {
    // En una implementación real, obtendríamos el recurso completo de la API
    const mockResource: Resource = {
      id: resourceId,
      name: resourceId.includes('S') ? `Sala ${resourceId.split('-')[1]}` : `Parking ${resourceId.split('-')[1]}`,
      description: resourceId.includes('S') ? 'Sala de reuniones' : 'Espacio de estacionamiento',
      location: 'Ubicación de ejemplo',
      capacity: resourceId.includes('S') ? 10 : undefined,
      isActive: true,
      config: resourceId.includes('S') ? { hasProjector: true } : { isAccessible: true },
      siteId: resourceId.split('-')[0],
      resourceTypeId: resourceId.includes('S') ? 1 : 2,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      resourceType: {
        id: resourceId.includes('S') ? 1 : 2,
        code: resourceId.includes('S') ? 'sala' : 'parking',
        name: resourceId.includes('S') ? 'Sala de reuniones' : 'Estacionamiento',
        icon: resourceId.includes('S') ? '🏢' : '🚗',
        color: resourceId.includes('S') ? '#3B82F6' : '#10B981',
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    };

    setSelectedResource(mockResource);
    setSelectedTimeSlot(timeSlot);
    setBookingFormOpen(true);
  };

  const handleBookingSubmit = async (data: BookingFormData) => {
    setIsBookingLoading(true);
    
    try {
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('¡Reserva creada exitosamente!', {
        duration: 4000,
      });
      
      setBookingFormOpen(false);
      setSelectedResource(null);
      setSelectedTimeSlot(null);
      
      console.log('Booking data:', data);
    } catch (error) {
      toast.error('Error al crear la reserva. Intenta nuevamente.');
      console.error('Error creating booking:', error);
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleBookingFormClose = () => {
    setBookingFormOpen(false);
    setSelectedResource(null);
    setSelectedTimeSlot(null);
  };

  const handleEditBooking = (booking: Booking) => {
    toast.info('Funcionalidad de edición en desarrollo');
    console.log('Edit booking:', booking);
  };

  const handleCancelBooking = (booking: Booking) => {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      toast.success('Reserva cancelada exitosamente');
      console.log('Cancel booking:', booking);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sistema de Reservas
              </h1>
              <p className="text-sm text-gray-600">
                Reserva salas de reuniones y estacionamientos
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin Usuario</p>
                <p className="text-xs text-gray-500">admin@empresa.com</p>
              </div>
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Site Selection and Calendar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Site and Resource Selector */}
            <SiteResourceSelector
              selectedSiteId={selectedSiteId}
              selectedResourceType={selectedResourceType}
              onSelectionChange={handleSelectionChange}
            />

            {/* Availability Calendar */}
            {selectedSiteId && selectedResourceType && (
              <AvailabilityCalendar
                siteId={selectedSiteId}
                resourceType={selectedResourceType}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onTimeSlotSelect={handleTimeSlotSelect}
              />
            )}

            {/* Empty State */}
            {(!selectedSiteId || !selectedResourceType) && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Selecciona una sede y tipo de recurso
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Elige una sede y el tipo de recurso que deseas reservar para ver la disponibilidad
                  y crear tu reserva.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - My Bookings */}
          <div className="space-y-6">
            <MyBookings
              userId={1}
              onEdit={handleEditBooking}
              onCancel={handleCancelBooking}
            />
          </div>
        </div>
      </main>

      {/* Booking Form Modal */}
      {selectedResource && selectedTimeSlot && (
        <BookingForm
          resource={selectedResource}
          timeSlot={selectedTimeSlot}
          isOpen={bookingFormOpen}
          onClose={handleBookingFormClose}
          onSubmit={handleBookingSubmit}
          isLoading={isBookingLoading}
        />
      )}

      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </div>
  );
}