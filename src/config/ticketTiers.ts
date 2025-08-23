import { TicketTier } from '@/types/booking';

export const TICKET_TIERS: Record<string, TicketTier> = {
  silver: {
    id: 'silver',
    name: 'Silver Ticket',
    description: 'Standard seating with great view',
    price: 250, // ₹250
    features: [
      'Standard seating',
      'Great view of the screen',
      'Comfortable chairs',
      'Standard sound quality'
    ],
    color: 'bg-gray-500'
  },
  gold: {
    id: 'gold',
    name: 'Gold Ticket',
    description: 'Premium balcony seating with luxury experience',
    price: 450, // ₹450
    features: [
      'Premium balcony seating',
      'Best view of the screen',
      'Recliner chairs',
      'Premium sound quality',
      'Extra legroom',
      'Priority entry'
    ],
    color: 'bg-yellow-500'
  }
};

export const getTicketTier = (tierId: string): TicketTier => {
  return TICKET_TIERS[tierId] || TICKET_TIERS.silver;
};

export const calculateTotalAmount = (tierId: string, numberOfTickets: number): number => {
  const tier = getTicketTier(tierId);
  return tier.price * numberOfTickets;
};
