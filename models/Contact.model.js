import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  starred: {
    type: Boolean,
    default: false
  },
  archived: {
    type: Boolean,
    default: false
  },
  replied: {
    type: Boolean,
    default: false
  },
  replyMessage: {
    type: String,
    default: ''
  },
  subject: {
    type: String,
    default: 'Contact Form Inquiry'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Add index for better query performance
contactSchema.index({ createdAt: -1 });
contactSchema.index({ read: 1 });
contactSchema.index({ starred: 1 });
contactSchema.index({ archived: 1 });

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;
