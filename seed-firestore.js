// One-time script to seed Firestore with empty data structure
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

console.log('🔥 Starting Firestore Structure Setup...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupFirestoreStructure() {
  try {
    console.log('📝 Setting up empty collections...');
    
    // Create empty collections with structure examples
    const emptyDestinations = [
      {
        id: 'dahilayan-adventure-park',
        name: 'Dahilayan Adventure Park',
        description: 'Thrilling ziplines and outdoor activities in the cool highlands of Bukidnon.',
        images: ['https://images.unsplash.com/photo-1501785888041-af3ef285b470'],
        rating: 4.7,
        entranceFee: 350,
        location: { lat: 8.1569, lng: 124.8925, address: 'Dahilayan, Bukidnon' },
        category: 'adventure'
      }
    ];

    const emptyFoodSpots = [
      {
        id: 'kaamulan-cafe',
        name: 'Kaamulan Cafe',
        priceRange: '₱₱',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        description: 'Authentic Bukidnon cuisine with a view of the mountains.',
        location: { lat: 8.1575, lng: 125.1289, address: 'Malaybalay City, Bukidnon' },
        rating: 4.5,
        menu: [
          { name: 'Binaki (Steamed Corn Cake)', price: '₱50', category: 'Local Delicacy' },
          { name: 'Pinais na Manok', price: '₱180', category: 'Main Course' }
        ]
      }
    ];

    const emptyEvents = [
      {
        id: 'kaamulan-festival',
        name: 'Kaamulan Festival',
        date: 'March 1-31',
        month: 'March',
        description: 'Annual ethnic cultural festival celebrating the seven tribal groups of Bukidnon.',
        location: 'Malaybalay City, Bukidnon',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa',
        category: 'festival'
      }
    ];

    console.log('📍 Creating empty destinations collection...');
    for (const destination of emptyDestinations) {
      await setDoc(doc(db, 'destinations', destination.id), destination);
    }
    console.log('✅ Destinations collection ready!\n');

    console.log('🍽️  Creating empty food spots collection...');
    for (const foodSpot of emptyFoodSpots) {
      await setDoc(doc(db, 'foodSpots', foodSpot.id), foodSpot);
    }
    console.log('✅ Food spots collection ready!\n');

    console.log('📅 Creating empty events collection...');
    for (const event of emptyEvents) {
      await setDoc(doc(db, 'events', event.id), event);
    }
    console.log('✅ Events collection ready!\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 SUCCESS! Firestore structure is ready!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 What was created:');
    console.log('   • destinations collection (with 1 example)');
    console.log('   • foodSpots collection (with 1 example)');
    console.log('   • events collection (with 1 example)');
    console.log('\n🚀 How to add your own data:');
    console.log('   1. Go to: http://localhost:3008/admin');
    console.log('   2. Sign in as admin@gmail.com');
    console.log('   3. Click "Grant Admin Access"');
    console.log('   4. Click "Add New" button');
    console.log('   5. Fill in your real data:');
    console.log('      - Use online image URLs');
    console.log('      - Add 50+ items for each category');
    console.log('      - Use real Bukidnon locations');
    console.log('\n💡 Tip: Delete the example items after adding your own data.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up Firestore:', error);
    process.exit(1);
  }
}

setupFirestoreStructure();
