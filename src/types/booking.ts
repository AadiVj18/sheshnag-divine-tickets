export interface BookingData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  movieTitle: string;
  movieId: string;
  showtime: string;
  ticketTier: 'silver' | 'gold';
  numberOfTickets: number;
  totalAmount: number;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  paymentId?: string;
  qrCode?: string;
}

export interface TicketTier {
  id: 'silver' | 'gold';
  name: string;
  description: string;
  price: number;
  features: string[];
  color: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  tickets: string;
  showtime: string;
  ticketTier: 'silver' | 'gold';
}

export interface WhatsAppNotification {
  to: string;
  message: string;
  bookingData: BookingData;
}

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  bookingData: BookingData;
}
