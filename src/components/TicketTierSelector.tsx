import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star } from "lucide-react";
import { TicketTier } from "@/types/booking";
import { TICKET_TIERS } from "@/config/ticketTiers";

interface TicketTierSelectorProps {
  selectedTier: 'silver' | 'gold';
  onTierChange: (tier: 'silver' | 'gold') => void;
  numberOfTickets: number;
}

export const TicketTierSelector = ({ selectedTier, onTierChange, numberOfTickets }: TicketTierSelectorProps) => {
  const [hoveredTier, setHoveredTier] = useState<'silver' | 'gold' | null>(null);

  const renderTierCard = (tierId: 'silver' | 'gold') => {
    const tier = TICKET_TIERS[tierId];
    const isSelected = selectedTier === tierId;
    const isHovered = hoveredTier === tierId;
    const totalPrice = tier.price * numberOfTickets;

    return (
      <Card
        key={tierId}
        className={`cursor-pointer transition-all duration-300 border-2 ${
          isSelected
            ? 'border-saffron bg-gradient-to-br from-saffron/5 to-saffron/10 shadow-lg'
            : 'border-border hover:border-saffron/50 hover:shadow-md'
        } ${isHovered ? 'scale-105' : 'scale-100'}`}
        onClick={() => onTierChange(tierId)}
        onMouseEnter={() => setHoveredTier(tierId)}
        onMouseLeave={() => setHoveredTier(null)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              {tierId === 'gold' ? (
                <Crown className="w-5 h-5 text-yellow-500" />
              ) : (
                <Star className="w-5 h-5 text-gray-500" />
              )}
              {tier.name}
            </CardTitle>
            <Badge 
              variant={isSelected ? "default" : "secondary"}
              className={`${isSelected ? 'bg-saffron text-white' : ''}`}
            >
              ₹{tier.price}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{tier.description}</p>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="space-y-2">
              {tier.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-3 border-t border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total for {numberOfTickets} ticket{numberOfTickets > 1 ? 's' : ''}:</span>
                <span className="text-lg font-bold text-saffron">₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-deep-blue mb-2">Select Ticket Type</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose your preferred seating experience
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderTierCard('silver')}
        {renderTierCard('gold')}
      </div>
      
      {selectedTier && (
        <div className="mt-4 p-4 bg-gradient-to-r from-saffron/10 to-primary/10 rounded-lg border border-saffron/20">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-deep-blue">
              Selected: {TICKET_TIERS[selectedTier].name}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Total amount: <span className="font-bold text-saffron">₹{TICKET_TIERS[selectedTier].price * numberOfTickets}</span>
          </p>
        </div>
      )}
    </div>
  );
};
