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
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#236eb1'
        }}>
            <div style={{
                display: 'flex',
                width: '1400px',
                height: '700px',
                borderRadius: '15px',
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
            }}>
                {/* Lado izquierdo */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#e0eef1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                    gap: '20px'
                }}>
                    <img src="https://cuajimalpa.gob.mx/wp-content/uploads/2025/01/logo.png" alt="Imagen 1" style={{ width: '480px', height: '140px', objectFit: 'cover', borderRadius: '0px' }} />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Proteccion-civil-logo-gen.png" alt="Imagen 2" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px' }} />
                </div>

                {/* Lado derecho */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '40px',
                    alignItems: 'center'
                }}>
                    <h2 style={{ marginBottom: '30px', color: '#333', fontFamily: 'Open Sans, sans-serif', fontSize: '40px'}}>INICIO DE SESIÓN</h2>
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            name="username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Usuario"
                            style={{
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '18px',
                                fontFamily: 'Open Sans, sans-serif'
                            }}
                        />
                        <input
                            name="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            style={{
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '18px',
                                fontFamily: 'Open Sans, sans-serif'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '15px',
                                borderRadius: '5px',
                                border: 'none',
                                backgroundColor: '#236eb1',
                                color: 'white',
                                fontSize: '20px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s',
                                fontFamily: 'Open Sans, sans-serif'
                            }}
                            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1f5a92')}
                            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#236eb1')}
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
