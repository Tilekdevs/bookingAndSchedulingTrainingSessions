import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createTrainerScheduleItem, fetchTrainerSchedule } from '../api'
import '../assets/styles/ScheduleManager.scss'
import { useAuth } from '../context/AuthContext'

export default function ScheduleManager() {
	const [schedules, setSchedules] = useState([])
	const [form, setForm] = useState({ date: '', time: '' })
	const { user } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (!user) {
			navigate('/login')
			return
		}

		if (user.role !== 'trainer') {
			navigate('/dashboard')
			return
		}

		const loadSchedules = async () => {
			try {
				if (!user.token) {
					setSchedules([{ id: 1, date: '2025-05-27', time: '10:00' }])
					return
				}

				const data = await fetchTrainerSchedule(user.token)
				setSchedules(data)
			} catch (err) {
				toast.error('Ошибка при загрузке расписания')
			}
		}

		loadSchedules()
	}, [user, navigate])

	const handleSubmit = async e => {
		e.preventDefault()
		try {
			await createTrainerScheduleItem(form, user.token)
			toast.success('Расписание добавлено')
			setForm({ date: '', time: '' })
			const data = await fetchTrainerSchedule(user.token)
			setSchedules(data)
		} catch (err) {
			toast.error('Ошибка при добавлении расписания')
		}
	}

	return (
		<div className='schedule-manager-page'>
			<h1>Управление расписанием</h1>
			<form onSubmit={handleSubmit} className='schedule-form'>
        <div className='input-group'>
					<label htmlFor='date'>Имя</label>
					<input
						id='name'
						type='name'
						value={form.name}
						onChange={e => setForm({ ...form, name: e.target.value })}
						required
					/>
				</div>
				<div className='input-group'></div>
				<div className='input-group'>
					<label htmlFor='date'>Дата</label>
					<input
						id='date'
						type='date'
						value={form.date}
						onChange={e => setForm({ ...form, date: e.target.value })}
						required
					/>
				</div>
				<div className='input-group'>
					<label htmlFor='time'>Время</label>
					<input
						id='time'
						type='time'
						value={form.time}
						onChange={e => setForm({ ...form, time: e.target.value })}
						required
					/>
				</div>
				<button type='submit' className='submit-button'>
					Добавить
				</button>
			</form>
			<section className='schedules-section'>
				<h2>Расписание тренеров</h2>
				{schedules.length === 0 ? (
					<p>Нет расписания</p>
				) : (
					schedules.map(schedule => (
						<div key={schedule.id} className='schedule-card'>it
							<p>
								<strong>Дата:</strong> {schedule.date}
							</p>
							<p>
								<strong>Время:</strong> {schedule.time}
							</p>
						</div>
					))
				)}
			</section>
		</div>
	)
}
