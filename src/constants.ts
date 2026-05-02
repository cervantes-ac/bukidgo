export const LOCAL_BUDDIES = [
  {
    uid: "buddy1",
    name: "Christine Lynette B. Aguila",
    experience: "4 years",
    rating: 4.9,
    pricePerDay: 250,
    photoURL: "/img/BukidGO/default-person.svg",
    bio: "Passionate about Bukidnon's agricultural tourism and local history.",
    specialties: ["Agriculture", "History", "Farm Tours"]
  },
  {
    uid: "buddy2",
    name: "Mitch Jyacenth L. Alemanio",
    experience: "5 years",
    rating: 5.0,
    pricePerDay: 300,
    photoURL: "/img/BukidGO/4.jpg",
    bio: "Expert mountaineer and adventure specialist. I'll take you to the highest peaks!",
    specialties: ["Mountaineering", "Adventure", "Trekking"]
  },
  {
    uid: "buddy3",
    name: "Rejean D. Cabatingan",
    experience: "3 years",
    rating: 4.8,
    pricePerDay: 200,
    photoURL: "/img/BukidGO/1.jpg",
    bio: "Nature lover and waterfall chaser. Let's explore CEDAR together.",
    specialties: ["Nature", "Waterfalls", "Eco-Tourism"]
  },
  {
    uid: "buddy4",
    name: "Yyan April Kaye L. Daligdig",
    experience: "2 years",
    rating: 4.7,
    pricePerDay: 180,
    photoURL: "/img/BukidGO/5.jpg",
    bio: "Cultural preservationist and storyteller. Expert on Kaamulan traditions.",
    specialties: ["Culture", "Indigenous Traditions", "Storytelling"]
  },
  {
    uid: "buddy5",
    name: "Uriah Shianne E. Rellebo",
    experience: "3 years",
    rating: 4.9,
    pricePerDay: 220,
    photoURL: "/img/BukidGO/2.jpg",
    bio: "Certified tour guide specializing in religious and heritage sites.",
    specialties: ["Heritage", "Religious Sites", "Architecture"]
  },
  {
    uid: "buddy6",
    name: "Jonaira M. Saripada",
    experience: "4 years",
    rating: 4.8,
    pricePerDay: 240,
    photoURL: "/img/BukidGO/3.jpg",
    bio: "Food enthusiast and budget travel expert. I know the best Binaki spots!",
    specialties: ["Food", "Budget Travel", "Local Cuisine"]
  },
  {
    uid: "buddy7",
    name: "Daisy Rose Yam-oc",
    experience: "3 years",
    rating: 4.9,
    pricePerDay: 210,
    photoURL: "/img/BukidGO/6.jpg",
    bio: "Adventure-ready guide with a focus on family-friendly destinations.",
    specialties: ["Family Travel", "Adventure", "Accessible Tourism"]
  }
];


export const MOCK_REVIEWS = [
  // Destination reviews
  {
    id: "review1",
    userId: "user1",
    userName: "Maria Santos",
    userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    targetId: "dest1",
    targetType: "destination" as const,
    rating: 5,
    title: "Absolutely breathtaking views!",
    comment: "The sunrise from the peak was unforgettable. The trail is well-maintained and the local guides are incredibly knowledgeable.",
    createdAt: "2024-04-10",
    helpful: 24
  },
  {
    id: "review2",
    userId: "user2",
    userName: "Juan Dela Cruz",
    userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    targetId: "dest1",
    targetType: "destination" as const,
    rating: 4,
    title: "Great experience, a bit crowded",
    comment: "Beautiful destination but it gets quite crowded on weekends. Best to visit on weekdays for a more peaceful experience.",
    createdAt: "2024-04-08",
    helpful: 18
  },
  {
    id: "review3",
    userId: "user3",
    userName: "Ana Reyes",
    userPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
    targetId: "dest2",
    targetType: "destination" as const,
    rating: 5,
    title: "Perfect for adventure seekers",
    comment: "Incredible rock formations and the adventure activities are top-notch. The staff is very professional and safety-conscious.",
    createdAt: "2024-04-09",
    helpful: 31
  },
  {
    id: "review4",
    userId: "user4",
    userName: "Carlos Mendoza",
    userPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    targetId: "dest2",
    targetType: "destination" as const,
    rating: 4,
    title: "Worth the visit",
    comment: "Amazing views and fun activities. The entrance fee is reasonable for what you get. Bring plenty of water!",
    createdAt: "2024-04-07",
    helpful: 15
  },
  {
    id: "review5",
    userId: "user5",
    userName: "Rosa Garcia",
    userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    targetId: "dest3",
    targetType: "destination" as const,
    rating: 5,
    title: "Hidden gem in Bukidnon",
    comment: "This place is absolutely magical. The waterfall is pristine and the surrounding nature is untouched. Highly recommended!",
    createdAt: "2024-04-06",
    helpful: 42
  },
  // Food spot reviews
  {
    id: "review6",
    userId: "user6",
    userName: "Miguel Torres",
    userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    targetId: "food1",
    targetType: "foodSpot" as const,
    rating: 5,
    title: "Best Binaki in town!",
    comment: "Authentic taste and generous portions. The owner is so friendly and the ambiance is cozy. Will definitely come back!",
    createdAt: "2024-04-09",
    helpful: 28
  },
  {
    id: "review7",
    userId: "user7",
    userName: "Lisa Fernandez",
    userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    targetId: "food1",
    targetType: "foodSpot" as const,
    rating: 4,
    title: "Great food, a bit pricey",
    comment: "The food quality is excellent but prices are slightly higher than other places. Still worth it for the taste and service.",
    createdAt: "2024-04-08",
    helpful: 12
  },
  {
    id: "review8",
    userId: "user8",
    userName: "Pedro Reyes",
    userPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    targetId: "food2",
    targetType: "foodSpot" as const,
    rating: 5,
    title: "Farm-to-table perfection",
    comment: "Fresh ingredients, amazing flavors, and the view is spectacular. This is what authentic Bukidnon cuisine should taste like!",
    createdAt: "2024-04-10",
    helpful: 35
  },
  {
    id: "review9",
    userId: "user9",
    userName: "Sofia Mercado",
    userPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
    targetId: "food2",
    targetType: "foodSpot" as const,
    rating: 5,
    title: "Unforgettable dining experience",
    comment: "The chef really knows what they're doing. Every dish is a masterpiece. Highly recommend the specialty coffee!",
    createdAt: "2024-04-09",
    helpful: 22
  },
  {
    id: "review10",
    userId: "user10",
    userName: "Antonio Lim",
    userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    targetId: "food3",
    targetType: "foodSpot" as const,
    rating: 4,
    title: "Good local flavors",
    comment: "Authentic local dishes with reasonable prices. The service could be a bit faster but overall a great experience.",
    createdAt: "2024-04-07",
    helpful: 10
  }
];

export const MOCK_CAREERS = [
  {
    id: "career1",
    title: "Tour Guide - Highland Specialist",
    department: "Tourism & Experiences",
    location: "Malaybalay, Bukidnon",
    type: "full-time" as const,
    description: "Join our team as a Highland Specialist Tour Guide. Lead unforgettable journeys through Bukidnon's most breathtaking destinations. You'll work with diverse groups, share local knowledge, and create memorable experiences.",
    requirements: [
      "2+ years of tour guiding experience",
      "Fluent in English and Filipino",
      "Knowledge of Bukidnon's geography and culture",
      "Valid tour guide license",
      "Excellent communication skills",
      "Physical fitness for mountain terrain"
    ],
    salary: "₱18,000 - ₱25,000/month",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1000",
    postedDate: "2024-04-15"
  },
  {
    id: "career2",
    title: "Food & Beverage Manager",
    department: "Culinary Operations",
    location: "Valencia, Bukidnon",
    type: "full-time" as const,
    description: "Manage our restaurant operations and oversee the preparation of authentic Bukidnon cuisine. Ensure quality standards, manage inventory, and lead a passionate culinary team.",
    requirements: [
      "3+ years in F&B management",
      "Knowledge of local cuisine",
      "Food safety certification",
      "Team leadership experience",
      "Inventory management skills",
      "Customer service excellence"
    ],
    salary: "₱22,000 - ₱32,000/month",
    image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=1000",
    postedDate: "2024-04-10"
  },
  {
    id: "career3",
    title: "Cultural Heritage Coordinator",
    department: "Community & Culture",
    location: "Bukidnon (Remote-Friendly)",
    type: "full-time" as const,
    description: "Preserve and promote Bukidnon's rich tribal heritage. Coordinate cultural events, manage community partnerships, and develop educational programs about indigenous traditions.",
    requirements: [
      "Background in cultural studies or anthropology",
      "Experience with community engagement",
      "Knowledge of Lumad and Higaonon cultures",
      "Event planning skills",
      "Excellent written and verbal communication",
      "Passion for cultural preservation"
    ],
    salary: "₱16,000 - ₱22,000/month",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000",
    postedDate: "2024-04-08"
  },
  {
    id: "career4",
    title: "Adventure Activity Coordinator",
    department: "Experience Design",
    location: "Malaybalay, Bukidnon",
    type: "full-time" as const,
    description: "Design and coordinate thrilling adventure activities including trekking, rock climbing, and water sports. Ensure safety protocols and create unforgettable experiences for our guests.",
    requirements: [
      "2+ years in adventure tourism",
      "Certifications in outdoor activities (climbing, water sports, etc.)",
      "First aid and CPR certification",
      "Strong safety management knowledge",
      "Physical fitness and outdoor skills",
      "Problem-solving abilities"
    ],
    salary: "₱19,000 - ₱27,000/month",
    image: "https://images.unsplash.com/photo-1551632786-de41ec16a83a?auto=format&fit=crop&q=80&w=1000",
    postedDate: "2024-04-12"
  },
  {
    id: "career5",
    title: "Digital Marketing Specialist",
    department: "Marketing & Communications",
    location: "Bukidnon (Remote-Friendly)",
    type: "full-time" as const,
    description: "Promote Bukidnon's tourism through digital channels. Manage social media, create engaging content, and develop marketing campaigns to attract visitors from around the world.",
    requirements: [
      "2+ years in digital marketing",
      "Social media management expertise",
      "Content creation skills",
      "SEO/SEM knowledge",
      "Analytics and data interpretation",
      "Passion for tourism and travel"
    ],
    salary: "₱17,000 - ₱24,000/month",
    image: "https://images.unsplash.com/photo-1460925895917-adf4e565db18?auto=format&fit=crop&q=80&w=1000",
    postedDate: "2024-04-14"
  },
  {
    id: "career6",
    title: "Seasonal Farm Tour Guide",
    department: "Agricultural Tourism",
    location: "Bukidnon (Various Locations)",
    type: "seasonal" as const,
    description: "Lead educational farm tours during harvest seasons. Share knowledge about Bukidnon's agricultural practices, coffee production, and sustainable farming methods.",
    requirements: [
      "Knowledge of local agriculture",
      "Excellent communication skills",
      "Physical ability to work outdoors",
      "Customer service experience",
      "Flexibility with seasonal schedules",
      "Passion for farming and sustainability"
    ],
    salary: "₱12,000 - ₱16,000/month",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=1000",
    postedDate: "2024-04-11"
  }
];
