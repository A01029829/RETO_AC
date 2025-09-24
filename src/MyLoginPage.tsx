import { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';

export const MyLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = (e: any) => {
        e.preventDefault();
        login({ username, password }).catch(() =>
            notify('Usuario o contraseña incorrectos')
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Usuario"
            />
            <input
                name="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Contraseña"
            />
            <button type="submit">Login</button>
        </form>
    );
};
