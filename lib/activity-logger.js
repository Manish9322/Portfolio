// Utility function to log activities
export const logActivity = async (activityData) => {
  try {
    const response = await fetch('/api/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      throw new Error('Failed to log activity');
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Pre-defined activity types with their icons and categories
export const ACTIVITY_TYPES = {
  // Projects
  PROJECT_CREATED: {
    action: 'Created project',
    category: 'projects',
    icon: 'Plus'
  },
  PROJECT_UPDATED: {
    action: 'Updated project',
    category: 'projects',
    icon: 'Edit'
  },
  PROJECT_DELETED: {
    action: 'Deleted project',
    category: 'projects',
    icon: 'Trash'
  },
  
  // Skills
  SKILL_ADDED: {
    action: 'Added new skill',
    category: 'skills',
    icon: 'Plus'
  },
  SKILL_UPDATED: {
    action: 'Updated skill',
    category: 'skills',
    icon: 'Edit'
  },
  SKILL_DELETED: {
    action: 'Removed skill',
    category: 'skills',
    icon: 'Trash'
  },

  // Experience
  EXPERIENCE_ADDED: {
    action: 'Added experience',
    category: 'experience',
    icon: 'Plus'
  },
  EXPERIENCE_UPDATED: {
    action: 'Updated experience',
    category: 'experience',
    icon: 'Edit'
  },
  EXPERIENCE_DELETED: {
    action: 'Removed experience',
    category: 'experience',
    icon: 'Trash'
  },

  // Education
  EDUCATION_ADDED: {
    action: 'Added education',
    category: 'education',
    icon: 'Plus'
  },
  EDUCATION_UPDATED: {
    action: 'Updated education',
    category: 'education',
    icon: 'Edit'
  },
  EDUCATION_DELETED: {
    action: 'Removed education',
    category: 'education',
    icon: 'Trash'
  },

  // Profile
  PROFILE_UPDATED: {
    action: 'Updated profile',
    category: 'profile',
    icon: 'User'
  },

  // Messages
  MESSAGE_RECEIVED: {
    action: 'Received message',
    category: 'messages',
    icon: 'MessageSquare'
  },

  // Gallery
  IMAGE_UPLOADED: {
    action: 'Uploaded image',
    category: 'gallery',
    icon: 'Plus'
  },
  IMAGE_DELETED: {
    action: 'Deleted image',
    category: 'gallery',
    icon: 'Trash'
  },

  // Blog
  BLOG_CREATED: {
    action: 'Published blog post',
    category: 'blog',
    icon: 'Plus'
  },
  BLOG_UPDATED: {
    action: 'Updated blog post',
    category: 'blog',
    icon: 'Edit'
  },
  BLOG_DELETED: {
    action: 'Deleted blog post',
    category: 'blog',
    icon: 'Trash'
  },

  // Settings
  SETTINGS_UPDATED: {
    action: 'Updated settings',
    category: 'settings',
    icon: 'Settings'
  },

  // Analytics
  PORTFOLIO_VIEWED: {
    action: 'Portfolio viewed',
    category: 'analytics',
    icon: 'Eye'
  },

  // System
  SYSTEM_INIT: {
    action: 'System initialized',
    category: 'system',
    icon: 'Settings'
  }
};

// Helper function to create activity log with pre-defined types
export const createActivityLog = async (activityType, item, details, metadata = {}) => {
  const activityTemplate = ACTIVITY_TYPES[activityType];
  
  if (!activityTemplate) {
    console.error('Invalid activity type:', activityType);
    return;
  }

  const activityData = {
    ...activityTemplate,
    item,
    details,
    metadata
  };

  return await logActivity(activityData);
};

export default logActivity;
