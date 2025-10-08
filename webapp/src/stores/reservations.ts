import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { Booking, BookingRequest, AvailabilityQuery, ApiResponse } from '@/types'
import axios from 'axios'

export const useReservationsStore = defineStore('reservations', () => {
  // Estado reactivo
  const bookings = ref<Booking[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters computados
  const activeBookings = computed(() => 
    bookings.value.filter(booking => booking.status === 'confirmed')
  )
  
  const upcomingBookings = computed(() => 
    bookings.value
      .filter(booking => new Date(booking.startAt) > new Date())
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
  )

  // Actions
  const fetchBookings = async (userId?: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: ApiResponse<Booking[]> = await axios.get('/api/bookings', {
        params: userId ? { user_id: userId } : {}
      })
      
      bookings.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Error al cargar reservas'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createBooking = async (bookingData: BookingRequest): Promise<Booking> => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: ApiResponse<Booking> = await axios.post('/api/bookings', bookingData)
      
      // Actualizar estado local
      bookings.value.push(response.data)
      
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Error al crear reserva'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateBooking = async (id: string, updateData: Partial<BookingRequest>): Promise<Booking> => {
    try {
      isLoading.value = true
      error.value = null
      
      const response: ApiResponse<Booking> = await axios.put(`/api/bookings/${id}`, updateData)
      
      // Actualizar en estado local
      const index = bookings.value.findIndex(b => b.id === id)
      if (index !== -1) {
        bookings.value[index] = response.data
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Error al actualizar reserva'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const cancelBooking = async (id: string): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      
      await axios.delete(`/api/bookings/${id}`)
      
      // Actualizar estado local
      const index = bookings.value.findIndex(b => b.id === id)
      if (index !== -1 && bookings.value[index]) {
        bookings.value[index].status = 'cancelled'
      }
    } catch (err: any) {
      error.value = err.message || 'Error al cancelar reserva'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const checkAvailability = async (query: AvailabilityQuery) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await axios.post('/api/availability/check', query)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Error al verificar disponibilidad'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Estado
    bookings: readonly(bookings),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Getters
    activeBookings,
    upcomingBookings,
    
    // Actions
    fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    checkAvailability,
  }
})