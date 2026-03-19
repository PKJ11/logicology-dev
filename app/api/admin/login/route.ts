import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../lib/db/models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const { db } = await connectToDatabase();
    const admin = await db.collection('admin_users').findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Log activity
    await db.collection('admin_activities').insertOne({
      adminId: admin._id,
      action: 'login',
      timestamp: new Date(),
      ip: req.headers.get('x-forwarded-for') || 'unknown'
    });

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}