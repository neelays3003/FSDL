// In-memory NoSQL-style data store (simulates a MongoDB/JSON document store)

const destinations = [
  {
    _id: "d001",
    name: "Santorini",
    country: "Greece",
    continent: "Europe",
    tagline: "Whitewashed dreams above a sapphire sea",
    description: "Perched on volcanic cliffs, Santorini enchants with iconic blue-domed churches, crimson sunsets over the caldera, and beaches of black and red volcanic sand. A timeless island that feels like a painting come alive.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80",
      "https://images.unsplash.com/photo-1601581975053-7c199e2c6e4d?w=600&q=80"
    ],
    rating: 4.9,
    reviewCount: 2341,
    highlights: ["Oia Sunset", "Caldera Views", "Wine Tasting", "Boat Tours"],
    bestTime: "April – October",
    climate: "Mediterranean",
    priceFrom: 2499
  },
  {
    _id: "d002",
    name: "Kyoto",
    country: "Japan",
    continent: "Asia",
    tagline: "Where ancient temples breathe through bamboo groves",
    description: "Kyoto moves at the pace of a tea ceremony — deliberate, refined, deeply beautiful. Thousands of shrines, geisha districts, stone-lanterned paths, and cherry blossoms that fall like pink snow. Japan's soul lives here.",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80"
    ],
    rating: 4.8,
    reviewCount: 3102,
    highlights: ["Fushimi Inari", "Arashiyama", "Tea Ceremony", "Geisha District"],
    bestTime: "March – May, Oct – Nov",
    climate: "Temperate",
    priceFrom: 3199
  },
  {
    _id: "d003",
    name: "Amalfi Coast",
    country: "Italy",
    continent: "Europe",
    tagline: "Cliffside villages tumbling into turquoise waters",
    description: "The Amalfi Coast is drama distilled — pastel villages clinging to vertiginous cliffs, lemon groves perfuming sea breezes, and roads that curl through mountains like brushstrokes. La dolce vita at its most spectacular.",
    image: "https://images.unsplash.com/photo-1633321702518-7fecddd3a5e2?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80",
      "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?w=600&q=80"
    ],
    rating: 4.9,
    reviewCount: 1876,
    highlights: ["Positano", "Ravello Gardens", "Boat to Capri", "Limoncello Trail"],
    bestTime: "May – September",
    climate: "Mediterranean",
    priceFrom: 2799
  },
  {
    _id: "d004",
    name: "Marrakech",
    country: "Morocco",
    continent: "Africa",
    tagline: "A sensory labyrinth of spice, color and mystery",
    description: "Step through a carved arch into Marrakech and time dissolves. Souks overflow with saffron and silk, riads hide cooling fountains within their walls, and the call to prayer drifts across rooftop terraces at golden hour.",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8a22e40?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&q=80",
      "https://images.unsplash.com/photo-1587974004695-0f4af0c3f3f3?w=600&q=80"
    ],
    rating: 4.7,
    reviewCount: 1543,
    highlights: ["Medina Souks", "Jardin Majorelle", "Atlas Day Trip", "Hammam Experience"],
    bestTime: "March – May, Oct – Nov",
    climate: "Semi-arid",
    priceFrom: 1899
  },
  {
    _id: "d005",
    name: "Patagonia",
    country: "Argentina & Chile",
    continent: "South America",
    tagline: "The end of the earth — and the beginning of wonder",
    description: "Patagonia is raw, ferocious beauty — glacier-carved peaks, ice-blue lakes, condors riding thermals above steppes where guanacos roam. Torres del Paine rises like a cathedral from the plain. This is wilderness at its most absolute.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
      "https://images.unsplash.com/photo-1548706866-818e6e9d3b35?w=600&q=80"
    ],
    rating: 4.9,
    reviewCount: 987,
    highlights: ["Torres del Paine", "Perito Moreno Glacier", "W-Trek", "Wildlife Safari"],
    bestTime: "November – March",
    climate: "Subarctic",
    priceFrom: 3899
  },
  {
    _id: "d006",
    name: "Bali",
    country: "Indonesia",
    continent: "Asia",
    tagline: "Gods, rice terraces, and the rhythm of the ocean",
    description: "Bali is a meditation in beauty — emerald terraces stepped up volcanic slopes, incense curling through temple gates, surf rolling endlessly onto black-sand shores. The Island of the Gods offers spiritual nourishment alongside earthly pleasure.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80"
    ],
    rating: 4.8,
    reviewCount: 4211,
    highlights: ["Ubud Rice Terraces", "Tanah Lot", "Seminyak Beach", "Mount Batur Trek"],
    bestTime: "April – October",
    climate: "Tropical",
    priceFrom: 1699
  }
];

const packages = [
  {
    _id: "p001",
    name: "Greek Island Odyssey",
    destinationId: "d001",
    destination: "Santorini, Greece",
    duration: "8 days / 7 nights",
    groupSize: "Max 12",
    price: 3299,
    originalPrice: 3999,
    inclusions: ["Luxury cave hotel", "Daily breakfast", "Catamaran sunset cruise", "Wine tasting tour", "Airport transfers", "Expert guide"],
    type: "Luxury",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    badge: "Most Popular",
    badgeColor: "#e85d26"
  },
  {
    _id: "p002",
    name: "Japan Cultural Immersion",
    destinationId: "d002",
    destination: "Kyoto & Tokyo, Japan",
    duration: "12 days / 11 nights",
    groupSize: "Max 8",
    price: 4899,
    originalPrice: 5499,
    inclusions: ["Ryokan stays", "All meals", "Bullet train pass", "Tea ceremony", "Geisha dinner", "Temple tours"],
    type: "Cultural",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80",
    badge: "Editor's Choice",
    badgeColor: "#2d6a4f"
  },
  {
    _id: "p003",
    name: "Patagonia Expedition",
    destinationId: "d005",
    destination: "Patagonia, Argentina & Chile",
    duration: "14 days / 13 nights",
    groupSize: "Max 10",
    price: 5499,
    originalPrice: 6299,
    inclusions: ["Boutique lodges", "All meals", "Guided treks", "Glacier walk", "Park fees", "Equipment rental"],
    type: "Adventure",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    badge: "Adventure Pick",
    badgeColor: "#1e3a5f"
  },
  {
    _id: "p004",
    name: "Bali Spirit Retreat",
    destinationId: "d006",
    destination: "Ubud & Seminyak, Bali",
    duration: "10 days / 9 nights",
    groupSize: "Max 16",
    price: 2399,
    originalPrice: 2899,
    inclusions: ["Villa accommodation", "Daily breakfast & dinner", "Yoga sessions", "Temple ceremonies", "Cooking class", "Spa treatment"],
    type: "Wellness",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    badge: "Best Value",
    badgeColor: "#7b2d8b"
  }
];

const testimonials = [
  {
    _id: "t001",
    name: "Priya Sharma",
    location: "Mumbai, India",
    destination: "Santorini, Greece",
    rating: 5,
    text: "Wanderlust turned a dream into the most flawless two weeks of my life. Every detail was considered — from the cave suite overlooking the caldera to the private wine tasting at sunset. I felt like the world had been arranged just for me.",
    avatar: "PS",
    avatarBg: "#e85d26"
  },
  {
    _id: "t002",
    name: "James Whitfield",
    location: "London, UK",
    destination: "Japan Cultural Immersion",
    rating: 5,
    text: "I've traveled with many agencies but Wanderlust is categorically different. Our guide in Kyoto knew which temple courtyard would be empty at dawn. The ryokan dinner cooked by an 80-year-old master. These are memories no algorithm produces.",
    avatar: "JW",
    avatarBg: "#2d6a4f"
  },
  {
    _id: "t003",
    name: "Elena Marchetti",
    location: "Milan, Italy",
    destination: "Patagonia Expedition",
    rating: 5,
    text: "Standing in front of the Perito Moreno Glacier as a private guide explained the geology — that moment crystallized why travel matters. Wanderlust doesn't book holidays. They orchestrate transformations.",
    avatar: "EM",
    avatarBg: "#1e3a5f"
  },
  {
    _id: "t004",
    name: "Arjun Nair",
    location: "Bangalore, India",
    destination: "Bali Spirit Retreat",
    rating: 5,
    text: "The Bali retreat was precisely what I needed — every morning began with yoga as mist rose from the rice terraces. The balance of activity and stillness, culture and beach, was perfectly calibrated. I came back different.",
    avatar: "AN",
    avatarBg: "#7b2d8b"
  }
];

const bookings = []; // In-memory bookings store (simulates MongoDB collection)

const stats = {
  destinations: 87,
  travelers: 24000,
  years: 18,
  awards: 31
};

module.exports = { destinations, packages, testimonials, bookings, stats };
