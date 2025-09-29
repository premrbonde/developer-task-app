import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

const ProfileImageUpload = ({ onImageUpload, existingImage }) => {
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (existingImage) {
      setPreviewImage(`http://localhost:5000/${existingImage.replace(/\\/g, '/')}`);
    }
  }, [existingImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      onImageUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full bg-surface mb-4 overflow-hidden ring-4 ring-primary/20">
          {previewImage ? (
            <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-subtle">
              <Camera size={48} />
            </div>
          )}
        </div>
        <label htmlFor="profile-image-input" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera size={32} className="text-white" />
        </label>
      </div>
      <input
        id="profile-image-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
       <label htmlFor="profile-image-input" className="btn-primary cursor-pointer">
        Change Image
      </label>
    </div>
  );
};

export default ProfileImageUpload;
