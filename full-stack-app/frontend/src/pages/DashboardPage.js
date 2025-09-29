import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchNotes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/notes?search=${searchTerm}`);
            setNotes(response.data);
        } catch (err) {
            toast.error('Failed to fetch notes.');
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchNotes();
        }, 300); // Debounce search input

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchNotes]);

    const handleSaveNote = async (noteData) => {
        try {
            if (editingNote) {
                // Update existing note
                const response = await api.put(`/notes/${editingNote._id}`, noteData);
                setNotes(notes.map(note => note._id === editingNote._id ? response.data : note));
                toast.success('Note updated successfully!');
            } else {
                // Create new note
                const response = await api.post('/notes', noteData);
                setNotes([response.data, ...notes]);
                toast.success('Note created successfully!');
            }
            setEditingNote(null);
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${editingNote ? 'update' : 'create'} note.`);
        }
    };

    const handleEdit = (note) => {
        setEditingNote(note);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await api.delete(`/notes/${id}`);
                setNotes(notes.filter(note => note._id !== id));
                toast.success('Note deleted successfully!');
            } catch (err) {
                toast.error('Failed to delete note.');
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingNote(null);
    };

    return (
        <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-bold text-text">Dashboard</h1>

            <motion.div className="card" layout>
                <h2 className="text-2xl font-semibold mb-4 text-text">{editingNote ? 'Edit Note' : 'Create a New Note'}</h2>
                <NoteForm
                    onSave={handleSaveNote}
                    initialData={editingNote}
                    onCancel={handleCancelEdit}
                />
            </motion.div>

            <div className="card">
                <h2 className="text-2xl font-semibold mb-4 text-text">Your Notes</h2>
                 <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field"
                    />
                </div>
                {loading ? (
                    <p className="text-subtle">Loading notes...</p>
                ) : (
                    <NoteList notes={notes} onEdit={handleEdit} onDelete={handleDelete} />
                )}
            </div>
        </motion.div>
    );
};

export default DashboardPage;