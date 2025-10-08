import * as yup from 'yup'

// Esquemas de autenticación
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('El email es requerido')
    .email('Formato de email inválido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  remember: yup.boolean().default(false)
})

export const registerSchema = yup.object({
  name: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: yup
    .string()
    .required('El email es requerido')
    .email('Formato de email inválido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(8, 'Mínimo 8 caracteres')
    .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .matches(/[a-z]/, 'Debe contener al menos una minúscula')
    .matches(/[0-9]/, 'Debe contener al menos un número'),
  passwordConfirmation: yup
    .string()
    .required('Confirma tu contraseña')
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
})

// Esquemas de reservas
export const bookingSchema = yup.object({
  resourceId: yup
    .string()
    .required('Selecciona un recurso'),
  title: yup
    .string()
    .required('El título es requerido')
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  description: yup
    .string()
    .max(500, 'Máximo 500 caracteres'),
  startAt: yup
    .date()
    .required('La fecha de inicio es requerida')
    .min(new Date(), 'No puedes reservar en el pasado'),
  endAt: yup
    .date()
    .required('La fecha de fin es requerida')
    .min(yup.ref('startAt'), 'La fecha de fin debe ser posterior al inicio'),
  attendees: yup
    .number()
    .min(1, 'Debe haber al menos 1 asistente')
    .max(50, 'Máximo 50 asistentes')
    .integer('Debe ser un número entero'),
})

// Esquemas de recursos (admin)
export const resourceSchema = yup.object({
  name: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  code: yup
    .string()
    .required('El código es requerido')
    .matches(/^[A-Z0-9_]+$/, 'Solo letras mayúsculas, números y guiones bajos'),
  siteId: yup
    .string()
    .required('Selecciona una sede'),
  resourceTypeId: yup
    .string()
    .required('Selecciona un tipo de recurso'),
  capacity: yup
    .number()
    .min(1, 'La capacidad debe ser mayor a 0')
    .max(200, 'Capacidad máxima: 200')
    .integer('Debe ser un número entero'),
  equipment: yup
    .array()
    .of(yup.string())
    .default([]),
  tags: yup
    .array()
    .of(yup.string())
    .default([]),
  settings: yup.object({
    minBookingMinutes: yup
      .number()
      .min(15, 'Mínimo 15 minutos')
      .max(480, 'Máximo 8 horas')
      .required(),
    maxBookingMinutes: yup
      .number()
      .min(yup.ref('minBookingMinutes'), 'Debe ser mayor al mínimo')
      .max(1440, 'Máximo 24 horas')
      .required(),
    bufferMinutes: yup
      .number()
      .min(0, 'No puede ser negativo')
      .max(60, 'Máximo 1 hora')
      .default(0),
    maxDailyBookings: yup
      .number()
      .min(1, 'Mínimo 1 reserva por día')
      .max(20, 'Máximo 20 reservas por día')
      .default(5),
    requiresApproval: yup.boolean().default(false),
    allowRecurring: yup.boolean().default(true)
  })
})

// Esquemas de usuarios (admin)
export const userSchema = yup.object({
  name: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  email: yup
    .string()
    .required('El email es requerido')
    .email('Formato de email inválido'),
  role: yup
    .string()
    .oneOf(['user', 'reception', 'site_admin', 'super_admin'], 'Rol inválido')
    .required('Selecciona un rol')
})

// Esquemas de configuración
export const siteSchema = yup.object({
  name: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  code: yup
    .string()
    .required('El código es requerido')
    .matches(/^[A-Z]{3}$/, 'Debe ser 3 letras mayúsculas (ej: SCL, LSC)'),
  address: yup
    .string()
    .required('La dirección es requerida')
    .max(200, 'Máximo 200 caracteres'),
  timezone: yup
    .string()
    .required('Selecciona zona horaria')
    .oneOf([
      'America/Santiago',
      'America/Argentina/Buenos_Aires',
      'America/Sao_Paulo',
      'UTC'
    ], 'Zona horaria inválida'),
  settings: yup.object({
    operatingHours: yup.object({
      start: yup
        .string()
        .required('Hora de inicio requerida')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:mm'),
      end: yup
        .string()
        .required('Hora de fin requerida')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:mm')
    }),
    businessDays: yup
      .array()
      .of(yup.number().min(0).max(6))
      .min(1, 'Selecciona al menos un día')
      .required(),
    maxAdvanceBookingDays: yup
      .number()
      .min(1, 'Mínimo 1 día')
      .max(365, 'Máximo 1 año')
      .required(),
    autoReleaseMinutes: yup
      .number()
      .min(5, 'Mínimo 5 minutos')
      .max(60, 'Máximo 1 hora')
      .required()
  })
})

// Tipos derivados de los esquemas
export type LoginFormData = yup.InferType<typeof loginSchema>
export type RegisterFormData = yup.InferType<typeof registerSchema>
export type BookingFormData = yup.InferType<typeof bookingSchema>
export type ResourceFormData = yup.InferType<typeof resourceSchema>
export type UserFormData = yup.InferType<typeof userSchema>
export type SiteFormData = yup.InferType<typeof siteSchema>

// Utilidades de validación
export const validateField = async (schema: yup.Schema, field: string, value: any) => {
  try {
    await schema.validateAt(field, { [field]: value })
    return null
  } catch (error) {
    return error instanceof yup.ValidationError ? error.message : 'Error de validación'
  }
}

export const validateForm = async (schema: yup.Schema, data: any) => {
  try {
    await schema.validate(data, { abortEarly: false })
    return { isValid: true, errors: {} }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {}
      error.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message
        }
      })
      return { isValid: false, errors }
    }
    return { isValid: false, errors: { general: 'Error de validación' } }
  }
}