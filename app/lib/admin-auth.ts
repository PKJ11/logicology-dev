import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../api/lib/db/models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';

export async function verifyAdmin(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    const { db } = await connectToDatabase();
    const admin = await db.collection('admin_users').findOne(
      { _id: new ObjectId(decoded.adminId) },
      { projection: { password: 0 } }
    );

    if (!admin) {
      return null;
    }

    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role
    };
  } catch (error) {
    return null;
  }
}