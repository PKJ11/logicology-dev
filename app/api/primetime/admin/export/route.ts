// app/api/primetime/admin/export/route.ts - No external dependencies
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BoardAllocation from '@/app/models/BoardAllocation';
import User from '@/app/models/User';

// Helper function to convert to CSV
const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return '';
  
  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV rows
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma or quote
      const stringValue = String(value || '');
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
};

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const day = searchParams.get('day') as 'saturday' | 'sunday';
    const timeSlot = searchParams.get('timeSlot');
    const format = searchParams.get('format') || 'json'; // 'json' or 'csv'

    if (!day || !timeSlot) {
      return NextResponse.json(
        { error: 'Day and timeSlot are required' },
        { status: 400 }
      );
    }

    // Fetch boards with populated users
    const boards = await BoardAllocation.find({ day, timeSlot })
      .sort({ boardNumber: 1 })
      .populate('users', 'name email phone userType paymentStatus')
      .lean();

    // Fetch unassigned users
    const unassignedUsers = await User.find({
      'selectedSlot.day': day,
      $or: [
        { competitionSlot: { $exists: false } },
        { 'competitionSlot.day': { $ne: day } },
        { 'competitionSlot.timeSlot': { $ne: timeSlot } }
      ]
    })
    .select('name email phone userType paymentStatus selectedSlot')
    .lean();

    // Process data
    const boardUsers = boards.flatMap((board: any) => 
      (board.users || []).map((user: any) => ({
        'Board Number': board.boardNumber || 'N/A',
        'Status': 'Assigned',
        'Name': user.name || '',
        'Email': user.email || '',
        'Phone': user.phone || '',
        'User Type': user.userType || 'non-school',
        'Payment Status': user.paymentStatus || 'pending',
        'ID': user._id?.toString() || ''
      })).filter((user: any) => user.ID)
    );

    const unassignedUsersData = unassignedUsers.map((user: any) => ({
      'Board Number': 'Unassigned',
      'Status': 'Unassigned',
      'Name': user.name || '',
      'Email': user.email || '',
      'Phone': user.phone || '',
      'User Type': user.userType || 'non-school',
      'Payment Status': user.paymentStatus || 'pending',
      'Selected Day': user.selectedSlot?.day || '',
      'Selected Time Slot': user.selectedSlot?.timeSlot || '',
      'ID': user._id?.toString() || ''
    })).filter((user: any) => user.ID);

    // Combine all users
    const allUsers = [...boardUsers, ...unassignedUsersData];

    if (format.toLowerCase() === 'csv') {
      // Export as CSV
      const csvContent = convertToCSV(allUsers);
      const filename = `board-assignments-${day}-${timeSlot.replace(':', '-')}.csv`;
      
      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    } else {
      // Export as JSON (default)
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          day,
          timeSlot,
          totalUsers: allUsers.length,
          assignedUsers: boardUsers.length,
          unassignedUsers: unassignedUsersData.length
        },
        boards: boards.map((board: any) => ({
          boardNumber: board.boardNumber || 0,
          maxCapacity: board.maxUsers || 6,
          currentUsers: board.currentUsers || 0,
          users: (board.users || []).map((user: any) => ({
            _id: user._id?.toString() || '',
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            userType: user.userType || 'non-school',
            paymentStatus: user.paymentStatus || 'pending'
          })).filter((user: any) => user._id)
        })),
        unassignedUsers: unassignedUsers.map((user: any) => ({
          _id: user._id?.toString() || '',
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          userType: user.userType || 'non-school',
          paymentStatus: user.paymentStatus || 'pending',
          selectedSlot: user.selectedSlot || undefined
        })).filter((user: any) => user._id)
      };

      const filename = `board-assignments-${day}-${timeSlot.replace(':', '-')}.json`;
      
      return new Response(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    }

  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to export data',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}