export const DESTINATIONS = [
  {
    id: "dahilayan",
    name: "Dahilayan Adventure Park",
    description: "Home to Asia's Longest Dual Zipline. Perfect for thrill-seekers and families with pine trees and cool mountain air.",
    images: ["https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
    entranceFee: 200,
    location: { lat: 8.212, lng: 124.845, address: "Manolo Fortich, Bukidnon" },
    category: "adventure"
  },
  {
    id: "monastery",
    name: "Monastery of Transfiguration",
    description: "A pyramid-shaped chapel designed by National Artist Leandro Locsin. A place of peace and famous Monk's Blend Coffee.",
    images: ["https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
    entranceFee: 0,
    location: { lat: 7.912, lng: 125.045, address: "Malaybalay City, Bukidnon" },
    category: "culture"
  },
  {
    id: "lake-apo",
    name: "Lake Apo",
    description: "A crater lake located in a hilly area. It is known for its clean water and serene floating bamboo cottages.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
    entranceFee: 50,
    location: { lat: 7.854, lng: 125.002, address: "Valencia City, Bukidnon" },
    category: "nature"
  },
  {
    id: "cedar",
    name: "CEDAR waterfalls",
    description: "Features three amazing waterfalls: Gantungan, Natigbasan, and Dila. Perfect for hiking and forest bathing.",
    images: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800"],
    rating: 4.6,
    entranceFee: 50,
    location: { lat: 8.256, lng: 125.012, address: "Impasug-ong, Bukidnon" },
    category: "nature"
  },
  {
    id: "blue-water",
    name: "Blue Water Cave",
    description: "An enchanting underground river with crystal blue waters. A hidden gem for explorers.",
    images: ["https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&q=80&w=800"],
    rating: 4.5,
    entranceFee: 150,
    location: { lat: 7.745, lng: 125.015, address: "Quezon, Bukidnon" },
    category: "adventure"
  },
  {
    id: "mt-kitanglad",
    name: "Mt. Kitanglad Range",
    description: "A major Philippine mountain range. Home to the Philippine Eagle and incredible biodiversity.",
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
    entranceFee: 500,
    location: { lat: 8.112, lng: 124.912, address: "Lantapan, Bukidnon" },
    category: "adventure"
  },
  {
    id: "mt-dulang-dulang",
    name: "Mt. Dulang-Dulang",
    description: "The second highest peak in the Philippines, famous for its magical mossy forests.",
    images: ["https://images.unsplash.com/photo-1465146633011-14f8e0781093?auto=format&fit=crop&q=80&w=800"],
    rating: 5.0,
    entranceFee: 750,
    location: { lat: 8.115, lng: 124.925, address: "Lantapan, Bukidnon" },
    category: "adventure"
  },
  {
    id: "atugan-bridge",
    name: "Atugan Bridge",
    description: "One of the highest bridges in the Philippines, offering spectacular canyon views.",
    images: ["https://images.unsplash.com/photo-1445308306294-bfc3f79a2407?auto=format&fit=crop&q=80&w=800"],
    rating: 4.4,
    entranceFee: 0,
    location: { lat: 8.312, lng: 125.001, address: "Impasug-ong, Bukidnon" },
    category: "nature"
  },
  {
    id: "kaamulan-park",
    name: "Kaamulan Nature Park",
    description: "A sprawling park with pine trees and traditional houses, host to the annual festival.",
    images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800"],
    rating: 4.6,
    entranceFee: 20,
    location: { lat: 8.125, lng: 125.125, address: "Malaybalay City, Bukidnon" },
    category: "culture"
  },
  {
    id: "nasuli-spring",
    name: "Nasuli Cold Spring",
    description: "A natural cold spring with crystal clear blue-tinted waters, perfect for a refreshing dip.",
    images: ["https://images.unsplash.com/photo-1544123555-09e86c1db0af?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
    entranceFee: 40,
    location: { lat: 7.955, lng: 125.088, address: "Malaybalay City, Bukidnon" },
    category: "nature"
  },
  {
    id: "mt-capistrano",
    name: "Mt. Capistrano",
    description: "Famous for its unique rock formations and a 360-degree view of Bukidnon's central plains.",
    images: ["https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
    entranceFee: 50,
    location: { lat: 8.055, lng: 125.188, address: "Malaybalay City, Bukidnon" },
    category: "adventure"
  },
  {
    id: "communal-ranch",
    name: "Impasug-ong Communal Ranch",
    description: "The 'New Zealand of Bukidnon' featuring rolling green hills and pine forests.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
    entranceFee: 30,
    location: { lat: 8.355, lng: 125.022, address: "Impasug-ong, Bukidnon" },
    category: "nature"
  },
  {
    id: "overview-park",
    name: "Overview Park",
    description: "A scenic stopover offering a panoramic view of Bukidnon's mountain ranges.",
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"],
    rating: 4.5,
    entranceFee: 0,
    location: { lat: 7.655, lng: 125.055, address: "Quezon, Bukidnon" },
    category: "nature"
  },
  {
    id: "pine-ridge",
    name: "Pine Ridge Bukidnon",
    description: "A serene glamping and dining spot overlooking the lush mountains and canyons.",
    images: ["https://images.unsplash.com/photo-1445308306294-bfc3f79a2407?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
    entranceFee: 100,
    location: { lat: 8.155, lng: 125.088, address: "Malaybalay City, Bukidnon" },
    category: "nature"
  },
  {
    id: "canyon-adventure",
    name: "Canyon Adventure Park",
    description: "Experience world-class bungee jumping and heart-pounding canyon climbs.",
    images: ["https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&q=80&w=800"],
    rating: 4.6,
    entranceFee: 300,
    location: { lat: 8.212, lng: 124.945, address: "Manolo Fortich, Bukidnon" },
    category: "adventure"
  },
  {
    id: "pulangi-river",
    name: "Pulangi River Cruise",
    description: "A peaceful river cruise through the majestic landscape of Bukidnon.",
    images: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800"],
    rating: 4.4,
    entranceFee: 250,
    location: { lat: 7.745, lng: 125.015, address: "Quezon, Bukidnon" },
    category: "nature"
  },
  {
    id: "binsu-falls",
    name: "Binsu Falls",
    description: "A hidden waterfall deep in the forest, perfect for off-the-beaten-path explorers.",
    images: ["https://images.unsplash.com/photo-1544123555-09e86c1db0af?auto=format&fit=crop&q=80&w=800"],
    rating: 4.3,
    entranceFee: 50,
    location: { lat: 8.256, lng: 125.112, address: "Impasug-ong, Bukidnon" },
    category: "nature"
  },
  {
    id: "mt-kalatungan",
    name: "Mt. Kalatungan",
    description: "One of the most challenging hikes in Bukidnon, offering raw wilderness experiences.",
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
    entranceFee: 600,
    location: { lat: 7.955, lng: 124.812, address: "Pangantucan, Bukidnon" },
    category: "adventure"
  },
  {
    id: "pineapple-farm",
    name: "Del Monte Pineapple Farm",
    description: "The largest pineapple plantation in the world, stretching as far as the eye can see.",
    images: ["https://images.unsplash.com/photo-1550592704-6c76defa9985?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
    entranceFee: 0,
    location: { lat: 8.361, lng: 124.857, address: "Manolo Fortich, Bukidnon" },
    category: "nature"
  },
  {
    id: "kampo-juan",
    name: "Kampo Juan",
    description: "An eco-adventure park featuring a heritage house and the unique 'Anicycle' experience.",
    images: ["https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=800"],
    rating: 4.5,
    entranceFee: 100,
    location: { lat: 8.312, lng: 124.888, address: "Manolo Fortich, Bukidnon" },
    category: "adventure"
  },
  {
    id: "two-trees",
    name: "Two Trees Mountain",
    description: "A popular hiking spot for locals, offering a great view of Malaybalay City.",
    images: ["https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800"],
    rating: 4.6,
    entranceFee: 0,
    location: { lat: 8.125, lng: 125.135, address: "Malaybalay City, Bukidnon" },
    category: "adventure"
  },
  {
    id: "bukidnon-zoo",
    name: "Bukidnon Provincial Zoo",
    description: "A conservation area for local endemic species and an educational place for families.",
    images: ["https://images.unsplash.com/photo-1544123555-09e86c1db0af?auto=format&fit=crop&q=80&w=800"],
    rating: 4.2,
    entranceFee: 50,
    location: { lat: 8.115, lng: 125.125, address: "Malaybalay City, Bukidnon" },
    category: "nature"
  },
  {
    id: "rocky-mountain",
    name: "Rocky Mountain Bukidnon",
    description: "Dramatic rock trails and high-altitude views that few people get to see.",
    images: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800"],
    rating: 4.5,
    entranceFee: 150,
    location: { lat: 8.012, lng: 124.912, address: "Lantapan, Bukidnon" },
    category: "adventure"
  },
  {
    id: "forest-camp",
    name: "Bukidnon Forest Camp",
    description: "A cozy camping ground with pine trees, perfect for stargazing and cold nights.",
    images: ["https://images.unsplash.com/photo-1445308306294-bfc3f79a2407?auto=format&fit=crop&q=80&w=800"],
    rating: 4.4,
    entranceFee: 100,
    location: { lat: 8.212, lng: 124.845, address: "Manolo Fortich, Bukidnon" },
    category: "nature"
  },
  {
    id: "museum-itinerary",
    name: "Bukidnon State Museum",
    description: "A cultural hub preserving the artifacts and heritage of the seven tribes.",
    images: ["https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800"],
    rating: 4.5,
    entranceFee: 20,
    location: { lat: 8.125, lng: 125.125, address: "Malaybalay City, Bukidnon" },
    category: "culture"
  },
  {
    id: "stone-park",
    name: "Stone Park Bukidnon",
    description: "Unique landscape featuring giant volcanic boulders nestled in the mountains.",
    images: ["https://images.unsplash.com/photo-1465146633011-14f8e0781093?auto=format&fit=crop&q=80&w=800"],
    rating: 4.3,
    entranceFee: 50,
    location: { lat: 7.912, lng: 125.045, address: "Malaybalay City, Bukidnon" },
    category: "nature"
  }
];

export const LOCAL_BUDDIES = [
  {
    uid: "buddy1",
    name: "Christine Lynette B. Aguila",
    experience: "4 years",
    rating: 4.9,
    pricePerDay: 250,
    photoURL: "https://i.pravatar.cc/150?u=aguila",
    bio: "Passionate about Bukidnon's agricultural tourism and local history."
  },
  {
    uid: "buddy2",
    name: "Mitch Jyacenth L. Alemanio",
    experience: "5 years",
    rating: 5.0,
    pricePerDay: 300,
    photoURL: "https://i.pravatar.cc/150?u=alemanio",
    bio: "Expert mountaineer and adventure specialist. I'll take you to the highest peaks!"
  },
  {
    uid: "buddy3",
    name: "Rejean D. Cabatingan",
    experience: "3 years",
    rating: 4.8,
    pricePerDay: 200,
    photoURL: "https://i.pravatar.cc/150?u=rejean",
    bio: "Nature lover and waterfall chaser. Let's explore CEDAR together."
  },
  {
    uid: "buddy4",
    name: "Yyan April Kaye S. Daligdig",
    experience: "2 years",
    rating: 4.7,
    pricePerDay: 180,
    photoURL: "https://i.pravatar.cc/150?u=yyan",
    bio: "Cultural preservationist and storyteller. Expert on Kaamulan traditions."
  },
  {
    uid: "buddy5",
    name: "Uriah Shianne E. Rellebo",
    experience: "3 years",
    rating: 4.9,
    pricePerDay: 220,
    photoURL: "https://i.pravatar.cc/150?u=uriah",
    bio: "Certified tour guide specializing in religious and heritage sites."
  },
  {
    uid: "buddy6",
    name: "Jonaira M. Saripada",
    experience: "4 years",
    rating: 4.8,
    pricePerDay: 240,
    photoURL: "https://i.pravatar.cc/150?u=jonaira",
    bio: "Food enthusiast and budget travel expert. I know the best Binaki spots!"
  },
  {
    uid: "buddy7",
    name: "Daisy Rose Yam-oc",
    experience: "3 years",
    rating: 4.9,
    pricePerDay: 210,
    photoURL: "https://i.pravatar.cc/150?u=daisy",
    bio: "Adventure-ready guide with a focus on family-friendly destinations."
  }
];

export const FOOD_SPOTS = [
  {
    id: "roadhouse",
    name: "Roadhouse Cafe",
    priceRange: "₱₱ - ₱₱₱",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    description: "Known for the best steak and Filipino comfort food in Bukidnon.",
    location: { lat: 7.906, lng: 125.093, address: "Valencia City, Bukidnon" },
    rating: 4.5,
    menu: [
      { name: "Sizzling T-Bone Steak", price: "₱450" },
      { name: "Bukidnon Bulalo", price: "₱380" },
      { name: "Roadhouse Fried Chicken", price: "₱280" }
    ]
  },
  {
    id: "del-monte",
    name: "Del Monte Clubhouse",
    priceRange: "₱₱₱",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800",
    description: "Famous for their juicy steaks and the iconic Bukidnon Pineapple Pie.",
    location: { lat: 8.361, lng: 124.857, address: "Manolo Fortich, Bukidnon" },
    rating: 4.7,
    menu: [
      { name: "Classic Steak", price: "₱850" },
      { name: "Pineapple Pie", price: "₱120" },
      { name: "Clubhouse Sandwich", price: "₱250" }
    ]
  },
  {
    id: "binaki-stalls",
    name: "Malaybalay Binaki Stalls",
    priceRange: "₱",
    image: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=800",
    description: "Authentic steamed sweet corn tamales, a true Bukidnon delicacy.",
    location: { lat: 8.128, lng: 125.127, address: "Malaybalay City, Bukidnon" },
    rating: 4.9,
    menu: [
      { name: "Original Binaki", price: "₱20" },
      { name: "Cheese Binaki", price: "₱25" },
      { name: "Special Binaki with Milk", price: "₱30" }
    ]
  },
  {
    id: "monks-blend",
    name: "Monk's Blend Cafe",
    priceRange: "₱₱",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    description: "Home of the famous world-class coffee produced by the Benedictine Monks.",
    location: { lat: 7.912, lng: 125.045, address: "Malaybalay City, Bukidnon" },
    rating: 4.8,
    menu: [
      { name: "Premium Brew", price: "₱95" },
      { name: "Iced Caramel Macchiato", price: "₱135" },
      { name: "Monk's Pastries", price: "₱85" }
    ]
  },
  {
    id: "valencia-night-market",
    name: "Valencia Night Market",
    priceRange: "₱",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=800",
    description: "Experience the vibrant local street food scene with unlimited grilled treats.",
    location: { lat: 7.908, lng: 125.094, address: "Valencia City, Bukidnon" },
    rating: 4.4,
    menu: [
      { name: "Grilled Pork Isaw", price: "₱15" },
      { name: "Chicken Inasal", price: "₱120" },
      { name: "Bagoong Rice", price: "₱45" }
    ]
  },
  {
    id: "nelly-steakhouse",
    name: "Nelly's Steakhouse",
    priceRange: "₱₱₱",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=800",
    description: "The pioneer steakhouse using local Bukidnon-raised beef.",
    location: { lat: 8.156, lng: 125.125, address: "Malaybalay City, Bukidnon" },
    rating: 4.6,
    menu: [
      { name: "Porterhouse Special", price: "₱780" },
      { name: "Beef Salpicao", price: "₱420" },
      { name: "Nelly's Burger", price: "₱320" }
    ]
  },
  {
    id: "garden-cafe",
    name: "The Garden Cafe",
    priceRange: "₱₱",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    description: "A tropical oasis serving farm-to-table salads and fresh fruit juices.",
    location: { lat: 8.122, lng: 125.122, address: "Malaybalay City, Bukidnon" },
    rating: 4.5,
    menu: [
      { name: "Farm Fresh Garden Salad", price: "₱180" },
      { name: "Herbal Roast Chicken", price: "₱320" },
      { name: "Pineapple Coconut Smoothie", price: "₱145" }
    ]
  },
  {
    id: "valencia-grill",
    name: "Valencia Grill & Seafood",
    priceRange: "₱₱",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=800",
    description: "The go-to place for fresh grilled seafood and local Bukidnon favorites.",
    location: { lat: 7.905, lng: 125.092, address: "Valencia City, Bukidnon" },
    rating: 4.4,
    menu: [
      { name: "Grilled Large Squid", price: "₱350" },
      { name: "Baked Scallops", price: "₱280" },
      { name: "Pork Humba Bukidnon Style", price: "₱220" }
    ]
  },
  {
    id: "mountain-view-hub",
    name: "Mountain View Coffee Hub",
    priceRange: "₱₱",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    description: "Coffee with a view of the Kitanglad mountain range. Peaceful and artistic.",
    location: { lat: 8.115, lng: 124.912, address: "Lantapan, Bukidnon" },
    rating: 4.7,
    menu: [
      { name: "Single Origin Brew", price: "₱120" },
      { name: "Wildberry Cheesecake", price: "₱160" },
      { name: "Mountain Herb Tea", price: "₱90" }
    ]
  },
  {
    id: "heritage-kitchen",
    name: "Bukidnon Heritage Kitchen",
    priceRange: "₱₱",
    image: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=800",
    description: "Authentic recipes from the 7 tribes of Bukidnon. A truly cultural culinary journey.",
    location: { lat: 8.135, lng: 125.125, address: "Malaybalay City, Bukidnon" },
    rating: 4.8,
    menu: [
      { name: "Sinagupan (Rice in bamboo)", price: "₱150" },
      { name: "Minanduy (Traditional Chicken)", price: "₱280" },
      { name: "Kalandakas (Wild Fern Salad)", price: "₱120" }
    ]
  },
  {
    id: "pine-palace",
    name: "The Pine Palace Restaurant",
    priceRange: "₱₱₱",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800",
    description: "Fine dining in a cabin-style setting. Famous for its wild mushroom soup.",
    location: { lat: 8.215, lng: 124.842, address: "Manolo Fortich, Bukidnon" },
    rating: 4.6,
    menu: [
      { name: "Wild Mushroom Cream Soup", price: "₱240" },
      { name: "Slow-Cooked Beef Ribs", price: "₱650" },
      { name: "Blueberry Bliss Cake", price: "₱180" }
    ]
  },
  {
    id: "local-brew-house",
    name: "Local Brew House",
    priceRange: "₱₱",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    description: "A community-focused cafe serving Bukidnon-grown coffee and supporting local farmers.",
    location: { lat: 7.906, lng: 125.093, address: "Valencia City, Bukidnon" },
    rating: 4.5,
    menu: [
      { name: "Filter Coffee Flight", price: "₱200" },
      { name: "Cassava Cake with Cheese", price: "₱65" },
      { name: "Cold Brew Tonic", price: "₱140" }
    ]
  },
  {
    id: "riverbank-grill",
    name: "Riverbank BBQ Grill",
    priceRange: "₱",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=800",
    description: "Budget-friendly grilled meats right by the river. Great vibes and affordable prices.",
    location: { lat: 7.745, lng: 125.015, address: "Quezon, Bukidnon" },
    rating: 4.3,
    menu: [
      { name: "Pork BBQ Skewers (3pcs)", price: "₱75" },
      { name: "Grilled Tilapia", price: "₱180" },
      { name: "Unlimited Rice", price: "₱30" }
    ]
  },
  {
    id: "highland-bakery",
    name: "Highland Artisanal Bakery",
    priceRange: "₱₱",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    description: "Freshly baked sourdough and pastries made with local ingredients like Bukidnon honey.",
    location: { lat: 8.355, lng: 124.862, address: "Manolo Fortich, Bukidnon" },
    rating: 4.7,
    menu: [
      { name: "Sourdough Batard", price: "₱220" },
      { name: "Wild Honey Croissant", price: "₱110" },
      { name: "Dark Choco Chip Cookie", price: "₱85" }
    ]
  },
  {
    id: "valley-steaks",
    name: "The Valley Steaks",
    priceRange: "₱₱₱",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=800",
    description: "Premium cuts from Bukidnon cattle, expertly grilled over local hardwood.",
    location: { lat: 7.915, lng: 125.092, address: "Valencia City, Bukidnon" },
    rating: 4.6,
    menu: [
      { name: "Ribeye Steak (400g)", price: "₱1250" },
      { name: "Beef Carpaccio", price: "₱450" },
      { name: "Red Wine Reduction", price: "₱80" }
    ]
  },
  {
    id: "bamboo-bistro",
    name: "Bamboo Bistro",
    priceRange: "₱₱",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800",
    description: "Eco-friendly restaurant using bamboo for both structure and serving vessels.",
    location: { lat: 7.854, lng: 125.002, address: "Valencia City, Bukidnon" },
    rating: 4.5,
    menu: [
      { name: "Bamboo-Roasted Pork", price: "₱350" },
      { name: "Shrimp in Coconut Milk", price: "₱320" },
      { name: "Lemon Grass Tea", price: "₱60" }
    ]
  },
  {
    id: "market-fresh",
    name: "Malaybalay Market Fresh",
    priceRange: "₱",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=800",
    description: "Fast-paced market eatery serving the freshest 'Paluto' in the city.",
    location: { lat: 8.128, lng: 125.127, address: "Malaybalay City, Bukidnon" },
    rating: 4.4,
    menu: [
      { name: "Fresh Catch Tinola", price: "₱180" },
      { name: "Kinilaw na Tanigue", price: "₱220" },
      { name: "Steamed Okra with Bagoong", price: "₱45" }
    ]
  },
  {
    id: "sweet-pine-sweets",
    name: "Sweet Pine Desserts",
    priceRange: "₱₱",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    description: "Charming dessert shop specializing in pineapple-based sweets and cakes.",
    location: { lat: 8.361, lng: 124.857, address: "Manolo Fortich, Bukidnon" },
    rating: 4.6,
    menu: [
      { name: "Signature Pineapple Tart", price: "₱45" },
      { name: "Pineapple Upside-down Cake", price: "₱140" },
      { name: "Mango Pineapple Shake", price: "₱125" }
    ]
  },
  {
    id: "monk-bread-corner",
    name: "Monk's Bread Corner",
    priceRange: "₱",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    description: "Famous for the dense and delicious Monk's Bread baked daily by the brothers.",
    location: { lat: 7.912, lng: 125.045, address: "Malaybalay City, Bukidnon" },
    rating: 4.8,
    menu: [
      { name: "Whole Wheat Loaf", price: "₱95" },
      { name: "Spanish Bread", price: "₱12" },
      { name: "Pan de Coco", price: "₱12" }
    ]
  },
  {
    id: "adventure-fuel",
    name: "Adventure Fuel Cafe",
    priceRange: "₱₱",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    description: "Energy-focused meals and high-protein bowls for extreme Bukidnon travelers.",
    location: { lat: 8.212, lng: 124.845, address: "Manolo Fortich, Bukidnon" },
    rating: 4.5,
    menu: [
      { name: "Power Chicken Bowl", price: "₱280" },
      { name: "Oatberry Smoothie Bowl", price: "₱245" },
      { name: "Bulletproof Coffee", price: "₱160" }
    ]
  },
  {
    id: "tribal-smoke",
    name: "Tribal Smoke BBQ",
    priceRange: "₱₱",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=800",
    description: "Smoked meats using traditional Bukidnon tribal smoking techniques.",
    location: { lat: 8.112, lng: 124.912, address: "Lantapan, Bukidnon" },
    rating: 4.7,
    menu: [
      { name: "Smoked Tribal Pork", price: "₱320" },
      { name: "Grilled Wild Boar (Seasonal)", price: "₱450" },
      { name: "Smoky Corn on the Cob", price: "₱65" }
    ]
  }
];

export const EVENTS = [
  {
    id: "kaamulan",
    name: "Kaamulan Festival",
    date: "March",
    month: "March",
    description: "The only ethnic festival in the Philippines featuring the 7 tribes of Bukidnon. A vibrant display of culture, street dancing, and rituals.",
    location: "Malaybalay City",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800",
    category: "festival"
  },
  {
    id: "valencia-charter",
    name: "Valencia City Charter Day",
    date: "January 12",
    month: "January",
    description: "A celebration of Valencia's cityhood with street dancing, parades, and agro-industrial fairs.",
    location: "Valencia City",
    image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=800",
    category: "community"
  },
  {
    id: "malaybalay-charter",
    name: "Malaybalay City Charter Day",
    date: "June 15",
    month: "June",
    description: "Commemorating the cityhood of the province's capital with civic-military parades and cultural shows.",
    location: "Malaybalay City",
    image: "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&q=80&w=800",
    category: "community"
  },
  {
    id: "langkit-festival",
    name: "Langkit Festival",
    date: "February",
    month: "February",
    description: "Celebrating the local artisan weaving tradition of Lantapan. Colorful and textile-focused.",
    location: "Lantapan",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800",
    category: "cultural"
  },
  {
    id: "kitanglad-climb",
    name: "Annual Kitanglad Mountain Climb",
    date: "May 1-3",
    month: "May",
    description: "A grand gathering of mountaineers from all over the country to scale the Kitanglad peaks.",
    location: "Lantapan / Impasug-ong",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    category: "sports"
  },
  {
    id: "pineapple-festival",
    name: "Pineapple Festival",
    date: "August",
    month: "August",
    description: "Celebrating the bounty of the world's largest pineapple plantation in Manolo Fortich.",
    location: "Manolo Fortich",
    image: "https://images.unsplash.com/photo-1550592704-6c76defa9985?auto=format&fit=crop&q=80&w=800",
    category: "festival"
  },
  {
    id: "bukidnon-rodeo",
    name: "Bukidnon Rodeo",
    date: "April",
    month: "April",
    description: "Exciting cowboy events including bull riding and cattle wrestling in the communal ranch.",
    location: "Impasug-ong",
    image: "https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=800",
    category: "sports"
  },
  {
    id: "tribal-wedding",
    name: "Mass Tribal Wedding",
    date: "Various",
    month: "September",
    description: "Witness traditional marriage rituals of the 7 tribes in a grand communal ceremony.",
    location: "Malaybalay City",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800",
    category: "cultural"
  },
  {
    id: "zipline-marathon",
    name: "Extreme Zipline Marathon",
    date: "July",
    month: "July",
    description: "A unique sporting event testing speed and courage on Dahilayan's extreme ziplines.",
    location: "Dahilayan, Manolo Fortich",
    image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=800",
    category: "sports"
  },
  {
    id: "agro-industrial-fair",
    name: "Bukidnon Agro-Industrial Fair",
    date: "March",
    month: "March",
    description: "Showcasing the massive agricultural potential and products of Bukidnon's fertile lands.",
    location: "Malaybalay City",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
    category: "community"
  },
  {
    id: "bird-watching-tour",
    name: "Kitanglad Bird Watching Week",
    date: "February",
    month: "February",
    description: "Specialized tours to spot the Philippine Eagle and other endemic high-altitude birds.",
    location: "Lantapan",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    category: "nature"
  },
  {
    id: "binaki-cook-off",
    name: "Grand Binaki Cook-Off",
    date: "October",
    month: "October",
    description: "Local chefs compete to create the most innovative binaki (corn tamales) variations.",
    location: "Malaybalay City",
    image: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=800",
    category: "community"
  },
  {
    id: "mt-capistrano-race",
    name: "Mt. Capistrano Trail Run",
    date: "November",
    month: "November",
    description: "A challenging trail race up the rocky peaks of Mt. Capistrano with breathtaking views.",
    location: "Malaybalay City",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800",
    category: "sports"
  },
  {
    id: "monks-silent-retreat",
    name: "Monastery Silent Retreat Week",
    date: "December",
    month: "December",
    description: "A week of contemplation and peace at the Monastery of Transfiguration.",
    location: "Malaybalay City",
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800",
    category: "cultural"
  },
  {
    id: "valley-music-fest",
    name: "Bukidnon Valley Music Fest",
    date: "May",
    month: "May",
    description: "Outdoor music festival featuring local folk artists and ethno-pop performers.",
    location: "Valencia City",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
    category: "community"
  },
  {
    id: "harvest-thanksgiving",
    name: "Tribal Harvest Thanksgiving",
    date: "September",
    month: "September",
    description: "Traditional rituals thanking the spirits for a bountiful harvest in the highlands.",
    location: "Various tribal settlements",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
    category: "cultural"
  },
  {
    id: "mountain-bike-challenge",
    name: "Bukidnon MTB Challenge",
    date: "April",
    month: "April",
    description: "Enduro and cross-country mountain bike races through pine forests and ridges.",
    location: "Manolo Fortich",
    image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=800",
    category: "sports"
  },
  {
    id: "quezon-charter",
    name: "Quezon Charter Day",
    date: "June 18",
    month: "June",
    description: "Celebrating the founding of Quezon municipality with river events and local food fairs.",
    location: "Quezon, Bukidnon",
    image: "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&q=80&w=800",
    category: "community"
  },
  {
    id: "coffee-expo",
    name: "Bukidnon Coffee Expo",
    date: "November",
    month: "November",
    description: "Gathering coffee farmers, roasters, and enthusiasts to promote Bukidnon's world-class beans.",
    location: "Malaybalay City",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    category: "community"
  },
  {
    id: "heritage-photo-contest",
    name: "Bukidnon Heritage Photo Week",
    date: "August",
    month: "August",
    description: "A week-long photo expedition focusing on the people and landscapes of Bukidnon.",
    location: "Province-wide",
    image: "https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=800",
    category: "cultural"
  },
  {
    id: "adventure-film-fest",
    name: "Bukidnon Adventure Film Festival",
    date: "December",
    month: "December",
    description: "Showcasing short films featuring extreme sports and nature exploration in the province.",
    location: "Valencia City",
    image: "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&q=80&w=800",
    category: "community"
  },
  {
    id: "seven-tribes-run",
    name: "Seven Tribes Half Marathon",
    date: "October",
    month: "October",
    description: "A scenic road race through the heart of Malaybalay, celebrating tribal unity.",
    location: "Malaybalay City",
    image: "https://images.unsplash.com/photo-1445308306294-bfc3f79a2407?auto=format&fit=crop&q=80&w=800",
    category: "sports"
  }
];
