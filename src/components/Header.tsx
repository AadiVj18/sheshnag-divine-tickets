import { Film, Star } from "lucide-react";
import lordShivaIcon from "@/assets/lord-shiva-icon.png";

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-deep-blue to-primary text-white shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-deep-blue/90 to-primary/90"></div>
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron to-spiritual-gold p-1 shadow-xl">
                <img 
                  src={lordShivaIcon} 
                  alt="Lord Shiva" 
                  className="w-full h-full rounded-full object-cover bg-white/10" 
                />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-saffron rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-divine-white bg-clip-text">
                Sheshnag Cinema
              </h1>
              <p className="text-white/80 text-sm md:text-base">
                Divine Entertainment Experience • Blessed by Lord Shiva
              </p>
            </div>
          </div>

          {/* Navigation/Features */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <Film className="w-4 h-4" />
              <span>Now Showing</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-saffron/20 rounded-full px-4 py-2 backdrop-blur-sm">
              <Star className="w-4 h-4 text-saffron" />
              <span>Premium Experience</span>
            </div>
          </div>
        </div>
        
        {/* Tagline */}
        <div className="mt-6 text-center">
          <p className="text-white/90 text-lg font-medium italic">
            "Where Stories Come to Life Under Divine Blessings"
          </p>
        </div>
      </div>
    </header>
  );
};