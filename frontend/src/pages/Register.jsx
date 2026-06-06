import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Form Validation and Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic Frontend Validation
        if (!formData.name || !formData.email || !formData.password) {
            setError('All fields are required.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            await API.post('/auth/register', formData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Create an Account</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        style={styles.input}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
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
                    <button type="submit" style={styles.button}>Register</button>
                </form>
                <p style={styles.text}>
                    Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' },
    card: { padding: '30px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0,1)', width: '100%', maxWidth: '400px' },
    heading: { marginBottom: '20px', textAlign: 'center', color: '#333' },
    input: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
    button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
    error: { color: 'red', marginBottom: '15px', textAlign: 'center' },
    text: { marginTop: '15px', textAlign: 'center', color: '#666' },
    link: { color: '#007bff', textDecoration: 'none' }
};

export default Register;