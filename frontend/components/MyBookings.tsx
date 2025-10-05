'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  MapPinIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { Booking, BookingStatus } from '../types';
import { Card, Button, Badge, Modal } from './ui';
import { clsx } from 'clsx';

interface MyBookingsProps {
  userId?: number;
  onEdit?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
}

const MyBookings: React.FC<MyBookingsProps> = ({
  userId,
  onEdit,
  onCancel,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data - En producción esto vendría de la API
  useEffect(() => {
    setTimeout(() => {
      const mockBookings: Booking[] = [
        {
          id: 1,
          startTime: '2025-10-05T10:00:00Z',
          endTime: '2025-10-05T11:00:00Z',
          timeRange: '[2025-10-05 10:00:00+00,2025-10-05 11:00:00+00)',
          purpose: 'Reunión de equipo de desarrollo',
          attendeeCount: 5,
          attendees: ['juan@empresa.com', 'maria@empresa.com'],
          status: BookingStatus.ACTIVE,
          notes: 'Necesitamos el proyector configurado',
          createdAt: '2025-10-04T15:00:00Z',
          updatedAt: '2025-10-04T15:00:00Z',
          resourceId: 'SCL-S1',
          userId: 1,
          createdById: 1,
          resource: {
            id: 'SCL-S1',
            name: 'Sala 1',
            description: 'Sala de reuniones principal',
            capacity: 10,
            location: 'Piso 1, Ala Norte',
            isActive: true,
            config: { hasProjector: true },
            siteId: 'SCL',
            resourceTypeId: 1,
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            site: {
              id: 'SCL',
              name: 'Santiago Centro',
              timezone: 'America/Santiago',
              isActive: true,
              createdAt: '2025-01-01T00:00:00Z',
              updatedAt: '2025-01-01T00:00:00Z',
            },
            resourceType: {
              id: 1,
              code: 'sala',
              name: 'Sala de reuniones',
              icon: '🏢',
              color: '#3B82F6',
              isActive: true,
              createdAt: '2025-01-01T00:00:00Z',
              updatedAt: '2025-01-01T00:00:00Z',
            },
          },
        },
        {
          id: 2,
          startTime: '2025-10-06T14:00:00Z',
          endTime: '2025-10-06T18:00:00Z',
          timeRange: '[2025-10-06 14:00:00+00,2025-10-06 18:00:00+00)',
          purpose: 'Reunión con cliente',
          licensePlate: 'ABCD12',
          status: BookingStatus.ACTIVE,
          createdAt: '2025-10-04T12:00:00Z',
          updatedAt: '2025-10-04T12:00:00Z',
          resourceId: 'SCL-P01',
          userId: 1,
          createdById: 1,
          resource: {
            id: 'SCL-P01',
            name: 'Parking 01',
            description: 'Estacionamiento techado',
            location: 'Subterráneo, Sector A',
            isActive: true,
            config: { isAccessible: true },
            siteId: 'SCL',
            resourceTypeId: 2,
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            site: {
              id: 'SCL',
              name: 'Santiago Centro',
              timezone: 'America/Santiago',
              isActive: true,
              createdAt: '2025-01-01T00:00:00Z',
              updatedAt: '2025-01-01T00:00:00Z',
            },
            resourceType: {
              id: 2,
              code: 'parking',
              name: 'Estacionamiento',
              icon: '🚗',
              color: '#10B981',
              isActive: true,
              createdAt: '2025-01-01T00:00:00Z',
              updatedAt: '2025-01-01T00:00:00Z',
            },
          },
        },
        {
          id: 3,
          startTime: '2025-10-03T09:00:00Z',
          endTime: '2025-10-03T10:30:00Z',
          timeRange: '[2025-10-03 09:00:00+00,2025-10-03 10:30:00+00)',
          purpose: 'Presentación mensual',
          attendeeCount: 12,
          status: BookingStatus.COMPLETED,
          createdAt: '2025-10-01T10:00:00Z',
          updatedAt: '2025-10-03T10:30:00Z',
          resourceId: 'LSC-S2',
          userId: 1,
          createdById: 1,
          resource: {
            id: 'LSC-S2',
            name: 'Sala 2',
            description: 'Sala de presentaciones',
            capacity: 15,
            location: 'Piso 1, Ala Este',
            isActive: true,
            config: { hasProjector: true, hasVideoConference: true },
            siteId: 'LSC',
            resourceTypeId: 1,
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
            site: {
              id: 'LSC',
              name: 'La Serena',
              timezone: 'America/Santiago',
              isActive: true,
              createdAt: '2025-01-01T00:00:00Z',
              updatedAt: '2025-01-01T00:00:00Z',
            },
            resourceType: {
              id: 1,
              code: 'sala',
              name: 'Sala de reuniones',
              icon: '🏢',
              color: '#3B82F6',
              isActive: true,
              createdAt: '2025-01-01T00:00:00Z',
              updatedAt: '2025-01-01T00:00:00Z',
            },
          },
        },
      ];

      setBookings(mockBookings);
      setIsLoading(false);
    }, 1000);
  }, [userId]);

  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.ACTIVE:
        return 'primary';
      case BookingStatus.COMPLETED:
        return 'success';
      case BookingStatus.CANCELLED:
        return 'error';
      case BookingStatus.NO_SHOW:
        return 'warning';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.ACTIVE:
        return 'Activa';
      case BookingStatus.COMPLETED:
        return 'Completada';
      case BookingStatus.CANCELLED:
        return 'Cancelada';
      case BookingStatus.NO_SHOW:
        return 'No se presentó';
      default:
        return status;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, 'EEEE, d \'de\' MMMM', { locale: es }),
      time: format(date, 'HH:mm'),
    };
  };

  const canEdit = (booking: Booking) => {
    const now = new Date();
    const startTime = new Date(booking.startTime);
    return booking.status === BookingStatus.ACTIVE && startTime > now;
  };

  const canCancel = (booking: Booking) => {
    const now = new Date();
    const startTime = new Date(booking.startTime);
    return booking.status === BookingStatus.ACTIVE && startTime > now;
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (booking: Booking) => {
    onEdit?.(booking);
  };

  const handleCancel = (booking: Booking) => {
    onCancel?.(booking);
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card
        header={
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarDaysIcon className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Mis Reservas
              </h3>
            </div>
            
            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as BookingStatus | 'all')}
              className="input text-sm w-auto min-w-[120px]"
            >
              <option value="all">Todas</option>
              <option value={BookingStatus.ACTIVE}>Activas</option>
              <option value={BookingStatus.COMPLETED}>Completadas</option>
              <option value={BookingStatus.CANCELLED}>Canceladas</option>
            </select>
          </div>
        }
      >
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No tienes reservas</p>
              <p className="text-sm text-gray-400 mt-1">
                Crea tu primera reserva seleccionando una sede y recurso
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const startDateTime = formatDateTime(booking.startTime);
              const endTime = formatDateTime(booking.endTime).time;
              
              return (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-3 h-3 rounded-full" 
                             style={{ backgroundColor: booking.resource?.resourceType?.color || '#6B7280' }}
                        />
                        <h4 className="font-semibold text-gray-900">
                          {booking.purpose}
                        </h4>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </div>

                      {/* Resource Info */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <BuildingOfficeIcon className="h-4 w-4" />
                          <span>{booking.resource?.name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="h-4 w-4" />
                          <span>{booking.resource?.site?.name}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{startDateTime.time} - {endTime}</span>
                        </div>
                      </div>

                      {/* Date */}
                      <p className="text-sm text-gray-500 capitalize mb-3">
                        {startDateTime.date}
                      </p>

                      {/* Additional Info */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {booking.attendeeCount && (
                          <span>👥 {booking.attendeeCount} asistentes</span>
                        )}
                        {booking.licensePlate && (
                          <span>🚗 {booking.licensePlate}</span>
                        )}
                        {booking.resource?.location && (
                          <span>📍 {booking.resource.location}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(booking)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      
                      {canEdit(booking) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(booking)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {canCancel(booking) && (
                        <Button
                          variant="error"
                          size="sm"
                          onClick={() => handleCancel(booking)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Booking Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalles de la Reserva"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Recurso</h5>
                <p className="text-gray-600">{selectedBooking.resource?.name}</p>
                <p className="text-sm text-gray-500">{selectedBooking.resource?.location}</p>
              </div>
              
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Sede</h5>
                <p className="text-gray-600">{selectedBooking.resource?.site?.name}</p>
              </div>
              
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Fecha y Hora</h5>
                <p className="text-gray-600 capitalize">
                  {formatDateTime(selectedBooking.startTime).date}
                </p>
                <p className="text-gray-600">
                  {formatDateTime(selectedBooking.startTime).time} - {formatDateTime(selectedBooking.endTime).time}
                </p>
              </div>
              
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Estado</h5>
                <Badge variant={getStatusBadgeVariant(selectedBooking.status)}>
                  {getStatusLabel(selectedBooking.status)}
                </Badge>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-gray-900 mb-1">Propósito</h5>
              <p className="text-gray-600">{selectedBooking.purpose}</p>
            </div>

            {selectedBooking.attendees && selectedBooking.attendees.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Asistentes</h5>
                <ul className="text-gray-600 text-sm space-y-1">
                  {selectedBooking.attendees.map((email, index) => (
                    <li key={index}>• {email}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedBooking.licensePlate && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Patente</h5>
                <p className="text-gray-600">{selectedBooking.licensePlate}</p>
              </div>
            )}

            {selectedBooking.notes && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-1">Notas</h5>
                <p className="text-gray-600">{selectedBooking.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default MyBookings;