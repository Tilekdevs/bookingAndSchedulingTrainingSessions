import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { registerUser } from '../api'
import '../assets/styles/Register.scss'
import { useAuth } from '../context/AuthContext'

export default function Register() {
	const [form, setForm] = useState({ email: '', password: '', role: 'client' })
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const { login } = useAuth()
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			await registerUser(form)
			toast.success('Регистрация успешна!')

			await login(form.email, form.password)
			navigate('/dashboard')
		} catch (err) {
			const errorMessage = err.message || 'Ошибка при регистрации'
			setError(errorMessage)
			toast.error(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='register-page'>
			<form onSubmit={handleSubmit} className='register-form'>
				<h2 className='register-title'>Регистрация</h2>

				<div className='input-group'>
					<label htmlFor='email' className='input-label'>
						Email
					</label>
					<input
						id='email'
						type='email'
						placeholder='Введите email'
						value={form.email}
						onChange={e => setForm({ ...form, email: e.target.value })}
						className='register-input'
						required
						disabled={loading}
					/>
				</div>

				<div className='input-group'>
					<label htmlFor='password' className='input-label'>
						Пароль
					</label>
					<input
						id='password'
						type='password'
						placeholder='Введите пароль'
						value={form.password}
						onChange={e => setForm({ ...form, password: e.target.value })}
						className='register-input'
						required
						disabled={loading}
					/>
				</div>

				<div className='input-group'>
					<label htmlFor='role' className='input-label'>
						Роль
					</label>
					<select
						id='role'
						value={form.role}
						onChange={e => setForm({ ...form, role: e.target.value })}
						className='register-input'
						disabled={loading}
					>
						<option value='client'>Клиент</option>
						<option value='trainer'>Тренер</option>
					</select>
				</div>

				{error && <p className='register-error'>{error}</p>}

				<button type='submit' className='register-button' disabled={loading}>
					{loading ? 'Регистрация...' : 'Зарегистрироваться'}
				</button>

				<p className='register-login-link'>
					Уже есть аккаунт? <Link to='/login'>Войти</Link>
				</p>
			</form>
		</div>
	)
}
