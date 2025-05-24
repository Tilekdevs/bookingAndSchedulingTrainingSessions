const BASE_URL = 'http://localhost:3001'

// Получить все записи из schedules (для клиентов)
export async function fetchSchedules() {
  const res = await fetch(`${BASE_URL}/schedules`)
  if (!res.ok) throw new Error('Ошибка при загрузке расписания')
  return res.json()
}

// Получить записи из schedules по email клиента
export async function fetchBookingsByEmail(email) {
  const res = await fetch(`${BASE_URL}/schedules?email=${encodeURIComponent(email)}`)
  if (!res.ok) throw new Error('Ошибка при загрузке записей клиента')
  return res.json()
}

// Получить ВСЕ bookings (для тренера)
export async function fetchAllBookings() {
  const res = await fetch(`${BASE_URL}/bookings`)
  if (!res.ok) throw new Error('Ошибка при загрузке всех бронирований')
  return res.json()
}

// Получить расписание тренера
export async function fetchTrainerSchedule() {
  const res = await fetch(`${BASE_URL}/trainerSchedule`)
  if (!res.ok) throw new Error('Ошибка при загрузке расписания тренера')
  return res.json()
}

// Создать новую запись в расписании тренера
export async function createTrainerScheduleItem(item) {
  const res = await fetch(`${BASE_URL}/trainerSchedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error('Ошибка при создании элемента расписания')
  return res.json()
}

// Обновить запись тренера
export async function updateTrainerScheduleItem(id, updatedData) {
  const res = await fetch(`${BASE_URL}/trainerSchedule/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  })
  if (!res.ok) throw new Error('Ошибка при обновлении элемента расписания')
  return res.json()
}

// Удалить запись тренера
export async function deleteTrainerScheduleItem(id) {
  const res = await fetch(`${BASE_URL}/trainerSchedule/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Ошибка при удалении элемента расписания')
}

// Создать бронирование (для клиента)
export async function createBooking(data) {
  const res = await fetch(`${BASE_URL}/schedules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Ошибка при создании бронирования')
  return res.json()
}


// Обновить бронирование
export async function updateBooking(id, updatedData) {
  const res = await fetch(`${BASE_URL}/schedules/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  })
  if (!res.ok) throw new Error('Ошибка при обновлении бронирования')
  return res.json()
}

// Удалить бронирование
export async function deleteBooking(id) {
  const res = await fetch(`${BASE_URL}/schedules/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Ошибка при удалении бронирования')
}

export async function updateItem(source, id, data) {
  let url
  if (source === 'trainer') url = `/trainerSchedule/${id}`
  else if (source === 'schedule') url = `/schedules/${id}`
  else if (source === 'booking') url = `/bookings/${id}`
  else throw new Error('Unknown source')

  const res = await fetch(`${BASE_URL}${url}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error('Ошибка при обновлении элемента')
  return res.json()
}

export async function deleteItem(source, id) {
  let url
  if (source === 'trainer') url = `/trainerSchedule/${id}`
  else if (source === 'schedule') url = `/schedules/${id}`
  else if (source === 'booking') url = `/bookings/${id}`
  else throw new Error('Unknown source')

  const res = await fetch(`${BASE_URL}${url}`, {
    method: 'DELETE',
  })

  if (!res.ok) throw new Error('Ошибка при удалении элемента')
  return true
}
