import React, { useState, useEffect } from 'react';

const NoteForm = ({ onSave, initialData, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ title, content });
        setTitle('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <input
                    type="text"
                    placeholder="Note Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    required
                />
            </div>
            <div>
                <textarea
                    placeholder="Note Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="4"
                    className="input-field"
                    required
                />
            </div>
            <div className="flex items-center space-x-4">
                 <button
                    type="submit"
                    className="btn-primary"
                >
                    {initialData ? 'Update Note' : 'Add Note'}
                </button>
                 {initialData && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default NoteForm;