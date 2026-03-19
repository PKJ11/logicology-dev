import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/app/lib/admin-auth';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'month';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    let previousStartDate = new Date();

    switch (range) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        previousStartDate.setDate(previousStartDate.getDate() - 1);
        previousStartDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        previousStartDate.setDate(previousStartDate.getDate() - 14);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        previousStartDate.setMonth(previousStartDate.getMonth() - 2);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 2);
        break;
    }

    const { db } = await connectToDatabase();

    // Get user stats
    const totalUsers = await db.collection('community').countDocuments();
    const newUsers = await db.collection('community').countDocuments({
      createdAt: { $gte: startDate }
    });

    // Get subscription stats
    const activeSubscriptions = await db.collection('subscriptions')
      .countDocuments({ status: 'active' });

    const newSubscriptions = await db.collection('subscriptions')
      .countDocuments({
        status: 'active',
        startDate: { $gte: startDate }
      });

    // Get revenue stats
    const payments = await db.collection('payments')
      .aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
      .toArray();
    const totalRevenue = payments[0]?.total || 0;

    const recentPayments = await db.collection('payments')
      .aggregate([
        { $match: { status: 'success', createdAt: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
      .toArray();
    const recentRevenue = recentPayments[0]?.total || 0;

    // Get content stats
    const contentItems = await db.collection('content').countDocuments();
    const newContent = await db.collection('content').countDocuments({
      createdAt: { $gte: startDate }
    });

    // Get content by type
    const worksheets = await db.collection('content')
      .countDocuments({ type: 'worksheet' });
    const wordwall = await db.collection('content')
      .countDocuments({ type: 'wordwall' });
    const mindstamp = await db.collection('content')
      .countDocuments({ type: 'mindstamp' });
    const games = await db.collection('content')
      .countDocuments({ type: 'game' });
    const assessments = await db.collection('content')
      .countDocuments({ type: 'assessment' });
    const externalLinks = await db.collection('content')
      .countDocuments({ type: 'external_link' });

    // Get tier distribution
    const tierDistribution = await db.collection('subscriptions')
      .aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$tierId', count: { $sum: 1 } } }
      ])
      .toArray();

    // Get tier details
    const tiers = await db.collection('tiers')
      .find({})
      .sort({ id: 1 })
      .toArray();

    const tierStats = tiers.map((tier:any) => {
      const subscribers = tierDistribution.find((t:any) => t._id === tier.id)?.count || 0;
      const revenue = subscribers * tier.price;
      return {
        id: tier.id,
        name: tier.name,
        subscribers,
        revenue,
        color: tier.color
      };
    });

    // Get recent activities
    const recentActivities = await db.collection('admin_activities')
      .find({})
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    // Format activities
    const formattedActivities = await Promise.all(recentActivities.map(async (activity:any) => {
      let user = 'System';
      if (activity.adminId) {
        const admin = await db.collection('admin_users').findOne(
          { _id: new ObjectId(activity.adminId) },
          { projection: { name: 1 } }
        );
        user = admin?.name || 'Unknown Admin';
      }

      const timeDiff = Math.floor((Date.now() - new Date(activity.timestamp).getTime()) / 60000);
      let timeString = '';
      if (timeDiff < 1) timeString = 'Just now';
      else if (timeDiff < 60) timeString = `${timeDiff} min ago`;
      else if (timeDiff < 1440) timeString = `${Math.floor(timeDiff / 60)} hours ago`;
      else timeString = `${Math.floor(timeDiff / 1440)} days ago`;

      let action = activity.action;
      let details = '';
      let type = 'activity';

      if (activity.action.includes('content')) {
        type = 'content';
        if (activity.details?.title) {
          details = activity.details.title;
        }
      } else if (activity.action.includes('subscription')) {
        type = 'subscription';
      } else if (activity.action.includes('user')) {
        type = 'user';
      }

      return {
        id: activity._id.toString(),
        user,
        action: activity.action.replace(/_/g, ' '),
        details,
        time: timeString,
        timestamp: activity.timestamp,
        tier: activity.details?.tierId,
        type
      };
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        newUsers,
        activeSubscriptions,
        newSubscriptions,
        totalRevenue,
        recentRevenue,
        contentItems,
        newContent,
        worksheets,
        wordwall,
        mindstamp,
        games,
        assessments,
        externalLinks,
      },
      tierStats,
      recentActivities: formattedActivities
    });

  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}