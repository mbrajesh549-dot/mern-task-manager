import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const res = await API.post('/auth/login', formData);
            // Token aur user details ko LocalStorage me save karna
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Login to Task Manager</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        style={styles.input}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        style={styles.input}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                <p style={styles.text}>
                    Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

// Styles carry forwarded from Register component for consistency
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' },
    card: { padding: '30px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0,1)', width: '100%', maxWidth: '400px' },
    heading: { marginBottom: '20px', textAlign: 'center', color: '#333' },
    input: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
    button: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
    error: { color: 'red', marginBottom: '15px', textAlign: 'center' },
    text: { marginTop: '15px', textAlign: 'center', color: '#666' },
    link: { color: '#007bff', textDecoration: 'none' }
};

export default Login;