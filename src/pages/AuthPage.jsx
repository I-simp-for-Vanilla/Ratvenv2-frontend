import { useState } from 'react';
import { Link } from 'react-router';
import Logo from '../components/ui/Logo';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';

/** Props : onLogin({username, password}), onRegister({email, username, password}). */
export default function AuthPage({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login');
  const [show, setShow] = useState(false);
  const [v, setV] = useState({ email: '', username: '', password: '' });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const register = mode === 'register';

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (register && !/^\S+@\S+\.\S+$/.test(v.email)) err.email = 'Saisissez une adresse e-mail valide.';
    if (v.username.trim().length < 3) err.username = '3 caractères minimum.';
    if (v.password.length < 8) err.password = '8 caractères minimum.';
    setErrors(err);
    if (Object.keys(err).length) return;
    register ? onRegister?.(v) : onLogin?.({ username: v.username, password: v.password });
  };

  return (
    <div className="auth">
      <section className="auth-brand">
        <Link to="/" className="brand"><Logo size={32} /><span>Ratven</span></Link>
        <div>
          <h2>Vos bases de données, sous contrôle.</h2>
          <p>Explorez vos tables, écrivez vos requêtes SQL et gardez un terminal à portée de main, sur une base locale ou distante.</p>
        </div>
        <span className="muted" style={{ fontSize: 12.5 }}>Ratven</span>
      </section>
      <section className="auth-panel">
        <div className="card auth-card">
          <div className="segmented" role="tablist">
            <button role="tab" type="button" aria-selected={!register} onClick={() => { setMode('login'); setErrors({}); }}>Connexion</button>
            <button role="tab" type="button" aria-selected={register} onClick={() => { setMode('register'); setErrors({}); }}>Inscription</button>
          </div>
          <form className="auth-form" onSubmit={submit} noValidate>
            {register && <Field label="Adresse e-mail" type="email" icon="envelope" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" />}
            <Field label="Nom d’utilisateur" icon="person" value={v.username} onChange={set('username')} error={errors.username} autoComplete="username" />
            <Field label="Mot de passe" icon="lock" type={show ? 'text' : 'password'} value={v.password} onChange={set('password')} error={errors.password}
              autoComplete={register ? 'new-password' : 'current-password'}
              end={<button type="button" className="btn-icon" aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} onClick={() => setShow((s) => !s)}><i className={`bi bi-eye${show ? '-slash' : ''}`} /></button>} />
            <Button variant="primary" type="submit" style={{ height: 40 }}>{register ? 'Créer mon compte' : 'Se connecter'}</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
