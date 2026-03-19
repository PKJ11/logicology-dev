import { MongoClient, Db } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = process.env.MONGO_DB_NAME || 'logicology';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Initialize database with required collections and indexes
export async function initializeDatabase() {
  const { db } = await connectToDatabase();

  // Create collections if they don't exist
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);

  if (!collectionNames.includes('tiers')) {
    await db.createCollection('tiers');
    // Insert default tiers
    await db.collection('tiers').insertMany([
      {
        id: 1,
        name: 'Free',
        price: 0,
        description: 'Basic access to worksheets',
        color: 'from-gray-500 to-gray-600',
        features: [
          '✓ Printable Worksheets',
          '✓ Basic puzzles',
          '✓ Community access',
          '✓ 5 downloads per month'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Pro',
        price: 99,
        description: 'Interactive games and activities',
        color: 'from-blue-500 to-blue-600',
        features: [
          '✓ Everything in Free',
          '✓ Wordwall games',
          '✓ Interactive learning games',
          '✓ 20 downloads per month',
          '✓ Priority support'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Premium',
        price: 199,
        description: 'Video lessons and advanced content',
        color: 'from-purple-500 to-purple-600',
        features: [
          '✓ Everything in Pro',
          '✓ Mindstamp interactive videos',
          '✓ Video lessons library',
          '✓ Unlimited downloads',
          '✓ Progress tracking'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Ultimate',
        price: 499,
        description: 'Complete learning package',
        color: 'from-orange-500 to-orange-600',
        features: [
          '✓ Everything in Premium',
          '✓ Assessments & quizzes',
          '✓ Personalized feedback',
          '✓ Certificate generation',
          '✓ 1-on-1 mentoring sessions'
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  }

  if (!collectionNames.includes('content')) {
    await db.createCollection('content');
    // Create indexes
    await db.collection('content').createIndex({ tierId: 1 });
    await db.collection('content').createIndex({ type: 1 });
    await db.collection('content').createIndex({ category: 1 });
  }

  if (!collectionNames.includes('admin_users')) {
    await db.createCollection('admin_users');
    // Create default admin user (you should change this)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.collection('admin_users').insertOne({
      email: 'admin@m.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'super_admin',
      createdAt: new Date()
    });
  }

  if (!collectionNames.includes('admin_activities')) {
    await db.createCollection('admin_activities');
    await db.collection('admin_activities').createIndex({ adminId: 1 });
    await db.collection('admin_activities').createIndex({ createdAt: -1 });
  }

  console.log('Database initialized successfully');
}