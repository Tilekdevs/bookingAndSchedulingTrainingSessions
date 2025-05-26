const BASE_URL = 'http://localhost:8086'

export async function registerUser(data) {
  const response = await fetch('http://localhost:8086/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Ошибка при регистрации');
  }

  return response.text();
}

export async function loginUser(data) {
  const response = await fetch('http://localhost:8086/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Ошибка при входе')
  }

  return response.json() // тут будет { token, email, role }
}



export async function fetchSchedules() {
  const res = await fetch(`${BASE_URL}/schedules`)
  if (!res.ok) throw new Error('Ошибка при загрузке расписания')
  return res.json()
}

export async function fetchBookingsByEmail(email) {
  const res = await fetch(`${BASE_URL}/schedules?email=${encodeURIComponent(email)}`)
  if (!res.ok) throw new Error('Ошибка при загрузке записей клиента')
  return res.json()
}

export async function fetchAllBookings() {
  const res = await fetch(`${BASE_URL}/bookings`)
  if (!res.ok) throw new Error('Ошибка при загрузке всех бронирований')
  return res.json()
}

export async function fetchTrainerSchedule(token) {
  const res = await fetch(`${BASE_URL}/trainerSchedule`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Ошибка при загрузке расписания тренера');
  return res.json();
}

export async function createTrainerScheduleItem(data, token) {
  const response = await fetch(`${BASE_URL}/trainerSchedule`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Ошибка создания расписания');
  }
  return await response.json();
}


export async function updateTrainerScheduleItem(id, updatedData) {
  const res = await fetch(`${BASE_URL}/trainerSchedule/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  })
  if (!res.ok) throw new Error('Ошибка при обновлении элемента расписания')
  return res.json()
}

export async function deleteTrainerScheduleItem(id, token) {
  const res = await fetch(`${BASE_URL}/trainerSchedule/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('Ошибка при удалении элемента расписания')
}


export async function createBooking(data) {
  const res = await fetch(`${BASE_URL}/schedules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Ошибка при создании бронирования')
  return res.json()
}

export async function updateBooking(id, updatedData) {
  const res = await fetch(`${BASE_URL}/schedules/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  })
  if (!res.ok) throw new Error('Ошибка при обновлении бронирования')
  return res.json()
}

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