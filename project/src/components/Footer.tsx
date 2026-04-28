import { MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-clay py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-forest rounded-xl flex items-center justify-center shadow-lg shadow-forest/20">
                <MapPin className="text-linen w-6 h-6" />
              </div>
              <span className="text-2xl font-serif font-bold text-forest tracking-tight">BukidGo</span>
            </div>
            <p className="text-stone/60 text-sm leading-relaxed">
              Making Bukidnon tourism accessible, smart, and community-driven. 
              Plan your next adventure with a local buddy.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-forest mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-stone/70">
              <li className="hover:text-earth cursor-pointer transition-colors">Explore Spots</li>
              <li className="hover:text-earth cursor-pointer transition-colors">Local Buddies</li>
              <li className="hover:text-earth cursor-pointer transition-colors">Itinerary Generator</li>
              <li className="hover:text-earth cursor-pointer transition-colors">Booking Guide</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-forest mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-stone/70">
              <li className="hover:text-earth cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-earth cursor-pointer transition-colors">Contact</li>
              <li className="hover:text-earth cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-earth cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-forest mb-6">Connect</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-linen border border-clay rounded-full flex items-center justify-center text-stone/40 hover:text-earth transition-colors cursor-pointer shadow-sm">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-linen border border-clay rounded-full flex items-center justify-center text-stone/40 hover:text-earth transition-colors cursor-pointer shadow-sm">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-linen border border-clay rounded-full flex items-center justify-center text-stone/40 hover:text-earth transition-colors cursor-pointer shadow-sm">
                <Twitter className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-clay flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-stone/40">
          <p>© 2026 BukidGo Team (Group 5-HM3B). All rights reserved.</p>
          <p className="font-serif italic capitalize tracking-normal text-stone/60">Designed for Bukidnon Tourism</p>
        </div>
      </div>
    </footer>
  );
}
