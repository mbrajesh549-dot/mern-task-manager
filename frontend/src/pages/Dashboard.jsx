import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await API.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Task title is required.');
            return;
        }

        try {
            if (editTaskId) {
                await API.put(`/tasks/${editTaskId}`, { title, description });
                setEditTaskId(null);
            } else {
                await API.post('/tasks', { title, description });
            }
            setTitle('');
            setDescription('');
            fetchTasks();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save task.');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
            await API.put(`/tasks/${id}`, { status: newStatus });
            fetchTasks();
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleEditClick = (task) => {
        setEditTaskId(task._id);
        setTitle(task.title);
        setDescription(task.description);
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await API.delete(`/tasks/${id}`);
                fetchTasks();
            } catch (err) {
                console.error('Error deleting task:', err);
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              task.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = statusFilter === 'all' || task.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div style={styles.dashboardWrapper}>
            {/* Top Corporate Navigation Header */}
            <nav style={styles.navbar}>
                <div style={styles.navBrand}>
                    <div style={styles.logoIcon}>T</div>
                    <span style={styles.logoText}>TaskManager<span style={{color: '#6366f1'}}>Pro</span></span>
                </div>
                <div style={styles.navUserSection}>
                    <div style={styles.userContainer}>
                        <span style={styles.avatar}>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                        <span style={styles.userName}>{user?.name || 'User'}</span>
                    </div>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </nav>

            {/* Layout Canvas Grid */}
            <div style={styles.contentCanvas}>
                <div style={styles.layoutGrid}>
                    
                    {/* Control Panel / Form Section */}
                    <div style={styles.panelCard}>
                        <div style={styles.panelHeader}>
                            <h3 style={styles.panelTitle}>{editTaskId ? '📝 Edit System Task' : '✨ Create Management Task'}</h3>
                            <p style={styles.panelSubtitle}>Input required parameters below</p>
                        </div>
                        
                        {error && <div style={styles.errorBanner}>{error}</div>}
                        
                        <form onSubmit={handleSubmit} style={styles.formStructure}>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Task Title *</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Finalize API Integration" 
                                    style={styles.formInput}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.formLabel}>Detailed Context / Description</label>
                                <textarea 
                                    placeholder="Provide operational guidelines or structural logs..." 
                                    style={styles.formTextarea}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <button type="submit" style={editTaskId ? styles.btnUpdateSubmit : styles.btnFormSubmit}>
                                {editTaskId ? 'Update Workspace Record' : 'Deploy New Task'}
                            </button>
                            {editTaskId && (
                                <button type="button" onClick={() => { setEditTaskId(null); setTitle(''); setDescription(''); }} style={styles.btnCancelEdit}>
                                    Abort Actions
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Operational Feed Section */}
                    <div style={styles.feedCard}>
                        {/* Upper Filtering Component */}
                        <div style={styles.filterToolbar}>
                            <div style={{ flex: 2 }}>
                                <input 
                                    type="text" 
                                    placeholder="🔍 Search data indexes by keywords..." 
                                    style={styles.searchComponent}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <select 
                                    style={styles.selectComponent}
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">📁 All Deployments</option>
                                    <option value="pending">⏳ Active Pending</option>
                                    <option value="completed">🌿 Settled Records</option>
                                </select>
                            </div>
                        </div>

                        {/* Title Header */}
                        <div style={styles.feedHeaderRow}>
                            <h3 style={styles.feedSectionTitle}>Active System Feed ({filteredTasks.length})</h3>
                        </div>

                        {/* Dynamic Render Tree */}
                        {filteredTasks.length === 0 ? (
                            <div style={styles.emptyStateContainer}>
                                <p style={styles.emptyStateMessage}>No records initialized matching the active criteria layout.</p>
                            </div>
                        ) : (
                            <div style={styles.cardsScrollStack}>
                                {filteredTasks.map(task => (
                                    <div key={task._id} style={{
                                        ...styles.systemCard,
                                        borderLeft: task.status === 'completed' ? '4px solid #10b981' : '4px solid #f59e0b'
                                    }}>
                                        <div style={styles.cardDataBlock}>
                                            <h4 style={{
                                                ...styles.cardDataTitle,
                                                textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                                color: task.status === 'completed' ? '#94a3b8' : '#0f172a'
                                            }}>
                                                {task.title}
                                            </h4>
                                            <p style={styles.cardDataDesc}>{task.description || 'No system logging provided for this stack.'}</p>
                                            <span style={{
                                                ...styles.statusTag,
                                                backgroundColor: task.status === 'completed' ? '#d1fae5' : '#fef3c7',
                                                color: task.status === 'completed' ? '#166534' : '#92400e'
                                            }}>
                                                {task.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div style={styles.cardControlGroup}>
                                            <button 
                                                onClick={() => handleToggleStatus(task._id, task.status)} 
                                                style={{ 
                                                    ...styles.controlBtn, 
                                                    backgroundColor: task.status === 'completed' ? '#f1f5f9' : '#eef2ff',
                                                    color: task.status === 'completed' ? '#475569' : '#4f46e5'
                                                }}
                                            >
                                                {task.status === 'completed' ? 'Reopen' : 'Finalize'}
                                            </button>
                                            <button onClick={() => handleEditClick(task)} style={{ ...styles.controlBtn, backgroundColor: '#ffffff', color: '#334155', border: '1px solid #e2e8f0' }}>
                                                Modify
                                            </button>
                                            <button onClick={() => handleDeleteTask(task._id)} style={{ ...styles.controlBtn, backgroundColor: '#fee2e2', color: '#991b1b' }}>
                                                Purge
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

// Fluid Full-Width Enterprise Theme Architecture
const styles = {
    dashboardWrapper: { width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc', boxSizing: 'border-box' },
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 32px', borderBottom: '1px solid #e2e8f0', boxSizing: 'border-box' },
    navBrand: { display: 'flex', alignItems: 'center', gap: '12px' },
    logoIcon: { width: '34px', height: '34px', backgroundColor: '#4f46e5', color: '#ffffff', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px' },
    logoText: { fontSize: '20px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px' },
    navUserSection: { display: 'flex', alignItems: 'center', gap: '24px' },
    userContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
    avatar: { width: '28px', height: '28px', backgroundColor: '#6366f1', color: '#ffffff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '13px', fontWeight: '600' },
    userName: { fontSize: '14px', fontWeight: '600', color: '#334155' },
    logoutBtn: { padding: '8px 16px', backgroundColor: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
    
    contentCanvas: { padding: '32px', boxSizing: 'border-box' },
    layoutGrid: { display: 'grid', gridTemplateColumns: 'minmax(320px, 400px) 1fr', gap: '32px', alignItems: 'start' },
    
    panelCard: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
    panelHeader: { marginBottom: '20px' },
    panelTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' },
    panelSubtitle: { fontSize: '13px', color: '#64748b', margin: '0' },
    formStructure: { display: 'flex', flexDirection: 'column', gap: '16px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    formLabel: { fontSize: '13px', fontWeight: '600', color: '#475569' },
    formInput: { padding: '11px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#1e293b', fontSize: '14px', outline: 'none' },
    formTextarea: { padding: '11px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#1e293b', fontSize: '14px', outline: 'none', height: '110px', resize: 'none', fontFamily: 'inherit' },
    btnFormSubmit: { padding: '12px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
    btnUpdateSubmit: { padding: '12px', backgroundColor: '#0ea5e9', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
    btnCancelEdit: { padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
    errorBanner: { padding: '10px 14px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '13px', fontWeight: '500', marginBottom: '10px' },

    feedCard: { display: 'flex', flexDirection: 'column', gap: '20px' },
    filterToolbar: { display: 'flex', gap: '16px', backgroundColor: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.01)' },
    searchComponent: { width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
    selectComponent: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px', color: '#475569', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' },
    
    feedHeaderRow: { borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' },
    feedSectionTitle: { fontSize: '16px', fontWeight: '700', color: '#334155', margin: '0' },
    cardsScrollStack: { display: 'flex', flexDirection: 'column', gap: '12px' },
    systemCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '18px 24px', borderRadius: '8px', border: '1px solid #e2e8f0', gap: '20px', flexWrap: 'wrap', boxShadow: '0 1px 2px rgba(0,0,0,0.01)' },
    cardDataBlock: { flex: '1', minWidth: '260px' },
    cardDataTitle: { fontSize: '15px', fontWeight: '700', margin: '0 0 4px 0' },
    cardDataDesc: { fontSize: '13px', color: '#64748b', margin: '0 0 10px 0', lineHeight: '1.5' },
    statusTag: { display: 'inline-block', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.2px' },
    cardControlGroup: { display: 'flex', gap: '8px' },
    controlBtn: { padding: '8px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
    emptyStateContainer: { padding: '48px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center' },
    emptyStateMessage: { color: '#94a3b8', fontSize: '14px', margin: '0' }
};

export default Dashboard;