'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

type ProfileViewProps = {
  onClose: () => void;
};

export default function ProfileView({ onClose }: ProfileViewProps) {
  // Sample user data - you would fetch this from your API
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    position: "Software Developer",
    department: "Engineering",
    location: "New York, NY",
    avatar: "/api/placeholder/80/80", // You can use a placeholder or actual avatar
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close profile"
        >
          <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
        </button>
      </div>
      
      {/* Profile Content */}
      <div className="flex-grow overflow-auto p-6">
        <div className="max-w-md mx-auto">
          {/* Avatar and Basic Info */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-blue-500 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h3>
            <p className="text-gray-600 mb-2">{user.position}</p>
            <p className="text-sm text-gray-500">{user.department}</p>
          </div>
          
          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h4>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 w-5 mr-3" />
                <span className="text-gray-700">{user.email}</span>
              </div>
              
              <div className="flex items-center">
                <FontAwesomeIcon icon={faPhone} className="text-gray-500 w-5 mr-3" />
                <span className="text-gray-700">{user.phone}</span>
              </div>
              
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 w-5 mr-3" />
                <span className="text-gray-700">{user.location}</span>
              </div>
            </div>
          </div>
          
          {/* Additional Information or Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
            <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}