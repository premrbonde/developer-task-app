import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProfileImageUpload from '../components/ProfileImageUpload';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Mail } from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/profile');
      setUser(res.data);
      setFormData({ username: res.data.username, email: res.data.email });
    } catch (err) {
      toast.error('Could not fetch profile data.');
    }
  }, [setUser]);

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username, email: user.email });
    } else {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (file) => {
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Updating profile...');

    try {
      const updateData = new FormData();
      updateData.append('username', formData.username);
      updateData.append('email', formData.email);
      if (selectedImage) {
        updateData.append('profileImage', selectedImage);
      }

      const response = await api.put('/profile', updateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUser(response.data.user);
      toast.success('Profile updated successfully!', { id: toastId });
      setSelectedImage(null); // Reset image state after successful upload
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.', { id: toastId });
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card p-8">
        <h2 className="text-3xl font-bold text-center text-text mb-8">Your Profile</h2>
        
        <ProfileImageUpload onImageUpload={handleImageUpload} existingImage={user?.profileImage} />

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="input-field pl-10"
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field pl-10"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfilePage;