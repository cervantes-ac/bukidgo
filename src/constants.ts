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
    images: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
    entranceFee: 50,
    location: { lat: 7.854, lng: 125.002, address: "Valencia City, Bukidnon" },
    category: "nature"
  },
  {
    id: "cedar",
    name: "CEDAR waterfalls",
    description: "Features three amazing waterfalls: Gantungan, Natigbasan, and Dila. Perfect for hiking and forest bathing.",
    images: ["https://images.unsplash.com/photo-1544123555-09e86c1db0af?auto=format&fit=crop&q=80&w=800"],
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
    location: { lat: 8.113, lng: 124.922, address: "Lantapan, Bukidnon" },
    category: "adventure"
  },
  {
    id: "atugan-bridge",
    name: "Atugan Bridge",
    description: "One of the highest bridges in the Philippines, offering spectacular canyon views.",
    images: ["https://images.unsplash.com/photo-1445308306294-bfc3f79a2407?auto=format&fit=crop&q=80&w=800"],
    rating: 4.4,
    entranceFee: 0,
    location: { lat: 8.324, lng: 125.011, address: "Impasug-ong, Bukidnon" },
    category: "nature"
  },
  {
    id: "kaamulan-park",
    name: "Kaamulan Nature Park",
    description: "A sprawling park with pine trees and traditional houses, host to the annual festival.",
    images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800"],
    rating: 4.6,
    entranceFee: 20,
    location: { lat: 8.131, lng: 125.127, address: "Malaybalay City, Bukidnon" },
    category: "culture"
  },
  {
    id: "nasuli-spring",
    name: "Nasuli Cold Spring",
    description: "A natural cold spring with crystal clear blue-tinted waters, perfect for a refreshing dip.",
    images: ["https://images.unsplash.com/photo-1544123555-09e86c1db0af?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
    entranceFee: 40,
    location: { lat: 7.954, lng: 125.087, address: "Malaybalay City, Bukidnon" },
    category: "nature"
  },
  {
    id: "mt-capistrano",
    name: "Mt. Capistrano",
    description: "Famous for its unique rock formations and a 360-degree view of Bukidnon's central plains.",
    images: ["https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
    entranceFee: 50,
    location: { lat: 8.051, lng: 125.182, address: "Malaybalay City, Bukidnon" },
    category: "adventure"
  },
  {
    id: "communal-ranch",
    name: "Impasug-ong Communal Ranch",
    description: "The 'New Zealand of Bukidnon' featuring rolling green hills and pine forests.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=800"],
    rating: 4.9,
    entranceFee: 30,
    location: { lat: 8.356, lng: 125.021, address: "Impasug-ong, Bukidnon" },
    category: "nature"
  },
  {
    id: "overview-park",
    name: "Overview Park",
    description: "A scenic stopover offering a panoramic view of Bukidnon's mountain ranges.",
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"],
    rating: 4.5,
    entranceFee: 0,
    location: { lat: 7.652, lng: 125.051, address: "Quezon, Bukidnon" },
    category: "nature"
  },
  {
    id: "pine-ridge",
    name: "Pine Ridge Bukidnon",
    description: "A serene glamping and dining spot overlooking the lush mountains and canyons.",
    images: ["https://images.unsplash.com/photo-1445308306294-bfc3f79a2407?auto=format&fit=crop&q=80&w=800"],
    rating: 4.7,
    entranceFee: 100,
    location: { lat: 8.151, lng: 125.082, address: "Malaybalay City, Bukidnon" },
    category: "nature"
  },
  {
    id: "canyon-adventure",
    name: "Canyon Adventure Park",
    description: "Experience world-class bungee jumping and heart-pounding canyon climbs.",
    images: ["https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&q=80&w=800"],
    rating: 4.6,
    entranceFee: 300,
    location: { lat: 8.211, lng: 124.942, address: "Manolo Fortich, Bukidnon" },
    category: "adventure"
  },
  {
    id: "pulangi-river",
    name: "Pulangi River Cruise",
    description: "A peaceful river cruise through the majestic landscape of Bukidnon.",
    images: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800"],
    rating: 4.4,
    entranceFee: 250,
    location: { lat: 7.741, lng: 125.012, address: "Quezon, Bukidnon" },
    category: "nature"
  },
  {
    id: "binsu-falls",
    name: "Binsu Falls",
    description: "A hidden waterfall deep in the forest, perfect for off-the-beaten-path explorers.",
    images: ["https://images.unsplash.com/photo-1544123555-09e86c1db0af?auto=format&fit=crop&q=80&w=800"],
    rating: 4.3,
    entranceFee: 50,
    location: { lat: 8.251, lng: 125.111, address: "Impasug-ong, Bukidnon" },
    category: "nature"
  },
  {
    id: "mt-kalatungan",
    name: "Mt. Kalatungan",
    description: "One of the most challenging hikes in Bukidnon, offering raw wilderness experiences.",
    images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"],
    rating: 4.8,
    entranceFee: 600,
    location: { lat: 7.952, lng: 124.811, address: "Pangantucan, Bukidnon" },
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
    location: { lat: 8.311, lng: 124.882, address: "Manolo Fortich, Bukidnon" },
    category: "adventure"
  },
  {
    id: "two-trees",
    name: "Two Trees Mountain",
    description: "A popular hiking spot for locals, offering a great view of Malaybalay City.",
    images: ["https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800"],
    rating: 4.6,
    entranceFee: 0,
    location: { lat: 8.121, lng: 125.132, address: "Malaybalay City, Bukidnon" },
    category: "adventure"
  },
  {
    id: "bukidnon-zoo",
    name: "Bukidnon Provincial Zoo",
    description: "A conservation area for local endemic species and an educational place for families.",
    images: ["https://images.unsplash.com/photo-1544123555-09e86c1db0af?auto=format&fit=crop&q=80&w=800"],
    rating: 4.2,
    entranceFee: 50,
    location: { lat: 8.112, lng: 125.121, address: "Malaybalay City, Bukidnon" },
    category: "nature"
  },
  {
    id: "rocky-mountain",
    name: "Rocky Mountain Bukidnon",
    description: "Dramatic rock trails and high-altitude views that few people get to see.",
    images: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800"],
    rating: 4.5,
    entranceFee: 150,
    location: { lat: 8.011, lng: 124.911, address: "Lantapan, Bukidnon" },
    category: "adventure"
  },
  {
    id: "forest-camp",
    name: "Bukidnon Forest Camp",
    description: "A cozy camping ground with pine trees, perfect for stargazing and cold nights.",
    images: ["https://images.unsplash.com/photo-1445308306294-bfc3f79a2407?auto=format&fit=crop&q=80&w=800"],
    rating: 4.4,
    entranceFee: 100,
    location: { lat: 8.211, lng: 124.842, address: "Manolo Fortich, Bukidnon" },
    category: "nature"
  },
  {
    id: "museum-itinerary",
    name: "Bukidnon State Museum",
    description: "A cultural hub preserving the artifacts and heritage of the seven tribes.",
    images: ["https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800"],
    rating: 4.5,
    entranceFee: 20,
    location: { lat: 8.121, lng: 125.121, address: "Malaybalay City, Bukidnon" },
    category: "culture"
  },
  {
    id: "stone-park",
    name: "Stone Park Bukidnon",
    description: "Unique landscape featuring giant volcanic boulders nestled in the mountains.",
    images: ["https://images.unsplash.com/photo-1465146633011-14f8e0781093?auto=format&fit=crop&q=80&w=800"],
    rating: 4.3,
    entranceFee: 50,
    location: { lat: 7.911, lng: 125.042, address: "Malaybalay City, Bukidnon" },
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
    photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    bio: "Passionate about Bukidnon's agricultural tourism and local history."
  },
  {
    uid: "buddy2",
    name: "Mitch Jyacenth L. Alemanio",
    experience: "5 years",
    rating: 5.0,
    pricePerDay: 300,
    photoURL: "/img/BukidGO/1.jpg",
    bio: "Expert mountaineer and adventure specialist. I'll take you to the highest peaks!"
  },
  {
    uid: "buddy3",
    name: "Rejean D. Cabatingan",
    experience: "3 years",
    rating: 4.8,
    pricePerDay: 200,
    photoURL: "/img/BukidGO/1.jpg",
    bio: "Nature lover and waterfall chaser. Let's explore CEDAR together."
  },
  {
    uid: "buddy4",
    name: "Yyan April Kaye L. Daligdig",
    experience: "2 years",
    rating: 4.7,
    pricePerDay: 180,
    photoURL: "/img/BukidGO/5.jpg",
    bio: "Cultural preservationist and storyteller. Expert on Kaamulan traditions."
  },
  {
    uid: "buddy5",
    name: "Uriah Shianne E. Rellebo",
    experience: "3 years",
    rating: 4.9,
    pricePerDay: 220,
    photoURL: "/img/BukidGO/2.jpg",
    bio: "Certified tour guide specializing in religious and heritage sites."
  },
  {
    uid: "buddy6",
    name: "Jonaira M. Saripada",
    experience: "4 years",
    rating: 4.8,
    pricePerDay: 240,
    photoURL: "/img/BukidGO/3.jpg",
    bio: "Food enthusiast and budget travel expert. I know the best Binaki spots!"
  },
  {
    uid: "buddy7",
    name: "Daisy Rose Yam-oc",
    experience: "3 years",
    rating: 4.9,
    pricePerDay: 210,
    photoURL: "/img/BukidGO/6.jpg",
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
  }
];

export const EVENTS = [
  {
    id: "kaamulan-festival",
    name: "Kaamulan Festival",
    description: "The grandest festival in Bukidnon celebrating the culture and traditions of the seven tribes. Features street dancing, cultural shows, and traditional games.",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800",
    date: "February 20-28, 2026",
    location: "Malaybalay City, Bukidnon",
    category: "festival"
  },
  {
    id: "higaonon-cultural-night",
    name: "Higaonon Cultural Night",
    description: "An intimate evening showcasing the rich heritage of the Higaonon tribe through traditional dances, music, and storytelling.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800",
    date: "March 15, 2026",
    location: "Impasug-ong, Bukidnon",
    category: "cultural"
  },
  {
    id: "bukidnon-marathon",
    name: "Bukidnon Highland Marathon",
    description: "Run through the scenic highlands of Bukidnon in this challenging marathon featuring mountain trails and pine forests.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800",
    date: "April 12, 2026",
    location: "Dahilayan Adventure Park, Manolo Fortich",
    category: "sports"
  },
  {
    id: "pineapple-harvest-festival",
    name: "Pineapple Harvest Festival",
    description: "Celebrate the golden harvest season with farm tours, pineapple cooking contests, and agricultural exhibits.",
    image: "https://images.unsplash.com/photo-1550592704-6c76defa9985?auto=format&fit=crop&q=80&w=800",
    date: "May 8-10, 2026",
    location: "Del Monte Plantation, Manolo Fortich",
    category: "festival"
  },
  {
    id: "mountain-bike-challenge",
    name: "Bukidnon Mountain Bike Challenge",
    description: "Test your endurance in this extreme mountain biking competition through Bukidnon's rugged terrain and forest trails.",
    image: "https://images.unsplash.com/photo-1544191696-15693072e0b5?auto=format&fit=crop&q=80&w=800",
    date: "June 20, 2026",
    location: "Mt. Kitanglad Range, Lantapan",
    category: "sports"
  },
  {
    id: "coffee-festival",
    name: "Bukidnon Coffee Festival",
    description: "Discover the world-renowned coffee of Bukidnon with tastings, barista competitions, and farm-to-cup experiences.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    date: "July 18-19, 2026",
    location: "Monastery of Transfiguration, Malaybalay",
    category: "cultural"
  },
  {
    id: "community-cleanup",
    name: "Bukidnon Green Initiative",
    description: "Join the community in preserving Bukidnon's natural beauty through tree planting and environmental cleanup activities.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
    date: "August 5, 2026",
    location: "Various locations across Bukidnon",
    category: "community"
  },
  {
    id: "tribal-arts-workshop",
    name: "Traditional Arts & Crafts Workshop",
    description: "Learn traditional weaving, pottery, and woodcarving techniques from master craftsmen of the indigenous tribes.",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=800",
    date: "September 12-14, 2026",
    location: "Bukidnon State Museum, Malaybalay",
    category: "cultural"
  },
  {
    id: "adventure-race",
    name: "Bukidnon Ultimate Adventure Race",
    description: "Multi-sport adventure race combining hiking, rappelling, river crossing, and orienteering across Bukidnon's wilderness.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800",
    date: "October 25, 2026",
    location: "CEDAR Waterfalls, Impasug-ong",
    category: "sports"
  },
  {
    id: "harvest-thanksgiving",
    name: "Harvest Thanksgiving Festival",
    description: "A community celebration of gratitude featuring local produce displays, traditional cooking, and thanksgiving ceremonies.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    date: "November 28, 2026",
    location: "Kaamulan Nature Park, Malaybalay",
    category: "community"
  }
];
