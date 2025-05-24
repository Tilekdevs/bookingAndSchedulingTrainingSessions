import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  fetchSchedules,
  fetchBookingsByEmail,
  createBooking,
  deleteBooking,
  fetchTrainerSchedule,
  fetchAllBookings,
} from '../api.js'
import '../assets/styles/Dashboard.scss'
import BookingForm from '../components/BookingForm'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [schedule, setSchedule] = useState([])
  const [clientBookings, setClientBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        if (user.role === 'client') {
          const [schedules, bookings] = await Promise.all([
            fetchSchedules(),
            fetchBookingsByEmail(user.email),
          ])
          setSchedule(schedules)
          setClientBookings(bookings)
        } else if (user.role === 'trainer') {
          const [schedules, trainerSchedules, bookings] = await Promise.all([
            fetchSchedules(),
            fetchTrainerSchedule(),
            fetchAllBookings(),
          ])
          const merged = [...schedules, ...trainerSchedules, ...bookings]
          setSchedule(merged)
        }
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  const handleBooking = async booking => {
    try {
      const isTaken = schedule.some(
        item => item.date === booking.date && item.time === booking.time
      )
      if (isTaken) {
        toast.error('Это время уже занято, выберите другое.')
        return
      }

      const bookingData = {
        client: booking.clientName,
        date: booking.date,
        time: booking.time || '09:00',
        workout: booking.workout,
        email: user.email,
      }
      const newBooking = await createBooking(bookingData)
      setClientBookings(prev => [...prev, newBooking])
      toast.success('Запись успешно добавлена!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteBooking = async id => {
    try {
      await deleteBooking(id)
      setClientBookings(prev => prev.filter(b => b.id !== id))
      toast.info('Запись удалена')
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (!user) return <p>Пожалуйста, войдите в систему...</p>
  if (loading) return <p>Загрузка...</p>

  return (
    <div className='dashboard'>
      <div className='dashboard-header'>
        <h1>
          Добро пожаловать, {user.email} ({user.role})
        </h1>
        <button onClick={logout} className='btn btn-red'>
          Выйти
        </button>
      </div>

      {user.role === 'client' && (
        <>
          <BookingForm availableSchedules={schedule} onBook={handleBooking} />

          <h2 className='section-title'>Ваши записи</h2>

          {clientBookings.length === 0 ? (
            <p>Пока нет записей</p>
          ) : (
            <table className='custom-table'>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Время</th>
                  <th>Тренировка</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {clientBookings.map(item => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td>{item.workout}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteBooking(item.id)}
                        className='btn btn-red small'
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {user.role === 'trainer' && (
        <>
          <h2 className='section-title'>Ваше расписание тренировок</h2>
          {schedule.length === 0 ? (
            <p>Пока нет тренировок</p>
          ) : (
            <table className='custom-table'>
              <thead>
                <tr>
                  <th>Клиент</th>
                  <th>Дата</th>
                  <th>Время</th>
                  <th>Тренировка</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map(item => (
                  <tr key={item.id}>
                    <td>{item.client || '-'}</td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td>{item.workout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button
            onClick={() => navigate('/schedule-manager')}
            className='btn btn-blue'
          >
            Управление расписанием
          </button>
        </>
      )}
    </div>
  )
}
