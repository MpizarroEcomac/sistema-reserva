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

  // Mock data mejorado - Datos más realistas y variados para mejor demostración
  useEffect(() => {
    setTimeout(() => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      
      const mockBookings: Booking[] = [
        {
          id: 1,
          startTime: `${today.toISOString().split('T')[0]}T14:00:00Z`,
          endTime: `${today.toISOString().split('T')[0]}T15:30:00Z`,
          timeRange: `[${today.toISOString().split('T')[0]} 14:00:00+00,${today.toISOString().split('T')[0]} 15:30:00+00)`,
          purpose: 'Reunión de Sprint Planning',
          attendeeCount: 8,
          attendees: ['carlos.rodriguez@empresa.com', 'ana.martinez@empresa.com', 'luis.gonzalez@empresa.com'],
          status: BookingStatus.ACTIVE,
          notes: 'Necesitamos pizarra digital y conexión Teams',
          createdAt: `${lastWeek.toISOString().split('T')[0]}T10:00:00Z`,
          updatedAt: `${lastWeek.toISOString().split('T')[0]}T10:00:00Z`,
          resourceId: 'SCL-S1',
          userId: 1,
          createdById: 1,
          resource: {
            id: 'SCL-S1',
            name: 'Sala 1',
            description: 'Sala de reuniones con capacidad para 8 personas, incluye proyector',
            capacity: 8,
            location: 'Piso 2, Ala Norte',
            isActive: true,
            config: { hasProjector: true, hasWhiteboard: true, hasVideoConference: true },
            siteId: 'SCL',
            resourceTypeId: 1,
            createdAt: '2025-10-06T13:24:37.000Z',
            updatedAt: '2025-10-06T13:24:37.000Z',
            site: {
              id: 'SCL',
              name: 'Santiago Centro',
              timezone: 'America/Santiago',
              address: 'Av. Libertador Bernardo O\'Higgins 123, Santiago, Chile',
              isActive: true,
              createdAt: '2025-10-06T13:24:37.000Z',
              updatedAt: '2025-10-06T13:24:37.000Z',
            },
            resourceType: {
              id: 1,
              code: 'sala',
              name: 'Sala de reuniones',
              icon: '🏢',
              color: '#3B82F6',
              isActive: true,
              createdAt: '2025-10-06T13:24:37.000Z',
              updatedAt: '2025-10-06T13:24:37.000Z',
            },
          },
        },
        {
          id: 2,
          startTime: `${tomorrow.toISOString().split('T')[0]}T08:00:00Z`,
          endTime: `${tomorrow.toISOString().split('T')[0]}T18:00:00Z`,
          timeRange: `[${tomorrow.toISOString().split('T')[0]} 08:00:00+00,${tomorrow.toISOString().split('T')[0]} 18:00:00+00)`,
          purpose: 'Visita cliente importante - día completo',
          licensePlate: 'GHYZ89',
          status: BookingStatus.ACTIVE,
          notes: 'Cliente VIP - presentación de propuesta Q4',
          createdAt: `${today.toISOString().split('T')[0]}T09:00:00Z`,
          updatedAt: `${today.toISOString().split('T')[0]}T09:00:00Z`,
          resourceId: 'SCL-P1',
          userId: 1,
          createdById: 1,
          resource: {
            id: 'SCL-P1',
            name: 'Parking 1',
            description: 'Espacio de estacionamiento techado',
            capacity: 1,
            location: 'Subterráneo Nivel 1',
            isActive: true,
            config: { isAccessible: false, isCovered: true, level: 'B1' },
            siteId: 'SCL',
            resourceTypeId: 2,
            createdAt: '2025-10-06T13:24:37.000Z',
            updatedAt: '2025-10-06T13:24:37.000Z',
            site: {
              id: 'SCL',
              name: 'Santiago Centro',
              timezone: 'America/Santiago',
              address: 'Av. Libertador Bernardo O\'Higgins 123, Santiago, Chile',
              isActive: true,
              createdAt: '2025-10-06T13:24:37.000Z',
              updatedAt: '2025-10-06T13:24:37.000Z',
            },
            resourceType: {
              id: 2,
              code: 'parking',
              name: 'Estacionamiento',
              icon: '🚗',
              color: '#10B981',
              isActive: true,
              createdAt: '2025-10-06T13:24:37.000Z',
              updatedAt: '2025-10-06T13:24:37.000Z',
            },
          },
        },
        {
          id: 3,
          startTime: `${lastWeek.toISOString().split('T')[0]}T09:00:00Z`,
          endTime: `${lastWeek.toISOString().split('T')[0]}T12:00:00Z`,
          timeRange: `[${lastWeek.toISOString().split('T')[0]} 09:00:00+00,${lastWeek.toISOString().split('T')[0]} 12:00:00+00)`,
          purpose: 'Presentación de resultados Q3',
          attendeeCount: 15,
          attendees: ['director.general@empresa.com', 'gerente.ventas@empresa.com', 'jefe.finanzas@empresa.com'],
          status: BookingStatus.COMPLETED,
          notes: 'Presentación exitosa - aprobado presupuesto Q4',
          createdAt: `${lastWeek.toISOString().split('T')[0]}T08:00:00Z`,
          updatedAt: `${lastWeek.toISOString().split('T')[0]}T12:00:00Z`,
          resourceId: 'LSC-S1',
          userId: 1,
          createdById: 1,
          resource: {
            id: 'LSC-S1',
            name: 'Sala Ejecutiva',
            description: 'Sala ejecutiva con capacidad para 6 personas, equipamiento premium',
            capacity: 6,
            location: 'Piso 10',
            isActive: true,
            config: { hasProjector: true, hasWhiteboard: true, hasVideoConference: true, equipment: ['projector', 'whiteboard', 'wifi', 'air-conditioning', '4k-display'] },
            siteId: 'LSC',
            resourceTypeId: 1,
            createdAt: '2025-10-06T13:24:37.000Z',
            updatedAt: '2025-10-06T13:24:37.000Z',
            site: {
              id: 'LSC',
              name: 'Las Condes',
              timezone: 'America/Santiago',
              address: 'Av. Apoquindo 456, Las Condes, Santiago, Chile',
              isActive: true,
              createdAt: '2025-10-06T13:24:37.000Z',
              updatedAt: '2025-10-06T13:24:37.000Z',
            },
            resourceType: {
              id: 1,
              code: 'sala',
              name: 'Sala de reuniones',
              icon: '🏢',
              color: '#3B82F6',
              isActive: true,
              createdAt: '2025-10-06T13:24:37.000Z',
              updatedAt: '2025-10-06T13:24:37.000Z',
            },
          },
        },
        {
          id: 4,
          startTime: `${nextWeek.toISOString().split('T')[0]}T10:00:00Z`,
          endTime: `${nextWeek.toISOString().split('T')[0]}T11:30:00Z`,
          timeRange: `[${nextWeek.toISOString().split('T')[0]} 10:00:00+00,${nextWeek.toISOString().split('T')[0]} 11:30:00+00)`,
          purpose: 'Workshop de Innovación Tecnológica',
          attendeeCount: 12,
          attendees: ['tech.lead@empresa.com', 'product.manager@empresa.com', 'ux.designer@empresa.com', 'data.scientist@empresa.com'],
          status: BookingStatus.ACTIVE,
          notes: 'Brainstorming para roadmap 2025 - traer post-its y marcadores',
          createdAt: `${today.toISOString().split('T')[0]}T16:30:00Z`,
          updatedAt: `${today.toISOString().split('T')[0]}T16:30:00Z`,
          resourceId: 'SCL-S2',
          userId: 1,
          createdById: 1,
          resource: {
            id: 'SCL-S2',
            name: 'Sala 2',
            description: 'Sala de reuniones con capacidad para 12 personas',
            capacity: 12,
            location: 'Piso 2, Ala Sur',
            isActive: true,
            config: { hasProjector: true, hasWhiteboard: false, hasVideoConference: false, equipment: ['projector', 'wifi'] },
            siteId: 'SCL',
            resourceTypeId: 1,
            createdAt: '2025-10-06T13:24:37.000Z',
            updatedAt: '2025-10-06T13:24:37.000Z',
            site: {
              id: 'SCL',
              name: 'Santiago Centro',
              timezone: 'America/Santiago',
              address: 'Av. Libertador Bernardo O\'Higgins 123, Santiago, Chile',
              isActive: true,
              createdAt: '2025-10-06T13:24:37.000Z',
              updatedAt: '2025-10-06T13:24:37.000Z',
            },
            resourceType: {
              id: 1,
              code: 'sala',
              name: 'Sala de reuniones',
              icon: '🏢',
              color: '#3B82F6',
              isActive: true,
              createdAt: '2025-10-06T13:24:37.000Z',
              updatedAt: '2025-10-06T13:24:37.000Z',
            },
          },
        },
        {
          id: 5,
          startTime: `${today.toISOString().split('T')[0]}T09:30:00Z`,
          endTime: `${today.toISOString().split('T')[0]}T10:00:00Z`,
          timeRange: `[${today.toISOString().split('T')[0]} 09:30:00+00,${today.toISOString().split('T')[0]} 10:00:00+00)`,
          purpose: 'Entrevista candidato Senior Developer',
          attendeeCount: 3,
          attendees: ['rrhh@empresa.com', 'tech.lead@empresa.com'],
          status: BookingStatus.COMPLETED,
          notes: 'Candidato muy prometedor - recomendar para segunda ronda',
          createdAt: `${lastWeek.toISOString().split('T')[0]}T14:00:00Z`,
          updatedAt: `${today.toISOString().split('T')[0]}T10:05:00Z`,
          resourceId: 'LSC-P1',
          userId: 1,
          createdById: 1,
          resource: {
            id: 'LSC-P1',
            name: 'Parking VIP 1',
            description: 'Espacio de estacionamiento VIP',
            capacity: 1,
            location: 'Nivel Plaza',
            isActive: true,
            config: { isAccessible: true, isCovered: false, level: 'P1' },
            siteId: 'LSC',
            resourceTypeId: 2,
            createdAt: '2025-10-06T13:24:37.000Z',
            updatedAt: '2025-10-06T13:24:37.000Z',
            site: {
              id: 'LSC',
              name: 'Las Condes',
              timezone: 'America/Santiago',
              address: 'Av. Apoquindo 456, Las Condes, Santiago, Chile',
              isActive: true,
              createdAt: '2025-10-06T13:24:37.000Z',
              updatedAt: '2025-10-06T13:24:37.000Z',
            },
            resourceType: {
              id: 2,
              code: 'parking',
              name: 'Estacionamiento',
              icon: '🚗',
              color: '#10B981',
              isActive: true,
              createdAt: '2025-10-06T13:24:37.000Z',
              updatedAt: '2025-10-06T13:24:37.000Z',
            },
          },
        },
        {
          id: 6,
          startTime: `${tomorrow.toISOString().split('T')[0]}T16:00:00Z`,
          endTime: `${tomorrow.toISOString().split('T')[0]}T17:00:00Z`,
          timeRange: `[${tomorrow.toISOString().split('T')[0]} 16:00:00+00,${tomorrow.toISOString().split('T')[0]} 17:00:00+00)`,
          purpose: 'Reunión de seguimiento proyecto CRM',
          attendeeCount: 6,
          attendees: ['project.manager@empresa.com', 'cliente.externo@cliente.com'],
          status: BookingStatus.ACTIVE,
          notes: 'Revisar avances milestone 3 - demo en vivo requerida',
          createdAt: `${today.toISOString().split('T')[0]}T11:15:00Z`,
          updatedAt: `${today.toISOString().split('T')[0]}T11:15:00Z`,
          resourceId: 'SCL-S1',
          userId: 1,
          createdById: 1,
          resource: {
            id: 'SCL-S1',
            name: 'Sala 1',
            description: 'Sala de reuniones con capacidad para 8 personas, incluye proyector',
            capacity: 8,
            location: 'Piso 2, Ala Norte',
            isActive: true,
            config: { hasProjector: true, hasWhiteboard: true, hasVideoConference: true },
            siteId: 'SCL',
            resourceTypeId: 1,
            createdAt: '2025-10-06T13:24:37.000Z',
            updatedAt: '2025-10-06T13:24:37.000Z',
            site: {
              id: 'SCL',
              name: 'Santiago Centro',
              timezone: 'America/Santiago',
              address: 'Av. Libertador Bernardo O\'Higgins 123, Santiago, Chile',
              isActive: true,
              createdAt: '2025-10-06T13:24:37.000Z',
              updatedAt: '2025-10-06T13:24:37.000Z',
            },
            resourceType: {
              id: 1,
              code: 'sala',
              name: 'Sala de reuniones',
              icon: '🏢',
              color: '#3B82F6',
              isActive: true,
              createdAt: '2025-10-06T13:24:37.000Z',
              updatedAt: '2025-10-06T13:24:37.000Z',
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