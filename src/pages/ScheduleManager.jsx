import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createTrainerScheduleItem,
  fetchTrainerSchedule,
  fetchSchedules,
  fetchAllBookings,
  updateItem,
  deleteItem,
} from '../api'
import '../assets/styles/ScheduleManager.scss'
import { useAuth } from '../context/AuthContext'

export default function ScheduleManager() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [schedule, setSchedule] = useState([])
  const [form, setForm] = useState({
    client: '',
    date: '',
    time: '',
    workout: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [editingSource, setEditingSource] = useState(null)

  useEffect(() => {
    if (!user) return

    if (user.role !== 'trainer') {
      alert('Доступ разрешён только тренерам')
      navigate('/')
      return
    }

    const loadSchedule = async () => {
      try {
        const [trainer, clientSchedules, bookings] = await Promise.all([
          fetchTrainerSchedule(),
          fetchSchedules(),
          fetchAllBookings(),
        ])

        const normalize = (items, source) =>
          items.map(item => ({ ...item, source }))

        const all = [
          ...normalize(trainer, 'trainer'),
          ...normalize(clientSchedules, 'schedule'),
          ...normalize(bookings, 'booking'),
        ]

        setSchedule(all)
      } catch (err) {
        alert('Ошибка загрузки расписания')
        console.error(err)
      }
    }

    loadSchedule()
  }, [user, navigate])

  useEffect(() => {
    localStorage.setItem('trainer-schedule', JSON.stringify(schedule))
  }, [schedule])

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAdd = async e => {
    e.preventDefault()
    if (!form.client || !form.date || !form.time || !form.workout) {
      alert('Пожалуйста, заполните все поля')
      return
    }

    try {
      if (editingId !== null) {
        // Обновление любого элемента в зависимости от source
        const updatedItem = await updateItem(editingSource, editingId, form)
        setSchedule(prev =>
          prev.map(item =>
            item.id === editingId && item.source === editingSource
              ? { ...updatedItem, source: editingSource }
              : item,
          ),
        )
        setEditingId(null)
        setEditingSource(null)
      } else {
        // Создание нового — только для trainerSchedule
        const newItem = await createTrainerScheduleItem(form)
        setSchedule(prev => [...prev, { ...newItem, source: 'trainer' }])
      }
      setForm({ client: '', date: '', time: '', workout: '' })
    } catch (err) {
      alert('Ошибка при сохранении данных')
      console.error(err)
    }
  }

  const handleDelete = async (id, source) => {
    if (window.confirm('Удалить это занятие?')) {
      try {
        await deleteItem(source, id)
        setSchedule(prev => prev.filter(item => !(item.id === id && item.source === source)))
      } catch (err) {
        alert('Ошибка при удалении')
        console.error(err)
      }
    }
  }

  const handleEdit = item => {
    setForm({
      client: item.client || '',
      date: item.date,
      time: item.time,
      workout: item.workout,
    })
    setEditingId(item.id)
    setEditingSource(item.source)
  }

  const handleCancelEdit = () => {
    setForm({ client: '', date: '', time: '', workout: '' })
    setEditingId(null)
    setEditingSource(null)
  }

  const handleLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      logout()
    }
  }

  return (
    <div className='container'>
      <div className='header'>
        <h1>Управление расписанием</h1>
        <button onClick={handleLogout} className='btn btn-red'>
          Выйти
        </button>
      </div>

      <form onSubmit={handleAdd} className='schedule-form'>
        <input
          type='text'
          name='client'
          placeholder='Имя клиента'
          value={form.client}
          onChange={handleChange}
          required
          className='input'
        />
        <input
          type='date'
          name='date'
          value={form.date}
          onChange={handleChange}
          required
          className='input'
        />
        <input
          type='time'
          name='time'
          value={form.time}
          onChange={handleChange}
          required
          className='input'
        />
        <input
          type='text'
          name='workout'
          placeholder='Тип тренировки'
          value={form.workout}
          onChange={handleChange}
          required
          className='input'
        />

        <div className='form-actions'>
          <button
            type='submit'
            className={`btn ${editingId !== null ? 'btn-yellow' : 'btn-green'}`}
          >
            {editingId !== null ? 'Сохранить изменения' : 'Добавить занятие'}
          </button>
          {editingId !== null && (
            <button
              type='button'
              onClick={handleCancelEdit}
              className='btn btn-gray'
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      {schedule.length === 0 ? (
        <p>Пока нет занятий</p>
      ) : (
        <table className='schedule-table'>
          <thead>
            <tr>
              <th>Клиент</th>
              <th>Дата</th>
              <th>Время</th>
              <th>Тренировка</th>
              <th>Источник</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map(item => (
              <tr key={`${item.source}-${item.id}`}>
                <td>{item.client || '-'}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td>{item.workout}</td>
                <td>{item.source}</td>
                <td className='actions-cell'>
                  <button
                    onClick={() => handleEdit(item)}
                    className='btn btn-yellow btn-small'
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.source)}
                    className='btn btn-red btn-small'
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
