/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState } from 'react'
import "../assets/styles/BookingForm.scss"

export default function BookingForm({ onBook }) {
  const [form, setForm] = useState({
    clientName: '',
    date: '',
    time: '',
    workout: '',
  })

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!form.clientName.trim()) {
      alert('Введите имя')
      return
    }
    if (!form.date) {
      alert('Выберите дату тренировки')
      return
    }
    if (!form.time) {
      alert('Выберите время тренировки')
      return
    }
    if (!form.workout.trim()) {
      alert('Введите тип тренировки')
      return
    }

    const now = new Date()
    const selectedDateTime = new Date(`${form.date}T${form.time}`)

    if (selectedDateTime < now) {
      alert('Нельзя выбрать дату и время в прошлом')
      return
    }

    onBook(form)

    setForm({
      clientName: '',
      date: '',
      time: '',
      workout: '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <label className="booking-label">
        Ваше имя:
        <input
          type="text"
          name="clientName"
          value={form.clientName}
          onChange={handleChange}
          className="booking-input"
          placeholder="Введите имя"
          required
        />
      </label>

      <label className="booking-label">
        Дата тренировки:
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="booking-input"
          required
        />
      </label>

      <label className="booking-label">
        Время тренировки:
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="booking-input"
          required
        />
      </label>

      <label className="booking-label">
        Тип тренировки:
        <input
          type="text"
          name="workout"
          value={form.workout}
          onChange={handleChange}
          className="booking-input"
          placeholder="Например, Йога, Силовая тренировка"
          required
        />
      </label>

      <button type="submit" className="btn btn-green">
        Забронировать
      </button>
    </form>
  )
}
