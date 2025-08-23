import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, User, Mail, Phone, Ticket, Clock, CreditCard } from "lucide-react";
import { TicketTierSelector } from "./TicketTierSelector";
import { BookingService } from "@/services/bookingService";
import { BookingFormData } from "@/types/booking";
import { calculateTotalAmount } from "@/config/ticketTiers";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  tickets: z.string().min(1, "Please select number of tickets"),
  showtime: z.string().min(1, "Please select a showtime"),
});

interface BookingFormProps {
  movieTitle: string;
  showtimes: string[];
  movieId: string;
}

export const BookingForm = ({ movieTitle, showtimes, movieId }: BookingFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'silver' | 'gold'>('silver');
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const { toast } = useToast();
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      tickets: "1",
      showtime: "",
      ticketTier: "silver",
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    
    try {
      // Create booking with ticket tier
      const bookingData = {
        ...data,
        ticketTier: selectedTier,
        tickets: numberOfTickets.toString(),
      };

      const booking = await BookingService.createBooking(bookingData, movieTitle, movieId);

      setIsSuccess(true);
      toast({
        title: "Booking Confirmed! 🎬",
        description: `Your booking for ${movieTitle} has been confirmed. Check your email for details.`,
      });
      
      form.reset();
      setSelectedTier('silver');
      setNumberOfTickets(1);
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketChange = (value: string) => {
    const tickets = parseInt(value);
    setNumberOfTickets(tickets);
    form.setValue("tickets", value);
  };

  if (isSuccess) {
    return (
      <Card className="max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-divine-white to-background">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-saffron mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-deep-blue mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            Your booking for <span className="font-semibold text-primary">{movieTitle}</span> has been successfully confirmed. 
            You will receive a confirmation email shortly with payment instructions.
          </p>
          <div className="space-y-3 mb-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">💳 Payment Required</h3>
              <p className="text-sm text-yellow-700">
                Please show the confirmation email at the cinema counter to pay and collect your tickets.
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setIsSuccess(false)}
            className="bg-gradient-to-r from-deep-blue to-primary hover:from-primary hover:to-deep-blue"
          >
            Book Another Movie
          </Button>
        </CardContent>
      </Card>
    );
  }

  const totalAmount = calculateTotalAmount(selectedTier, numberOfTickets);

  return (
    <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-gradient-to-br from-divine-white to-background">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-deep-blue">
          Book Your Seats
        </CardTitle>
        <p className="text-muted-foreground">
          Secure your seats for <span className="font-semibold text-saffron">{movieTitle}</span>
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-deep-blue border-b border-border pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-deep-blue font-semibold flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter your full name"
                          className="border-border/50 focus:border-saffron focus:ring-saffron/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-deep-blue font-semibold flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          placeholder="Enter your email"
                          className="border-border/50 focus:border-saffron focus:ring-saffron/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-deep-blue font-semibold flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter your phone number"
                          className="border-border/50 focus:border-saffron focus:ring-saffron/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tickets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-deep-blue font-semibold flex items-center gap-2">
                        <Ticket className="w-4 h-4" />
                        Number of Tickets
                      </FormLabel>
                      <Select onValueChange={handleTicketChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-border/50 focus:border-saffron focus:ring-saffron/20">
                            <SelectValue placeholder="Select tickets" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Ticket' : 'Tickets'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Ticket Tier Selection */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-deep-blue border-b border-border pb-2">
                Ticket Selection
              </h3>
              <TicketTierSelector
                selectedTier={selectedTier}
                onTierChange={setSelectedTier}
                numberOfTickets={numberOfTickets}
              />
            </div>

            {/* Showtime Selection */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-deep-blue border-b border-border pb-2">
                Showtime Selection
              </h3>
              <FormField
                control={form.control}
                name="showtime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-deep-blue font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Preferred Show Time
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-border/50 focus:border-saffron focus:ring-saffron/20">
                          <SelectValue placeholder="Select showtime" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {showtimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Payment Summary */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-deep-blue border-b border-border pb-2">
                Payment Summary
              </h3>
              <div className="bg-gradient-to-r from-saffron/10 to-primary/10 p-6 rounded-lg border border-saffron/20">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Movie:</span>
                    <span className="font-medium">{movieTitle}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tickets:</span>
                    <span className="font-medium">{numberOfTickets} × ₹{selectedTier === 'gold' ? 450 : 250}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Ticket Type:</span>
                    <span className="font-medium">{selectedTier === 'gold' ? 'Gold (Balcony)' : 'Silver (Standard)'}</span>
                  </div>
                  <div className="border-t border-border/50 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-deep-blue">Total Amount:</span>
                      <span className="text-2xl font-bold text-saffron">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Payment at Cinema</h4>
                    <p className="text-sm text-yellow-700">
                      Please show your confirmation email at the cinema counter to pay ₹{totalAmount} and collect your tickets.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit" 
              className="w-full bg-gradient-to-r from-deep-blue to-primary hover:from-primary hover:to-deep-blue transition-all duration-300 shadow-lg hover:shadow-xl border-0 py-6 text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Confirm Booking - ₹{totalAmount}
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};