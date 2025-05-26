import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import '../assets/styles/Home.scss';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users
    if (user) {
      if (user.email === 'admin@example.com' || user.role === 'trainer') {
        navigate('/schedule-manager');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleGuestAccess = () => {
    toast.info('Войдите или зарегистрируйтесь, чтобы просмотреть тренеров и забронировать тренировки!');
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">Фитнес-тренировки на ваших условиях</h1>
        <p className="home-subtitle">
          Бронируйте занятия с профессиональными тренерами в удобное время
        </p>
      </header>
      <section className="home-actions">
        <Link to="/login" className="home-button home-button-login">
          Войти
        </Link>
        <Link to="/register" className="home-button home-button-register">
          Зарегистрироваться
        </Link>
        <button onClick={handleGuestAccess} className="home-button home-button-guest">
          Посмотреть тренеров
        </button>
      </section>
      <section className="home-info">
        <h2 className="home-info-title">Почему мы?</h2>
        <p className="home-info-text">
          Наша платформа помогает клиентам находить лучших тренеров и записываться на тренировки, а тренерам — эффективно управлять своим расписанием. Зарегистрируйтесь, чтобы начать!
        </p>
      </section>
    </div>
  );
}