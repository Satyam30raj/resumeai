import React, { useState } from 'react';
import useResumeStore from '../../store/resumeStore';
import { uploadAPI } from '../../services/api';
import { Upload, X, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PersonalInfoForm() {
  const resume = useResumeStore((state) => state.resume);
  const updateSection = useResumeStore((state) => state.updateSection);
  const setImageUrl = useResumeStore((state) => state.setImageUrl);

  const personalInfo = resume?.sections?.personalInfo || resume?.personalInfo || {};
  const imageUrl = resume?.imageUrl || personalInfo.imageUrl || '';

  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSection('personalInfo', {
      ...personalInfo,
      [name]: value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const res = await uploadAPI.uploadImage(formData);
      const url = res.data?.data?.url || res.data?.url;
      setImageUrl(url);
      updateSection('personalInfo', {
        ...personalInfo,
        imageUrl: url,
      });
      toast.success('Profile image updated');
    } catch {
      toast.error('Image upload failed. You can paste an image URL directly.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    updateSection('personalInfo', {
      ...personalInfo,
      imageUrl: '',
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
        <p className="text-xs text-gray-500">
          This header information introduces you and allows recruiters to contact you.
        </p>
      </div>

      {/* Profile Image Section */}
      <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        {imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
            <User className="w-8 h-8" />
          </div>
        )}
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Profile Photo (Optional)
          </label>
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm">
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </label>
          <p className="text-[11px] text-gray-400 mt-1">PNG, JPG up to 5MB. ATS-friendly templates omit photos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={personalInfo.fullName || ''}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            type="email"
            name="email"
            value={personalInfo.email || ''}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={personalInfo.phone || ''}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={personalInfo.location || ''}
            onChange={handleChange}
            placeholder="San Francisco, CA or Remote"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">LinkedIn Profile</label>
          <input
            type="url"
            name="linkedin"
            value={personalInfo.linkedin || ''}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">GitHub Profile</label>
          <input
            type="url"
            name="github"
            value={personalInfo.github || ''}
            onChange={handleChange}
            placeholder="https://github.com/username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Portfolio / Website</label>
          <input
            type="url"
            name="portfolio"
            value={personalInfo.portfolio || ''}
            onChange={handleChange}
            placeholder="https://yourportfolio.dev"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
