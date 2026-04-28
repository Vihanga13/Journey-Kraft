import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Utensils, MapPin, Users, User, UserPlus,
  Shuffle, Navigation, Zap, Clock, Sparkles,
  Check, Compass, Calendar, Heart,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ActivityRow {
  location: string; baseLocation: string; activity: string; category: string;
  food: string; time: string; group: boolean; family: boolean; solo: boolean;
  ageMin: number; ageMax: number; effort: string;
}
interface Activity {
  time: string; title: string; description: string; image: string;
  location: string; category: string; food: string; effort: string;
}
interface DayPlan {
  day: number; title: string; image: string; location: string;
  center: string; activities: Activity[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const RAW: ActivityRow[] = [
  { location:"Anuradhapura", baseLocation:"Anuradhapura", activity:"Anuradhapura site by Cycling", category:"Heritage & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:100, effort:"High" },
  { location:"Anuradhapura", baseLocation:"Anuradhapura", activity:"Anuradhapura site by Scooter", category:"Heritage & Soft Adventure", food:"Snack", time:"Any Time", group:false, family:false, solo:true, ageMin:25, ageMax:100, effort:"Median" },
  { location:"Anuradhapura", baseLocation:"Anuradhapura", activity:"Anuradhapura site by Tuk Tuk", category:"Heritage & Soft Adventure", food:"Snack", time:"Any Time", group:true, family:true, solo:true, ageMin:12, ageMax:100, effort:"Low" },
  { location:"Anuradhapura", baseLocation:"Anuradhapura", activity:"Village Lunch in a Mud Hut with Catamaran Ride", category:"Cultural Conservation", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:100, effort:"Median" },
  { location:"Bundala", baseLocation:"Bundala", activity:"Bird Watching Village Cycling Tour", category:"Wildlife & Soft Adventure", food:"Snack", time:"Morning", group:false, family:true, solo:true, ageMin:18, ageMax:100, effort:"Median" },
  { location:"Bundala", baseLocation:"Bundala", activity:"Green Trails Sri Lanka: Sowing Sustainability", category:"Educational & Environmental Experiences", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:100, effort:"Low" },
  { location:"Colombo", baseLocation:"Colombo", activity:"Colombo Night Cycling Adventure", category:"Urban Exploration & Soft Adventure", food:"Snack", time:"Night", group:false, family:false, solo:true, ageMin:25, ageMax:55, effort:"High" },
  { location:"Colombo", baseLocation:"Colombo", activity:"Colombo Tuk Tuk Tour with Street Food & Beverages", category:"Urban Exploration", food:"Snack", time:"Evening", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"Median" },
  { location:"Colombo", baseLocation:"Colombo", activity:"Hosted: Colombo Walking Experience with Taste Buds", category:"Outdoor & Educational", food:"Snack", time:"Any Time", group:false, family:true, solo:true, ageMin:12, ageMax:55, effort:"Median" },
  { location:"Colombo", baseLocation:"Colombo", activity:"Urban Kayaking Adventure - Diyawannaoya", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"Median" },
  { location:"Ella", baseLocation:"Ella", activity:"Wheels & Wonders: Cycling Ella\u2019s Highlands", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:18, ageMax:65, effort:"High" },
  { location:"Ella/Koslanda", baseLocation:"Ella", activity:"Upper Diyaluma Waterfall Trek with Lunch", category:"Outdoor & Soft Adventure", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"High" },
  { location:"Ella/Liyangahawela", baseLocation:"Ella", activity:"A Journey Through Liyangawela- Ella Rock Viewpoint", category:"Outdoor & Soft Adventure", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"High" },
  { location:"Galle", baseLocation:"Galle", activity:"Pedal Through History - Galle Fort Cycling Tour by E-Bike", category:"Outdoor & Soft Adventure", food:"No", time:"Morning", group:true, family:true, solo:true, ageMin:18, ageMax:100, effort:"Median" },
  { location:"Galle", baseLocation:"Galle", activity:"Pedal Through History - Galle Fort Cycling Tour by MTB", category:"Outdoor & Soft Adventure", food:"No", time:"Morning", group:true, family:true, solo:true, ageMin:18, ageMax:100, effort:"Median" },
  { location:"Galle", baseLocation:"Galle", activity:"Stroll Through Time: The Galle Fort Walking Tour", category:"Urban Exploration & Soft Adventure", food:"Snack", time:"Any Time", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Galle/Poddala", baseLocation:"Galle", activity:"Toddy & Aroma: A Taste of Galle", category:"Cultural & Culinary", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Galle/Wackwella", baseLocation:"Galle", activity:"From Field to Feast: Sri Lankan Cooking Experience", category:"Culinary & Soft Adventure", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Galle/Wackwella", baseLocation:"Galle", activity:"Taste of the Island: Roti & Curry Tales", category:"Culinary Experience", food:"Main Meal", time:"Evening", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Habarana", baseLocation:"Habarana", activity:"People & Padel Cycling Tour Habarana E-Bike", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:false, family:true, solo:true, ageMin:12, ageMax:65, effort:"Median" },
  { location:"Habarana", baseLocation:"Habarana", activity:"Rhythms of the Paddy Field with Arrack Cocktail", category:"Cultural & Culinary", food:"Snack", time:"Evening", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Habarana", baseLocation:"Habarana", activity:"Rhythms of the Paddy Field with Herbal Drink", category:"Cultural & Culinary", food:"Snack", time:"Any Time", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Habarana", baseLocation:"Habarana", activity:"Rhythms of the Paddy Field with High Tea", category:"Cultural & Culinary", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Habarana", baseLocation:"Habarana", activity:"Rhythms of the Paddy Field with Sri Lankan Lunch", category:"Cultural & Culinary", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Habarana", baseLocation:"Habarana", activity:"Village Experience with Cookery Demo & Lunch with Folk Music", category:"Cultural & Soft Adventure", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Habarana", baseLocation:"Habarana", activity:"Village Experience with Cookery Demo & Sri Lankan Lunch", category:"Cultural & Soft Adventure", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Habarana", baseLocation:"Habarana", activity:"Angampora Show in Habarana", category:"Cultural & Heritage Conservation", food:"Snack", time:"Any Time", group:true, family:true, solo:false, ageMin:12, ageMax:100, effort:"Low" },
  { location:"Habarana", baseLocation:"Habarana", activity:"People & Padel Cycling Tour Habarana MTB", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"High" },
  { location:"Habarana/Hiriwadunna", baseLocation:"Habarana", activity:"Sunset Boat Ride with Folk Music", category:"Outdoor & Soft Adventure", food:"Snack", time:"Evening", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"Low" },
  { location:"Hikkaduwa/Rathgama", baseLocation:"Hikkaduwa", activity:"Kayaking in Rathgama Lake with Refreshments", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"High" },
  { location:"Jaffna", baseLocation:"Jaffna", activity:"Culinary Heritage in Jaffna", category:"Culinary Experience", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Jaffna", baseLocation:"Jaffna", activity:"Delft Island Tour by Private Boat", category:"Outdoor & Soft Adventure", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Jaffna", baseLocation:"Jaffna", activity:"Delt Island Tour with Lunch by Public Boat", category:"Outdoor & Soft Adventure", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Jaffna", baseLocation:"Jaffna", activity:"Foot to Food Walking Tour", category:"Culinary & Outdoor", food:"Main Meal", time:"Evening", group:true, family:true, solo:true, ageMin:12, ageMax:100, effort:"High" },
  { location:"Jaffna", baseLocation:"Jaffna", activity:"Palmyrah Adventures", category:"Culinary & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Jaffna", baseLocation:"Jaffna", activity:"Pottery Making and Lunch", category:"Cultural & Culinary", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Jaffna", baseLocation:"Jaffna", activity:"Vibrant Rhythms of Jaffna", category:"Cultural & Heritage Conservation", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Jaffna/Kalaviyankadu", baseLocation:"Jaffna", activity:"Pottery Making Experience", category:"Cultural Experience", food:"No", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Jaffna/KKS Beach", baseLocation:"Jaffna", activity:"Sunset Beach with Local Arrack/Cocktails", category:"Culinary & Soft Adventure", food:"Snack", time:"Evening", group:true, family:true, solo:true, ageMin:12, ageMax:100, effort:"Low" },
  { location:"Jaffna/Kokuvil", baseLocation:"Jaffna", activity:"Dancing School Visit", category:"Cultural Experience", food:"No", time:"Evening", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Jaffna/Kondavil", baseLocation:"Jaffna", activity:"Drum Making Experience", category:"Cultural Experience", food:"No", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Jaffna/Thellipalai", baseLocation:"Jaffna", activity:"Local Home-base Cookery Demo with Lunch", category:"Culinary Experience", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Jaffna/Thellipalai", baseLocation:"Jaffna", activity:"Twilight Farm Walk in Jaffna", category:"Outdoor & Soft Adventure", food:"Snack", time:"Evening", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"High" },
  { location:"Kalawewa", baseLocation:"Kalawewa", activity:"Kayaking and Elephant Watching in Kalawewa", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Kandy", baseLocation:"Kandy", activity:"City Tour by Tuk Tuk", category:"Urban Exploration & Soft Adventure", food:"Snack", time:"Any Time", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Kandy", baseLocation:"Kandy", activity:"Cultural Journey in Kandy led by Lady", category:"Agricultural & Community Conservation", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Kandy", baseLocation:"Kandy", activity:"Kandy Culinary Footprints - Foot for Food", category:"Culinary & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Kandy/3 Temple Loop", baseLocation:"Kandy", activity:"Kandyan Legacy", category:"Cultural & Heritage Conservation", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Kandy/Geli-Oya", baseLocation:"Kandy", activity:"Community Base Batik making process", category:"Community Conservation", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Kandy/Geli-Oya", baseLocation:"Kandy", activity:"Home-Base Cooking Demo with Dinner hosted by Mrs. Ranwala", category:"Culinary Experience", food:"Main Meal", time:"Evening", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Kandy/Geli-Oya", baseLocation:"Kandy", activity:"Home-Base Cooking Demo with Lunch hosted by Mrs. Ranwala", category:"Culinary Experience", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Kandy/Hanthana", baseLocation:"Kandy", activity:"Hanthana E-Cycling Adventure", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"High" },
  { location:"Kandy/Heel Oya", baseLocation:"Kandy", activity:"Heel Oya Community visit", category:"Agricultural & Community Conservation", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Kandy/Heel Oya", baseLocation:"Kandy", activity:"Heel Oya Farmer for the Day", category:"Agricultural & Community Conservation", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Kandy/Heel Oya", baseLocation:"Kandy", activity:"Heel Oya Trek with Lunch", category:"Outdoor & Soft Adventure", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"High" },
  { location:"Kandy/Lankathilaka", baseLocation:"Kandy", activity:"Traditional Dancing School Visit", category:"Cultural & Heritage Conservation", food:"Snack", time:"Any Time", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Kandy/Peradeniya", baseLocation:"Kandy", activity:"Eco Vista Ride: Unveiling Kandy's Charms (E-Bike)", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:18, ageMax:65, effort:"High" },
  { location:"Kandy/Weligalla", baseLocation:"Kandy", activity:"Heritage Flavors Upcountry Culinary \u2013 Elpitiya Walawwa", category:"Culinary & Heritage", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Kandy/Weligalla", baseLocation:"Kandy", activity:"Leaf to Cup: Tailored Tea Experience", category:"Culinary & Cultural", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Koggala", baseLocation:"Koggala", activity:"Boat Safari in Koggala Lake", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Koggala", baseLocation:"Koggala", activity:"Kayaking in Koggala Lake", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"Median" },
  { location:"Matale/Ukuwela", baseLocation:"Matale", activity:"Unveiling the Art and History of Laaksha with Lunch", category:"Cultural & Heritage Conservation", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Mirissa", baseLocation:"Mirissa", activity:"Cinnamon Museum & Demonstration", category:"Culinary Experience", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Mirissa", baseLocation:"Mirissa", activity:"Snorkeling 2 Hours Session", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"High" },
  { location:"Mirissa", baseLocation:"Mirissa", activity:"Whale Watching in shared boat", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Negombo", baseLocation:"Negombo", activity:"Dutch Canal Boat Tour", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Nuwara Eliya", baseLocation:"Nuwara Eliya", activity:"Wheels & Wonders: Cycling Nuwara Eliya", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:18, ageMax:65, effort:"High" },
  { location:"Nuwara Eliya/Kandapola", baseLocation:"Nuwara Eliya", activity:"Kandapola Tamil Cultural Village Experience", category:"Cultural & Culinary", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Pasikudah", baseLocation:"Pasikudah", activity:"Muhudu Veddas Coastal Experience: A Cultural Fishing Tour", category:"Cultural & Outdoor", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Pasikudah", baseLocation:"Pasikudah", activity:"Wheels of Traditions: Explore Pasikudah Village by Cycling", category:"Urban Exploration & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"Median" },
  { location:"Pasikudah/Batticalo", baseLocation:"Pasikudah", activity:"Batticalo Pottery Experience", category:"Cultural & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Pasikudah/Batticalo", baseLocation:"Pasikudah", activity:"Cultural Weave: Batticalo Community Experience", category:"Cultural & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Pasikudah/Batticalo", baseLocation:"Pasikudah", activity:"Enchanting Batticalo: City Tour with Thanu", category:"Cultural & Soft Adventure", food:"Snack", time:"Any Time", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Pasikudah/Batticalo", baseLocation:"Pasikudah", activity:"Lagoon Escape: Explore Batticalo by Boat", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Pasikudah/Maduruoya", baseLocation:"Pasikudah", activity:"Adventure Awaits: Wildlife Spotting in Maduru Oya NP", category:"Outdoor & Wildlife Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"High" },
  { location:"Pasikudah/Mahaoya", baseLocation:"Pasikudah", activity:"Seethala Wanniya: A Journey to the Forgotten Kingdom", category:"Cultural & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Polonnaruwa", baseLocation:"Polonnaruwa", activity:"Cycling Polonnaruwa - Site", category:"Cultural & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Sigiriya", baseLocation:"Sigiriya", activity:"Sigiriya Village Tour & Cooking Demo with Lunch", category:"Cultural & Soft Adventure", food:"Main Meal", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Sigiriya", baseLocation:"Sigiriya", activity:"Sunrise Breakfast at Mapagala", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Tissa", baseLocation:"Tissa", activity:"Curd Making Experience", category:"Cultural & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Tissa", baseLocation:"Tissa", activity:"Curd Trail (Curd & Pottery)", category:"Cultural & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Tissa", baseLocation:"Tissa", activity:"Curd Trail followed with local Breakfast", category:"Cultural & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Tissa", baseLocation:"Tissa", activity:"Folk Potter Experience", category:"Cultural & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Tissa", baseLocation:"Tissa", activity:"Traditional Rod Fishing Experience by Catamaran Ride", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Tissa", baseLocation:"Tissa", activity:"Traditional Rod Fishing by Catamaran with local Breakfast", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Trincomalee", baseLocation:"Trincomalee", activity:"Dine with a Local Family in Trincomalee", category:"Culinary & Cultural", food:"Main Meal", time:"Evening", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Trincomalee", baseLocation:"Trincomalee", activity:"Pigeon Island Snorkeling 2 Hours", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"High" },
  { location:"Trincomalee", baseLocation:"Trincomalee", activity:"Trincomalee with Chinthaka: Explore the Historic & Coastal Beauty", category:"Outdoor & Soft Adventure", food:"Snack", time:"Any Time", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Median" },
  { location:"Trincomalee", baseLocation:"Trincomalee", activity:"Whale Watching in shared boat", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Trincomalee/Uppuveli", baseLocation:"Trincomalee", activity:"Sunset Mangrove Fishing in Uppuveli", category:"Outdoor & Soft Adventure", food:"Snack", time:"Evening", group:true, family:true, solo:true, ageMin:0, ageMax:100, effort:"Low" },
  { location:"Unawatuna", baseLocation:"Unawatuna", activity:"Unawatuna Village Cycling Tour by E-Bike", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:18, ageMax:65, effort:"High" },
  { location:"Unawatuna", baseLocation:"Unawatuna", activity:"Unawatuna Village Cycling Tour by MTB", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:18, ageMax:65, effort:"High" },
  { location:"Weligama", baseLocation:"Weligama", activity:"1 Hour Surfing Session", category:"Outdoor & Soft Adventure", food:"Snack", time:"Morning", group:true, family:true, solo:true, ageMin:12, ageMax:65, effort:"Median" },
];

const COORDS: Record<string,[number,number]> = {
  Colombo:[6.9271,79.8612], Negombo:[7.2008,79.838], Kandy:[7.2906,80.6337],
  Matale:[7.4675,80.6234], "Nuwara Eliya":[6.9497,80.7891], Ella:[6.8667,81.0467],
  Galle:[6.0535,80.221], Hikkaduwa:[6.1395,80.1005], Koggala:[5.9893,80.3267],
  Mirissa:[5.9483,80.4589], Unawatuna:[6.0152,80.2491], Weligama:[5.9748,80.43],
  Tissa:[6.2882,81.2882], Bundala:[6.2,81.25], Habarana:[8.0539,80.7514],
  Sigiriya:[7.9568,80.76], Polonnaruwa:[7.9403,81.0188], Anuradhapura:[8.3114,80.4037],
  Kalawewa:[8.15,80.55], Pasikudah:[7.9333,81.5667], Trincomalee:[8.5874,81.2152],
  Jaffna:[9.6615,80.0255], Ampara:[7.2975,81.672], Badulla:[6.9904,81.055],
  Bentota:[6.4254,79.9977], Dambulla:[7.8731,80.6518], Hambantota:[6.1241,81.1185],
  Matara:[5.9549,80.535], Puttalam:[8.0362,79.8283],
};
const LOC_IMAGES: Record<string,string> = {
  Ampara:'https://images.unsplash.com/photo-1707560664185-6024d2586562?w=1080&auto=format&fit=crop&q=80',
  Anuradhapura:'https://images.unsplash.com/photo-1691219221548-357840b6fb7f?w=1080&auto=format&fit=crop&q=80',
  Badulla:'https://images.unsplash.com/photo-1690139534268-8182c6ed5f53?w=1080&auto=format&fit=crop&q=80',
  Bentota:'https://images.unsplash.com/photo-1706256840752-c9444038ac3b?w=1080&auto=format&fit=crop&q=80',
  Colombo:'https://images.unsplash.com/photo-1664256608032-3007263ab0d6?w=1080&auto=format&fit=crop&q=80',
  Dambulla:'https://images.unsplash.com/photo-1588600208973-da8d230e1e36?w=1080&auto=format&fit=crop&q=80',
  Ella:'https://images.unsplash.com/photo-1704797389230-100a9bbb5b73?w=1080&auto=format&fit=crop&q=80',
  Galle:'https://images.unsplash.com/photo-1699210375804-7d6547c3b227?w=1080&auto=format&fit=crop&q=80',
  Habarana:'https://images.unsplash.com/photo-1751660762088-2c340bd7be73?w=1080&auto=format&fit=crop&q=80',
  Hambantota:'https://images.unsplash.com/photo-1661768508643-e260f6f8e06c?w=1080&auto=format&fit=crop&q=80',
  Jaffna:'https://images.unsplash.com/photo-1725773682183-f0c885081ce5?w=1080&auto=format&fit=crop&q=80',
  Kandy:'https://images.unsplash.com/photo-1737008233483-20585f5fbc62?w=1080&auto=format&fit=crop&q=80',
  Matara:'https://images.unsplash.com/photo-1608042663308-786a9cc332c8?w=1080&auto=format&fit=crop&q=80',
  Mirissa:'https://images.unsplash.com/photo-1594476191313-c2a8d227ce61?w=1080&auto=format&fit=crop&q=80',
  "Nuwara Eliya":'https://images.unsplash.com/photo-1559038300-07cb5d6c3d27?w=1080&auto=format&fit=crop&q=80',
  Polonnaruwa:'https://images.unsplash.com/photo-1691470819158-06e05f6e2bee?w=1080&auto=format&fit=crop&q=80',
  Puttalam:'https://images.unsplash.com/photo-1734117426079-62d11be77570?w=1080&auto=format&fit=crop&q=80',
  Sigiriya:'https://images.unsplash.com/photo-1756670164617-76aeb86e6091?w=1080&auto=format&fit=crop&q=80',
  Trincomalee:'https://images.unsplash.com/photo-1558446791-ac5fec3caddf?w=1080&auto=format&fit=crop&q=80',
};
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1559038300-07cb5d6c3d27?w=1080&auto=format&fit=crop&q=80';
const ACT_IMAGES: Array<[string,string]> = [
  ['cycling','https://images.unsplash.com/photo-1595368062405-e4d7840cba14?w=800&auto=format&fit=crop&q=80'],
  ['waterfall','https://images.unsplash.com/photo-1588757305221-2079a75b413d?w=800&auto=format&fit=crop&q=80'],
  ['boat','https://images.unsplash.com/photo-1751660762088-2c340bd7be73?w=800&auto=format&fit=crop&q=80'],
  ['cooking','https://images.unsplash.com/photo-1559038300-07cb5d6c3d27?w=800&auto=format&fit=crop&q=80'],
  ['fort','https://images.unsplash.com/photo-1709926304766-ad3306a32fcc?w=800&auto=format&fit=crop&q=80'],
  ['safari','https://images.unsplash.com/photo-1751660762088-2c340bd7be73?w=800&auto=format&fit=crop&q=80'],
  ['snorkel','https://images.unsplash.com/photo-1693307379048-890167f73704?w=800&auto=format&fit=crop&q=80'],
  ['whale','https://images.unsplash.com/photo-1693307379048-890167f73704?w=800&auto=format&fit=crop&q=80'],
  ['surf','https://images.unsplash.com/photo-1760864427780-cfc43757ebcd?w=800&auto=format&fit=crop&q=80'],
  ['trek','https://images.unsplash.com/photo-1595368062405-e4d7840cba14?w=800&auto=format&fit=crop&q=80'],
  ['temple','https://images.unsplash.com/photo-1707324021005-a3d0c48cfcbd?w=800&auto=format&fit=crop&q=80'],
  ['village','https://images.unsplash.com/photo-1663784025074-49e9e7f11f62?w=800&auto=format&fit=crop&q=80'],
  ['pottery','https://images.unsplash.com/photo-1663784025074-49e9e7f11f62?w=800&auto=format&fit=crop&q=80'],
  ['dance','https://images.unsplash.com/photo-1707324021005-a3d0c48cfcbd?w=800&auto=format&fit=crop&q=80'],
  ['tea','https://images.unsplash.com/photo-1559038300-07cb5d6c3d27?w=800&auto=format&fit=crop&q=80'],
];

function getActivityImage(title: string): string { const t=title.toLowerCase(); for(const[kw,url] of ACT_IMAGES){if(t.includes(kw))return url;} return FALLBACK_IMAGE; }
function distKm(a:string,b:string):number { const ca=COORDS[a],cb=COORDS[b]; if(!ca||!cb)return 999; const R=6371,toR=(x:number)=>x*Math.PI/180; const dLat=toR(cb[0]-ca[0]),dLon=toR(cb[1]-ca[1]); const h=Math.sin(dLat/2)**2+Math.cos(toR(ca[0]))*Math.cos(toR(cb[0]))*Math.sin(dLon/2)**2; return R*2*Math.asin(Math.sqrt(h)); }
const PREF_KW:Record<string,string[]>={cultural:['cultural','heritage','conservation','community','traditional','culinary','cooking','pottery','batik','dance','drum','craft','laaksha','walawwa','rhythms','angampora'],nature:['outdoor','wildlife','environmental','agricultural','farm','bird','elephant','safari','nature','kayak','boat','lake'],beach:['coastal','beach','snorkel','surf','fishing','boat','kayak','lake','water','mangrove','canal','island','whale'],adventure:['adventure','cycling','trek','tuk tuk','kayak','hiking','e-bike','mtb','walk','waterfall']};
function matchPref(r:ActivityRow,prefs:string[]){const h=(r.category+' '+r.activity).toLowerCase();return prefs.some(p=>(PREF_KW[p]||[]).some(kw=>h.includes(kw)));}
function matchTrav(r:ActivityRow,t:string){return t==='group'?r.group:t==='family'?r.family:t==='solo'?r.solo:true;}
function matchAge(r:ActivityRow,mn:number,mx:number){return r.ageMax>=mn&&r.ageMin<=mx;}
function seededRng(seed:number){let s=seed>>>0;return()=>{s=(Math.imul(1664525,s)+1013904223)>>>0;return s/0xffffffff;};}
function buildSeed(days:number,prefs:string[],trav:string,mn:number,mx:number){const str=`${days}|${[...prefs].sort().join(',')}|${trav}|${mn}|${mx}`;let h=5381;for(let i=0;i<str.length;i++)h=((h<<5)+h)^str.charCodeAt(i);return h>>>0;}
function shuffle<T>(arr:T[],rng:()=>number):T[]{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function generatePlan(days:number,prefs:string[],trav:string,mn:number,mx:number,variant=0):DayPlan[]{
  const seed=buildSeed(days,prefs,trav,mn,mx)^(variant*0x9e3779b9>>>0); const rng=seededRng(seed);
  let pool=RAW.filter(r=>matchPref(r,prefs)&&matchTrav(r,trav)&&matchAge(r,mn,mx));
  if(pool.length<days*1.2)pool=RAW.filter(r=>matchPref(r,prefs)); if(pool.length<days)pool=[...RAW]; pool=shuffle(pool,rng);
  const byBase:Record<string,ActivityRow[]>={}; for(const r of pool){if(!byBase[r.baseLocation])byBase[r.baseLocation]=[];byBase[r.baseLocation].push(r);}
  const bases=shuffle(Object.keys(byBase),rng); const used=new Set<string>(),usedB=new Set<string>(),plans:DayPlan[]=[]; let cur=bases[0];
  for(let d=0;d<days;d++){
    const candidates=bases.filter(b=>byBase[b].some(r=>!used.has(r.activity))).map(b=>({b,dist:distKm(cur,b)})).sort((a,x)=>a.dist-x.dist);
    const nearby=candidates.filter(c=>c.dist<=80&&!usedB.has(c.b)); const next=(nearby[0]??candidates[0])?.b??cur; usedB.add(next);
    const avail=byBase[next].filter(r=>!used.has(r.activity)); const picked=(avail.length?avail:byBase[next]).slice(0,Math.min(3,byBase[next].length));
    picked.forEach(r=>used.add(r.activity)); plans.push({day:d+1,title:`Day ${d+1}`,image:LOC_IMAGES[next]??FALLBACK_IMAGE,location:next,center:next,
      activities:picked.map(r=>({time:r.time||'Morning',title:r.activity,description:r.category,image:getActivityImage(r.activity),location:r.location,category:r.category,food:r.food,effort:r.effort}))}); cur=next;
  } return plans;
}
function countPlans(prefs:string[],trav:string,mn:number,mx:number):number{let pool=RAW.filter(r=>matchPref(r,prefs)&&matchTrav(r,trav)&&matchAge(r,mn,mx));if(pool.length<3)pool=RAW.filter(r=>matchPref(r,prefs));return Math.min(999,Math.max(1,Math.floor(pool.length*new Set(pool.map(r=>r.baseLocation)).size/3)));}

const ZONE_COLORS=['#01a98f','#f59e0b','#8b5cf6','#ec4899','#3b82f6','#f97316','#06b6d4','#84cc16','#ef4444','#a855f7','#14b8a6','#eab308','#6366f1','#22c55e'];
const EFFORT_META:Record<string,{c:string;l:string}>={High:{c:'#ef4444',l:'High Effort'},Median:{c:'#f59e0b',l:'Moderate'},Low:{c:'#22c55e',l:'Easy'},'':{c:'#94a3b8',l:'Flexible'}};
const TIME_ICON:Record<string,string>={Morning:'🌅',Evening:'🌆',Night:'🌙','Any Time':'🕐','':'🕐'};

const STEPS = [
  { label:'Travelers', icon:Users },
  { label:'Duration', icon:Calendar },
  { label:'Age Range', icon:Heart },
  { label:'Interests', icon:Compass },
];

const JK_IMAGES = [
  '058410f1-98d9-4581-a057-58f612894aec.JPG',
  '059aba38-b680-4ecd-92b4-4aac90db24d0.JPG',
  '06d8d643-3e1c-4dcc-a352-72598cdc789f.JPG',
  '0747a76f-75e5-4ae2-ba2d-86a395e07607.JPG',
  '1c1da7f6-04df-4006-b358-f72180344bc9.JPG',
  '1d057626-c7c2-4468-b27e-7ae5ca92c5ec.JPG',
  '36bad60b-0311-4ff0-bfbf-47372b6bf387.JPG',
  '38193b6d-cbb0-4855-8ec4-03ff20140802.JPG',
  '6c3ac59c-b34e-489b-92d5-f176171b8c56.JPG',
  '6d49aa4b-7b04-41c3-b303-5c57fdbb2016.JPG',
  '97d2e6fa-d0fa-42fc-b073-77c559d93819.JPG',
  'a57b7812-5765-405b-9ba8-8b49260633f1.JPG',
  'ab0807ad-a79a-4a1b-b4a6-db6cd96274f1.JPG',
  'adfbdbac-eeb7-4625-9816-30e3dfb000ee.JPG',
  'c244d27c-3596-4467-b049-b2d167113e8f.JPG',
  'cba4d086-9641-4e44-b9cb-2652c39f8fe8.JPG',
  'cc291ab2-0b0a-4f39-b9f4-e8ba8f872706.JPG',
  'd8ff77e2-56ce-4db3-9a32-f7b31f9f9d08.JPG',
  'e83266c2-839a-4fd1-acc6-02d28bec59d9.JPG',
  'fe09f5df-7ef5-44ab-80b0-22b674015ca6.JPG',
  'Image-Edit.png',
  'IMG_0020.JPG',
  'IMG_0436.JPG',
  'IMG_0457.jpg',
  'IMG_0493.JPG',
  'IMG_0968.JPG',
  'IMG_1010.jpg',
  'IMG_1177.jpg',
  'IMG_1414.jpg',
  'IMG_1548.JPG',
  'IMG_2311.JPG',
  'IMG_2314.jpg',
  'IMG_2315.jpg',
  'IMG_2545.JPG',
  'IMG_2742.jpg',
  'IMG_4111.JPG',
  'IMG_4810.JPG',
  'IMG_5772.jpg',
  'IMG_6062.jpg',
  'IMG_6325.JPG',
  'IMG_6434.JPG',
  'IMG_7060.jpg',
  'IMG_7199.jpg',
  'IMG_7200.jpg',
  'IMG_7483.JPG',
  'WhatsApp Image 2026-02-23 at 21.46.13.jpeg',
  'WhatsApp Image 2026-02-23 at 21.46.19.jpeg',
].map(f => `/JK%20Images/${encodeURIComponent(f)}`);

// ═══════════════════════════════════════════════════════════════════════════════
export function AIJourneyPlanner() {
  const [step, setStep]                   = useState(0);
  const [days, setDays]                   = useState(3);
  const [travelerType, setTravelerType]   = useState('');
  const [preferences, setPreferences]     = useState<string[]>([]);
  const [ageMin, setAgeMin]               = useState(0);
  const [ageMax, setAgeMax]               = useState(45);
  const [journeyPlan, setJourneyPlan]     = useState<DayPlan[]|null>(null);
  const [selectedDay, setSelectedDay]     = useState(0);
  const [planCount, setPlanCount]         = useState(0);
  const [expandedActivity, setExpandedActivity] = useState<Record<string,boolean>>({});
  const [isLoading, setIsLoading]         = useState(false);
  const [variant, setVariant]             = useState(0);
  const [visible, setVisible]             = useState(false);
  const [galleryIdx, setGalleryIdx]       = useState(0);
  const [galleryPaused, setGalleryPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const resultRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.08 });
    io.observe(el); return () => io.disconnect();
  }, []);

  // Auto-slide gallery (pauses on hover or manual interaction)
  useEffect(() => {
    if (galleryPaused) return;
    const timer = setInterval(() => {
      setGalleryIdx(prev => (prev + 1) % JK_IMAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [galleryPaused]);

  const galleryPrev = useCallback(() => {
    setGalleryIdx(prev => (prev - 1 + JK_IMAGES.length) % JK_IMAGES.length);
  }, []);
  const galleryNext = useCallback(() => {
    setGalleryIdx(prev => (prev + 1) % JK_IMAGES.length);
  }, []);

  const travelerTypes = [
    { id:'solo',   label:'Solo Traveller', emoji:'🧳', desc:'Just me exploring' },
    { id:'couple', label:'Couple',         emoji:'💑', desc:'Romantic getaway' },
    { id:'family', label:'Family',         emoji:'👨‍👩‍👧‍👦', desc:'Fun for everyone' },
    { id:'group',  label:'Group',          emoji:'🎉', desc:'Friends & crew' },
  ];

  const preferenceOptions = [
    { id:'relax',     label:'Relax',     icon:'😌', sub:'Beaches, spas, retreats',      bg:'linear-gradient(135deg,#dbeafe,#eff6ff)' },
    { id:'active',    label:'Active',    icon:'🚴', sub:'Cycling, hiking, sports',      bg:'linear-gradient(135deg,#dcfce7,#f0fdf4)' },
    { id:'cultural',  label:'Cultural',  icon:'🏛️', sub:'Heritage, arts, crafts',       bg:'linear-gradient(135deg,#fef3c7,#fffbeb)' },
    { id:'religious', label:'Religious', icon:'🙏', sub:'Temples, shrines, pilgrimage', bg:'linear-gradient(135deg,#fce7f3,#fdf2f8)' },
    { id:'nature',    label:'Nature',    icon:'🌿', sub:'Forests, gardens, eco tours',  bg:'linear-gradient(135deg,#d1fae5,#ecfdf5)' },
    { id:'wildlife',  label:'Wildlife',  icon:'🦁', sub:'Safari, animals, parks',       bg:'linear-gradient(135deg,#fed7aa,#fff7ed)' },
    { id:'marine',    label:'Marine',    icon:'🐋', sub:'Diving, snorkelling, boats',   bg:'linear-gradient(135deg,#bae6fd,#f0f9ff)' },
    { id:'adventure', label:'Adventure', icon:'🧗', sub:'Rock climb, rappel, extreme',  bg:'linear-gradient(135deg,#e9d5ff,#faf5ff)' },
    { id:'culinary',  label:'Culinary',  icon:'🍜', sub:'Cooking, food tours, cuisine', bg:'linear-gradient(135deg,#fecaca,#fef2f2)' },
    { id:'lifestyle', label:'Lifestyle', icon:'✨', sub:'Local living, wellness',       bg:'linear-gradient(135deg,#ccfbf1,#f0fdfa)' },
  ];

  const togglePreference = (p: string) => setPreferences(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const canProceed = (s: number) => s === 0 ? !!travelerType : s === 3 ? preferences.length > 0 : true;

  const handleGeneratePlan = () => {
    if (!preferences.length || !travelerType) return;
    setIsLoading(true);
    setTimeout(() => {
      const plan = generatePlan(days, preferences, travelerType, ageMin, ageMax, variant);
      setJourneyPlan(plan); setPlanCount(countPlans(preferences, travelerType, ageMin, ageMax));
      setSelectedDay(0); setExpandedActivity({}); setIsLoading(false);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }, 800);
  };

  const handleShuffle = () => {
    const v = variant + 1; setVariant(v);
    setJourneyPlan(generatePlan(days, preferences, travelerType, ageMin, ageMax, v));
    setSelectedDay(0); setExpandedActivity({});
  };

  const toggleActivity = (idx: number) => {
    const key = `${selectedDay}-${idx}`;
    setExpandedActivity(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentDay = journeyPlan?.[selectedDay];
  const zCol = '#01a98f';

  return (
    <section id="planner" className="ajp-section" ref={sectionRef}>
      <div className="ajp-bg-orb ajp-bg-orb-1" />
      <div className="ajp-bg-orb ajp-bg-orb-2" />
      <div className="ajp-bg-orb ajp-bg-orb-3" />
      <div className="ajp-bg-grid" />

      {/* Background image overlay (bg02.png) */}
      <div className="ajp-overlay-image" />

      <div className="ajp-container">
        {/* ── Header ── */}
        <div className={`ajp-header ${visible ? 'ajp-anim-in' : ''}`}>
          <span className="ajp-badge"><Sparkles style={{ width: 14, height: 14 }} /> AI-Powered Journey Builder</span>
          <h2 className="ajp-title">Kraft Your <span className="ajp-title-accent">Journey</span></h2>
          <p className="ajp-subtitle">Let AI plan the perfect Sri Lankan adventure — every day stays in one region, no long drives.</p>
        </div>

        {/* ══════════════════════════════ WIZARD ══════════════════════════════ */}
        {!journeyPlan && (
          <div className={`ajp-wizard ${visible ? 'ajp-anim-in' : ''}`} style={{ animationDelay: '0.15s' }}>
            {/* Stepper */}
            <div className="ajp-stepper">
              {STEPS.map((s, i) => {
                const Icon = s.icon; const done = i < step; const active = i === step;
                return (
                  <div key={i} className="ajp-step-item">
                    {i > 0 && <div className={`ajp-step-line ${done ? 'ajp-step-line-done' : ''}`} />}
                    <button className={`ajp-step-dot ${done ? 'ajp-step-done' : ''} ${active ? 'ajp-step-active' : ''}`}
                      onClick={() => { if (done || active) setStep(i); }}>
                      {done ? <Check style={{ width: 16, height: 16 }} /> : <Icon style={{ width: 16, height: 16 }} />}
                    </button>
                    <span className={`ajp-step-label ${active ? 'ajp-step-label-active' : ''}`}>{s.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Glass Card */}
            <div className="ajp-glass-card">
              <div className="ajp-glass-mesh" />

              {/* Step 0 — Traveler Type */}
              {step === 0 && (
                <div className="ajp-step-content ajp-fade-in" key="s0">
                  <h3 className="ajp-step-title">Who's traveling?</h3>
                  <p className="ajp-step-desc">Pick your travel style — this shapes the entire experience.</p>
                  <div className="ajp-traveler-grid">
                    {travelerTypes.map(t => {
                      const on = travelerType === t.id;
                      return (
                        <button key={t.id} className={`ajp-traveler-card ${on ? 'ajp-traveler-card-on' : ''}`} onClick={() => setTravelerType(t.id)}>
                          <div className="ajp-traveler-emoji">{t.emoji}</div>
                          <div className="ajp-traveler-label">{t.label}</div>
                          <div className="ajp-traveler-desc">{t.desc}</div>
                          {on && <div className="ajp-traveler-check"><Check style={{ width: 14, height: 14 }} /></div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 1 — Duration */}
              {step === 1 && (
                <div className="ajp-step-content ajp-fade-in" key="s1">
                  <h3 className="ajp-step-title">How many days?</h3>
                  <p className="ajp-step-desc">Choose the length of your Sri Lankan journey.</p>
                  <div className="ajp-days-row">
                    {[3, 5, 7, 10, 14].map(d => (
                      <button key={d} className={`ajp-day-btn ${days === d ? 'ajp-day-btn-on' : ''}`} onClick={() => setDays(d)}>
                        <span className="ajp-day-num">{d}</span>
                        <span className="ajp-day-label">Days</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 — Age Range */}
              {step === 2 && (
                <div className="ajp-step-content ajp-fade-in" key="s2">
                  <h3 className="ajp-step-title">Traveler age range</h3>
                  <p className="ajp-step-desc">We'll tailor activity difficulty and pace.</p>
                  <div className="ajp-age-block">
                    <div className="ajp-age-track-wrap">
                      <div className="ajp-age-track" />
                      <div className="ajp-age-active" style={{ left: `${ageMin}%`, right: `${100 - ageMax}%` }} />
                      {[0,10,20,30,40,50,60,70,80,90,100].map(v => (
                        <div key={v} className={`ajp-age-tick ${v % 20 === 0 ? 'ajp-age-tick-major' : ''}`} style={{ left: `${v}%` }} />
                      ))}
                      <input type="range" min={0} max={100} value={ageMin}
                        onChange={e => { const v = +e.target.value; setAgeMin(v >= ageMax ? Math.max(0, ageMax - 1) : v); }}
                        className="ajp-age-slider age-range-slider" aria-label="Min age" />
                      <input type="range" min={0} max={100} value={ageMax}
                        onChange={e => { const v = +e.target.value; setAgeMax(v <= ageMin ? Math.min(100, ageMin + 1) : v); }}
                        className="ajp-age-slider age-range-slider" aria-label="Max age" />
                    </div>
                    <div className="ajp-age-inputs">
                      <div className="ajp-age-input-group">
                        <span className="ajp-age-input-label">Min Age</span>
                        <input type="number" min={0} max={100} value={ageMin}
                          onChange={e => { const v = +e.target.value; if (v >= 0 && v < ageMax) setAgeMin(v); }}
                          className="ajp-age-input" />
                      </div>
                      <span className="ajp-age-dash">—</span>
                      <div className="ajp-age-input-group">
                        <span className="ajp-age-input-label">Max Age</span>
                        <input type="number" min={0} max={100} value={ageMax}
                          onChange={e => { const v = +e.target.value; if (v > ageMin && v <= 100) setAgeMax(v); }}
                          className="ajp-age-input" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Preferences */}
              {step === 3 && (
                <div className="ajp-step-content ajp-fade-in" key="s3">
                  <h3 className="ajp-step-title">What excites you?</h3>
                  <p className="ajp-step-desc">Pick as many — we'll blend them into your itinerary.</p>
                  <div className="ajp-pref-grid">
                    {preferenceOptions.map(o => {
                      const on = preferences.includes(o.id);
                      return (
                        <button key={o.id} className={`ajp-pref-card ${on ? 'ajp-pref-card-on' : ''}`}
                          onClick={() => togglePreference(o.id)}
                          style={{ '--pref-bg': o.bg } as React.CSSProperties}>
                          <span className="ajp-pref-emoji">{o.icon}</span>
                          <span className="ajp-pref-name">{o.label}</span>
                          <span className="ajp-pref-sub">{o.sub}</span>
                          {on && <div className="ajp-pref-check"><Check style={{ width: 12, height: 12 }} /></div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div className="ajp-nav-row">
                {step > 0 && (
                  <button className="ajp-nav-btn ajp-nav-back" onClick={() => setStep(step - 1)}>
                    <ChevronLeft style={{ width: 18, height: 18 }} /> Back
                  </button>
                )}
                <div style={{ flex: 1 }} />
                {step < 3 ? (
                  <button className={`ajp-nav-btn ajp-nav-next ${!canProceed(step) ? 'ajp-nav-disabled' : ''}`}
                    onClick={() => { if (canProceed(step)) setStep(step + 1); }} disabled={!canProceed(step)}>
                    Next <ChevronRight style={{ width: 18, height: 18 }} />
                  </button>
                ) : (
                  <button className={`ajp-nav-btn ajp-nav-generate ${!canProceed(step) ? 'ajp-nav-disabled' : ''}`}
                    onClick={handleGeneratePlan} disabled={!canProceed(step) || isLoading}>
                    {isLoading
                      ? <><span className="ajp-spinner" /> Building route…</>
                      : <><Sparkles style={{ width: 18, height: 18 }} /> Generate My Journey</>}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Auto-Slide Gallery ── */}
        <div
          className={`ajp-gallery ${visible ? 'ajp-anim-in' : ''}`}
          style={{ animationDelay: '0.25s' }}
          onMouseEnter={() => setGalleryPaused(true)}
          onMouseLeave={() => setGalleryPaused(false)}
        >
          <div className="ajp-gallery-header">
            <h4 className="ajp-gallery-title">Our Experiences</h4>
            <div className="ajp-gallery-controls">
              <button className="ajp-gallery-arrow" onClick={galleryPrev} aria-label="Previous images">
                <ChevronLeft style={{ width: 20, height: 20 }} />
              </button>
              <button className="ajp-gallery-arrow" onClick={galleryNext} aria-label="Next images">
                <ChevronRight style={{ width: 20, height: 20 }} />
              </button>
            </div>
          </div>
          <div className="ajp-gallery-viewport">
            <div className="ajp-gallery-track" style={{ transform: `translateX(-${galleryIdx * (100 / 5)}%)` }}>
              {JK_IMAGES.map((src, i) => (
                <div key={i} className="ajp-gallery-slide">
                  <img src={src} alt={`Experience ${i + 1}`} className="ajp-gallery-img" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
          <div className="ajp-gallery-dots">
            {Array.from({ length: Math.ceil(JK_IMAGES.length / 5) }, (_, i) => (
              <button key={i}
                className={`ajp-gallery-dot ${Math.floor(galleryIdx / 5) === i ? 'ajp-gallery-dot-on' : ''}`}
                onClick={() => setGalleryIdx(i * 5)}
              />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════ RESULTS ═════════════════════════════ */}
        {journeyPlan && (
          <div ref={resultRef} className="ajp-results ajp-fade-in">

            {/* Meta */}
            <div className="ajp-results-header">
              <div>
                <h3 className="ajp-results-title">Your Personalised Itinerary</h3>
                <div className="ajp-results-count-row">
                  <span className="ajp-results-count">{planCount.toLocaleString()}+</span>
                  <span className="ajp-results-count-label">possible plans for your preferences</span>
                </div>
              </div>
              <div className="ajp-results-actions">
                <button className="ajp-btn-shuffle" onClick={handleShuffle}><Shuffle style={{ width: 16, height: 16 }} /> Try Another</button>
                <button className="ajp-btn-edit" onClick={() => { setJourneyPlan(null); setStep(0); }}>Edit Preferences</button>
              </div>
            </div>

            {/* Day Carousel */}
            <div className="ajp-day-carousel">
              {journeyPlan.map((dp, idx) => {
                const active = idx === selectedDay;
                const zc = '#01a98f';
                return (
                  <button key={dp.day} className={`ajp-daycard ${active ? 'ajp-daycard-active' : ''}`}
                    onClick={() => setSelectedDay(idx)} style={{ '--zone-color': zc } as React.CSSProperties}>
                    <div className="ajp-daycard-img-wrap">
                      <ImageWithFallback src={dp.image} alt={dp.title} className="ajp-daycard-img" />
                      <div className="ajp-daycard-img-overlay" />
                      <div className="ajp-daycard-accent" style={{ background: zc }} />
                    </div>
                    <div className="ajp-daycard-body">
                      <span className="ajp-daycard-day" style={{ color: zc }}>Day {dp.day}</span>
                      <span className="ajp-daycard-loc">{dp.location}</span>
                      <span className="ajp-daycard-count">{dp.activities.length} activities</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Day Detail */}
            {currentDay && (
              <div className="ajp-detail" style={{ '--zone-color': zCol } as React.CSSProperties}>
                <div className="ajp-detail-hero">
                  <ImageWithFallback src={currentDay.image} alt={currentDay.location} className="ajp-detail-hero-img" />
                  <div className="ajp-detail-hero-overlay" />
                  <div className="ajp-detail-hero-bar" style={{ background: zCol }} />
                  <div className="ajp-detail-hero-content">
                    <span className="ajp-detail-day-pill" style={{ background: zCol }}>Day {currentDay.day}</span>
                    <h3 className="ajp-detail-loc">{currentDay.location} Region</h3>
                    <div className="ajp-detail-divider" style={{ background: zCol }} />
                    <div className="ajp-detail-meta">
                      <span className="ajp-detail-meta-item"><MapPin style={{ width: 14, height: 14 }} /> {currentDay.activities.length} {currentDay.activities.length === 1 ? 'Activity' : 'Activities'}</span>
                      <span className="ajp-detail-meta-sep">|</span>
                      {[...new Set(currentDay.activities.map(a => a.location))].map(loc => (
                        <span key={loc} className="ajp-detail-loc-chip">{loc}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="ajp-activities">
                  <div className="ajp-activities-head">
                    <h4 className="ajp-activities-title">Today's Activities</h4>
                    <span className="ajp-activities-badge" style={{ background: `color-mix(in srgb, ${zCol} 12%, transparent)`, color: zCol, borderColor: `color-mix(in srgb, ${zCol} 25%, transparent)` }}>
                      {currentDay.activities.length} planned
                    </span>
                  </div>
                  <div className="ajp-activities-list">
                    {currentDay.activities.map((act, ai) => {
                      const key = `${selectedDay}-${ai}`;
                      const open = !!expandedActivity[key];
                      const em = EFFORT_META[act.effort] ?? EFFORT_META[''];
                      return (
                        <div key={ai} className={`ajp-act-card ${open ? 'ajp-act-card-open' : ''}`}
                          style={{ '--zone-color': zCol, '--effort-color': em.c } as React.CSSProperties}>
                          <button className="ajp-act-header" onClick={() => toggleActivity(ai)}>
                            <div className="ajp-act-time-badge">
                              <span className="ajp-act-time-emoji">{TIME_ICON[act.time] ?? '🕐'}</span>
                              <span className="ajp-act-time-text" style={{ color: zCol }}>{act.time || 'Flexible'}</span>
                            </div>
                            <div className="ajp-act-info">
                              <div className="ajp-act-title">{act.title}</div>
                              <div className="ajp-act-cat">{act.description}</div>
                              <div className="ajp-act-tags">
                                <span className="ajp-act-effort-tag" style={{ background: `color-mix(in srgb, ${em.c} 14%, transparent)`, color: em.c, borderColor: `color-mix(in srgb, ${em.c} 30%, transparent)` }}>
                                  <Zap style={{ width: 12, height: 12 }} /> {em.l}
                                </span>
                                {act.location !== currentDay.center && (
                                  <span className="ajp-act-loc-tag"><MapPin style={{ width: 12, height: 12 }} /> {act.location}</span>
                                )}
                              </div>
                            </div>
                            {open ? <ChevronUp style={{ width: 20, height: 20, color: zCol, flexShrink: 0 }} /> : <ChevronDown style={{ width: 20, height: 20, color: 'var(--muted-foreground)', flexShrink: 0 }} />}
                          </button>
                          {open && (
                            <div className="ajp-act-body">
                              <div className="ajp-act-details">
                                <div className="ajp-act-detail-card">
                                  <div className="ajp-act-detail-icon" style={{ background: `color-mix(in srgb, ${zCol} 15%, transparent)` }}>
                                    <Utensils style={{ width: 16, height: 16, color: zCol }} />
                                  </div>
                                  <div><div className="ajp-act-detail-label">Food Included</div><div className="ajp-act-detail-value">{act.food && act.food !== 'No' ? act.food : 'None'}</div></div>
                                </div>
                                <div className="ajp-act-detail-card">
                                  <div className="ajp-act-detail-icon" style={{ background: `color-mix(in srgb, ${zCol} 15%, transparent)` }}>
                                    <Clock style={{ width: 16, height: 16, color: zCol }} />
                                  </div>
                                  <div><div className="ajp-act-detail-label">Best Time</div><div className="ajp-act-detail-value">{TIME_ICON[act.time] ?? '🕐'} {act.time || 'Flexible'}</div></div>
                                </div>
                              </div>
                              <div className="ajp-act-loc-strip" style={{ background: `color-mix(in srgb, ${zCol} 10%, transparent)`, borderColor: `color-mix(in srgb, ${zCol} 25%, transparent)` }}>
                                <MapPin style={{ width: 14, height: 14, color: zCol }} />
                                <span style={{ color: zCol, fontWeight: 600, fontSize: '0.88rem' }}>{act.location}</span>
                                <span className="ajp-act-loc-cat">· {act.category}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  );
}
