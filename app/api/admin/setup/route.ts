import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../lib/db/models';

// Default tier data
const DEFAULT_TIERS = [
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
];

// Default admin user
const DEFAULT_ADMIN = {
  email: 'admin@mathology.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'super_admin'
};

export async function POST(req: NextRequest) {
  console.log('🚀 Starting database setup...');
  
  try {
    const { db } = await connectToDatabase();
    const results: any = {
      tiers: { status: 'pending', message: '', count: 0 },
      admin: { status: 'pending', message: '' },
      indexes: { status: 'pending', message: '' }
    };

    // ==================== SETUP TIERS ====================
    console.log('📦 Setting up tiers...');
    try {
      const tiersCollection = db.collection('tiers');
      
      // Check if tiers already exist
      const existingTiersCount = await tiersCollection.countDocuments();
      
      if (existingTiersCount > 0) {
        console.log(`📊 Found ${existingTiersCount} existing tiers. Updating default tiers...`);
        
        let updatedCount = 0;
        let createdCount = 0;
        
        for (const tier of DEFAULT_TIERS) {
          const result = await tiersCollection.updateOne(
            { id: tier.id },
            { 
              $set: {
                ...tier,
                updatedAt: new Date()
              }
            },
            { upsert: true }
          );
          
          if (result.upsertedCount > 0) {
            createdCount++;
            console.log(`   ✅ Created tier: ${tier.name}`);
          } else if (result.modifiedCount > 0) {
            updatedCount++;
            console.log(`   ✅ Updated tier: ${tier.name}`);
          } else {
            console.log(`   ⏺️ Tier unchanged: ${tier.name}`);
          }
        }
        
        results.tiers = {
          status: 'success',
          message: `Updated ${updatedCount} tiers, created ${createdCount} new tiers`,
          count: await tiersCollection.countDocuments()
        };
      } else {
        console.log('📊 No existing tiers found. Creating default tiers...');
        
        const result = await tiersCollection.insertMany(DEFAULT_TIERS);
        results.tiers = {
          status: 'success',
          message: `Created ${result.insertedCount} default tiers`,
          count: result.insertedCount
        };
        console.log(`   ✅ Created ${result.insertedCount} default tiers`);
      }

      // Create indexes for tiers
      await tiersCollection.createIndex({ id: 1 }, { unique: true });
      await tiersCollection.createIndex({ price: 1 });
      console.log('   ✅ Created tier indexes');

    } catch (error: any) {
      console.error('❌ Error setting up tiers:', error);
      results.tiers = {
        status: 'error',
        message: error.message,
        count: 0
      };
    }

    // ==================== SETUP ADMIN USER ====================
    console.log('\n👤 Setting up admin user...');
    try {
      const adminCollection = db.collection('admin_users');
      
      // Check if admin already exists
      const existingAdmin = await adminCollection.findOne({ email: DEFAULT_ADMIN.email });
      
      if (existingAdmin) {
        console.log(`   ⏺️ Admin user already exists: ${existingAdmin.email}`);
        results.admin = {
          status: 'success',
          message: 'Admin user already exists',
          email: existingAdmin.email,
          name: existingAdmin.name
        };
      } else {
        // Hash password
        const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
        
        // Create admin user
        const newAdmin = {
          email: DEFAULT_ADMIN.email,
          password: hashedPassword,
          name: DEFAULT_ADMIN.name,
          role: DEFAULT_ADMIN.role,
          createdAt: new Date()
        };
        
        const result = await adminCollection.insertOne(newAdmin);
        
        console.log(`   ✅ Created admin user: ${DEFAULT_ADMIN.email}`);
        results.admin = {
          status: 'success',
          message: 'Admin user created successfully',
          email: DEFAULT_ADMIN.email,
          password: DEFAULT_ADMIN.password, // Only shown in setup response
          name: DEFAULT_ADMIN.name,
          id: result.insertedId
        };
      }

      // Create admin indexes
      await adminCollection.createIndex({ email: 1 }, { unique: true });
      console.log('   ✅ Created admin indexes');

    } catch (error: any) {
      console.error('❌ Error setting up admin:', error);
      results.admin = {
        status: 'error',
        message: error.message
      };
    }

    // ==================== SETUP ACTIVITIES COLLECTION ====================
    console.log('\n📝 Setting up activities collection...');
    try {
      const activitiesCollection = db.collection('admin_activities');
      
      // Create indexes
      await activitiesCollection.createIndex({ adminId: 1 });
      await activitiesCollection.createIndex({ timestamp: -1 });
      await activitiesCollection.createIndex({ action: 1 });
      
      console.log('   ✅ Created activities indexes');
      results.activities = {
        status: 'success',
        message: 'Activities collection ready'
      };

    } catch (error: any) {
      console.error('❌ Error setting up activities:', error);
      results.activities = {
        status: 'error',
        message: error.message
      };
    }

    // ==================== SETUP CONTENT COLLECTION ====================
    console.log('\n📚 Setting up content collection...');
    try {
      const contentCollection = db.collection('content');
      
      // Create indexes
      await contentCollection.createIndex({ tierId: 1 });
      await contentCollection.createIndex({ type: 1 });
      await contentCollection.createIndex({ category: 1 });
      await contentCollection.createIndex({ createdAt: -1 });
      
      console.log('   ✅ Created content indexes');
      results.content = {
        status: 'success',
        message: 'Content collection ready'
      };

    } catch (error: any) {
      console.error('❌ Error setting up content:', error);
      results.content = {
        status: 'error',
        message: error.message
      };
    }

    // ==================== FINAL SUMMARY ====================
    console.log('\n🎉 Setup completed!');
    
    // Check if any errors occurred
    const hasErrors = Object.values(results).some((r: any) => r.status === 'error');
    
    if (hasErrors) {
      return NextResponse.json({
        success: false,
        message: 'Setup completed with errors',
        results
      }, { status: 207 }); // 207 Multi-Status
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      results
    });

  } catch (error: any) {
    console.error('❌ Fatal error during setup:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        message: 'Setup failed'
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check setup status
export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c:any) => c.name);
    
    const stats: any = {};
    
    // Get counts for each collection
    if (collectionNames.includes('tiers')) {
      stats.tiers = await db.collection('tiers').countDocuments();
    }
    if (collectionNames.includes('admin_users')) {
      stats.adminUsers = await db.collection('admin_users').countDocuments();
    }
    if (collectionNames.includes('content')) {
      stats.content = await db.collection('content').countDocuments();
    }
    if (collectionNames.includes('admin_activities')) {
      stats.activities = await db.collection('admin_activities').countDocuments();
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database status',
      collections: collectionNames,
      stats
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}