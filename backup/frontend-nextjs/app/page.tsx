'use client';

import React, { useState } from 'react';
import SiteResourceSelector from '../components/SiteResourceSelector';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import BookingForm from '../components/forms/BookingForm';
import MyBookings from '../components/MyBookings';
import { TimeSlot, Resource, BookingFormData, Booking } from '../types';
import toast, { Toaster } from 'react-hot-toast';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Branding */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ReservaFácil
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Sistema inteligente de reservas
                </p>
              </div>
            </div>
            
            {/* User Menu & Actions */}
            <div className="flex items-center space-x-3">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center space-x-6 mr-6">
                <div className="flex items-center space-x-2 text-sm">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">2 reservas hoy</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Próxima: 14:00</span>
                </div>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">María González</p>
                  <p className="text-xs text-gray-500">Desarrolladora</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center ring-2 ring-white shadow-lg">
                  <span className="text-white text-sm font-medium">MG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Quick Actions */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                ¡Hola María! 👋
              </h2>
              <p className="text-primary-100 text-lg mb-6">
                ¿Qué espacio necesitas reservar hoy?
              </p>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => handleSelectionChange('SCL', 'sala')}
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all hover:scale-105 border border-white/20"
                >
                  <BuildingOfficeIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Sala Santiago</span>
                </button>
                <button 
                  onClick={() => handleSelectionChange('SCL', 'parking')}
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all hover:scale-105 border border-white/20"
                >
                  <MapPinIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Parking Santiago</span>
                </button>
                <button 
                  onClick={() => handleSelectionChange('LSC', 'sala')}
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all hover:scale-105 border border-white/20"
                >
                  <SparklesIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Sala Ejecutiva</span>
                </button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-primary-100 text-sm">Reservas este mes</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">24h</p>
                    <p className="text-primary-100 text-sm">Tiempo total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Site Selection and Calendar */}
          <div className="xl:col-span-3 space-y-8">
            {/* Site and Resource Selector */}
            <div className="animate-fade-in">
              <SiteResourceSelector
                selectedSiteId={selectedSiteId}
                selectedResourceType={selectedResourceType}
                onSelectionChange={handleSelectionChange}
              />
            </div>

            {/* Availability Calendar */}
            {selectedSiteId && selectedResourceType && (
              <div className="animate-slide-up">
                <AvailabilityCalendar
                  siteId={selectedSiteId}
                  resourceType={selectedResourceType}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  onTimeSlotSelect={handleTimeSlotSelect}
                />
              </div>
            )}

            {/* Enhanced Empty State */}
            {(!selectedSiteId || !selectedResourceType) && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-soft border border-gray-100 animate-fade-in">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarIcon className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Comienza tu reserva
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                  Selecciona una sede y el tipo de espacio que necesitas.
                  Te mostraremos todas las opciones disponibles.
                </p>
                
                {/* Feature highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <ClockIcon className="w-6 h-6 text-success-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Tiempo real</h4>
                    <p className="text-sm text-gray-600">Disponibilidad actualizada al instante</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <UserIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Fácil gestión</h4>
                    <p className="text-sm text-gray-600">Modifica o cancela en cualquier momento</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <SparklesIcon className="w-6 h-6 text-warning-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Sin conflictos</h4>
                    <p className="text-sm text-gray-600">Sistema inteligente anti-solapamiento</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - My Bookings */}
          <div className="space-y-6 animate-fade-in">
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

      {/* Toast Container - Modern Design */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'font-medium',
          style: {
            background: 'white',
            color: '#374151',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: 'white',
            },
            style: {
              borderLeft: '4px solid #22C55E',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
            style: {
              borderLeft: '4px solid #EF4444',
            },
          },
          loading: {
            iconTheme: {
              primary: '#3B82F6',
              secondary: 'white',
            },
            style: {
              borderLeft: '4px solid #3B82F6',
            },
          },
        }}
      />
    </div>
  );
}