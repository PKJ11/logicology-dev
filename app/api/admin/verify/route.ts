import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../lib/db/models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    const { db } = await connectToDatabase();
    const admin = await db.collection('admin_users').findOne(
      { _id: new ObjectId(decoded.adminId) },
      { projection: { password: 0 } }
    );

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    );
  }
}