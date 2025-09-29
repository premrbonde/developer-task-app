import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';

const NoteList = ({ notes, onEdit, onDelete }) => {
    if (!notes || notes.length === 0) {
        return <p className="text-center text-subtle">No notes yet. Create one above!</p>;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <motion.div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {notes.map(note => (
                <motion.div 
                    key={note._id} 
                    className="card p-4 rounded-lg shadow-sm space-y-2 flex flex-col justify-between"
                    variants={itemVariants}
                    layout
                >
                    <div>
                        <h3 className="text-lg font-bold text-text">{note.title}</h3>
                        <p className="text-subtle whitespace-pre-wrap">{note.content}</p>
                    </div>
                    <div className="flex items-center justify-end space-x-2 pt-2">
                        <button
                            onClick={() => onEdit(note)}
                            className="p-2 text-subtle hover:text-primary transition-colors"
                            aria-label="Edit note"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(note._id)}
                            className="p-2 text-subtle hover:text-red-500 transition-colors"
                            aria-label="Delete note"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default NoteList;