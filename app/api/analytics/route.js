import { NextResponse } from "next/server";
import _db from '@/utils/db';
import Activity from '@/models/Activity.model';

// Helper function to create activity log
const logActivity = async (action, item, details, category = 'analytics', icon = 'Eye') => {
  try {
    await Activity.create({
      action,
      item,
      details,
      category,
      icon,
      user: 'System'
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// POST - Log analytics events
export async function POST(request) {
  try {
    await _db();

    const body = await request.json();
    const { event, data } = body;

    switch (event) {
      case 'portfolio_view':
        await logActivity(
          'Portfolio viewed',
          `${data?.source || 'Direct'} visitor`,
          `Portfolio viewed by visitor from ${data?.source || 'direct access'}`,
          'analytics',
          'Eye'
        );
        break;
        
      case 'contact_form_view':
        await logActivity(
          'Contact form viewed',
          'Contact page',
          'Someone viewed the contact form page',
          'analytics',
          'Eye'
        );
        break;
        
      case 'project_view':
        await logActivity(
          'Project viewed',
          data?.projectName || 'Project',
          `Project "${data?.projectName}" was viewed by a visitor`,
          'analytics',
          'Eye'
        );
        break;
        
      case 'blog_view':
        await logActivity(
          'Blog post viewed',
          data?.blogTitle || 'Blog Post',
          `Blog post "${data?.blogTitle}" was viewed by a visitor`,
          'analytics',
          'Eye'
        );
        break;
        
      default:
        await logActivity(
          'Unknown event',
          event,
          `Analytics event: ${event}`,
          'analytics',
          'Eye'
        );
    }

    return NextResponse.json({ message: 'Analytics event logged successfully' });

  } catch (error) {
    console.error("Error logging analytics:", error);
    return NextResponse.json(
      { error: "Failed to log analytics event" },
      { status: 500 }
    );
  }
}
