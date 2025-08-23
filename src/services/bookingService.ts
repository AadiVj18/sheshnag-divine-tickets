import { BookingData, BookingFormData, WhatsAppNotification, EmailTemplate } from '@/types/booking';
import { calculateTotalAmount } from '@/config/ticketTiers';

// Webhook URLs for notifications
const BOOKING_WEBHOOK_URL = "https://aadivijay18.app.n8n.cloud/webhook/booking-response";
const WHATSAPP_WEBHOOK_URL = "https://aadivijay18.app.n8n.cloud/webhook/whatsapp-notification";
const EMAIL_WEBHOOK_URL = "https://aadivijay18.app.n8n.cloud/webhook/email-confirmation";

// Admin WhatsApp number (you can change this)
const ADMIN_WHATSAPP_NUMBER = "+919876543210"; // Replace with your number

export class BookingService {
  // Store bookings in localStorage (in production, use a real database)
  private static getStoredBookings(): BookingData[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('sheshnag_bookings');
    return stored ? JSON.parse(stored) : [];
  }

  private static saveBookings(bookings: BookingData[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('sheshnag_bookings', JSON.stringify(bookings));
  }

  // Create a new booking
  static async createBooking(formData: BookingFormData, movieTitle: string, movieId: string): Promise<BookingData> {
    const bookingId = `SHESH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const totalAmount = calculateTotalAmount(formData.ticketTier, parseInt(formData.tickets));

    const booking: BookingData = {
      id: bookingId,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      movieTitle,
      movieId,
      showtime: formData.showtime,
      ticketTier: formData.ticketTier as 'silver' | 'gold',
      numberOfTickets: parseInt(formData.tickets),
      totalAmount,
      bookingDate: new Date().toISOString(),
      status: 'pending'
    };

    // Save to local storage
    const bookings = this.getStoredBookings();
    bookings.push(booking);
    this.saveBookings(bookings);

    // Send notifications
    await this.sendWhatsAppNotification(booking);
    await this.sendEmailConfirmation(booking);

    return booking;
  }

  // Send WhatsApp notification to admin
  private static async sendWhatsAppNotification(booking: BookingData): Promise<void> {
    const message = this.createWhatsAppMessage(booking);
    
    const notification: WhatsAppNotification = {
      to: ADMIN_WHATSAPP_NUMBER,
      message,
      bookingData: booking
    };

    try {
      await fetch(WHATSAPP_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });
    } catch (error) {
      console.error('WhatsApp notification failed:', error);
    }
  }

  // Create WhatsApp message
  private static createWhatsAppMessage(booking: BookingData): string {
    const tier = booking.ticketTier === 'gold' ? '🥇 Gold (Balcony)' : '🥈 Silver (Standard)';
    
    return `🎬 *NEW BOOKING ALERT!*

*Movie:* ${booking.movieTitle}
*Customer:* ${booking.customerName}
*Phone:* ${booking.customerPhone}
*Email:* ${booking.customerEmail}

*Booking Details:*
• Tickets: ${booking.numberOfTickets} ${tier}
• Showtime: ${booking.showtime}
• Total Amount: ₹${booking.totalAmount}
• Booking ID: ${booking.id}

*Status:* Pending Payment

Please contact customer for payment confirmation! 🎫`;
  }

  // Send email confirmation to customer
  private static async sendEmailConfirmation(booking: BookingData): Promise<void> {
    const emailTemplate = this.createEmailTemplate(booking);

    try {
      await fetch(EMAIL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailTemplate),
      });
    } catch (error) {
      console.error('Email confirmation failed:', error);
    }
  }

  // Create email template
  private static createEmailTemplate(booking: BookingData): EmailTemplate {
    const tier = booking.ticketTier === 'gold' ? 'Gold (Balcony)' : 'Silver (Standard)';
    const tierColor = booking.ticketTier === 'gold' ? '#FFD700' : '#C0C0C0';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation - Sheshnag Cinema</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a, #f59e0b); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .tier-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; color: white; font-weight: bold; }
          .payment-notice { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 Sheshnag Cinema</h1>
            <p>Divine Entertainment Experience</p>
          </div>
          
          <div class="content">
            <h2>Booking Confirmation</h2>
            <p>Dear ${booking.customerName},</p>
            <p>Your booking has been successfully created! Please find the details below:</p>
            
            <div class="booking-details">
              <h3>📋 Booking Details</h3>
              <p><strong>Booking ID:</strong> ${booking.id}</p>
              <p><strong>Movie:</strong> ${booking.movieTitle}</p>
              <p><strong>Showtime:</strong> ${booking.showtime}</p>
              <p><strong>Ticket Type:</strong> <span class="tier-badge" style="background-color: ${tierColor}">${tier}</span></p>
              <p><strong>Number of Tickets:</strong> ${booking.numberOfTickets}</p>
              <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
            </div>
            
            <div class="payment-notice">
              <h3>💳 Payment Required</h3>
              <p><strong>Important:</strong> Please show this email at the cinema counter and pay ₹${booking.totalAmount} to confirm your booking and collect your tickets.</p>
              <p>Your booking will be held for 30 minutes after the showtime.</p>
            </div>
            
            <h3>📍 Cinema Location</h3>
            <p>Sheshnag Cinema<br>
            Divine Entertainment Complex<br>
            Contact: +91 98765 43210</p>
            
            <p>Thank you for choosing Sheshnag Cinema! 🙏</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>© 2024 Sheshnag Cinema. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return {
      to: booking.customerEmail,
      subject: `Booking Confirmation - ${booking.movieTitle} | Sheshnag Cinema`,
      html,
      bookingData: booking
    };
  }

  // Get all bookings (for admin panel)
  static getAllBookings(): BookingData[] {
    return this.getStoredBookings();
  }

  // Get booking by ID
  static getBookingById(bookingId: string): BookingData | null {
    const bookings = this.getStoredBookings();
    return bookings.find(booking => booking.id === bookingId) || null;
  }

  // Update booking status
  static updateBookingStatus(bookingId: string, status: BookingData['status']): boolean {
    const bookings = this.getStoredBookings();
    const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
    
    if (bookingIndex !== -1) {
      bookings[bookingIndex].status = status;
      this.saveBookings(bookings);
      return true;
    }
    
    return false;
  }
}
