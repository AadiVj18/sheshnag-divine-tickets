import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, User, Mail, Phone, Clock, CreditCard, Armchair } from "lucide-react";
import { SeatSelection } from "./SeatSelection";
import { BookingService } from "@/services/bookingService";
import { BookingFormData } from "@/types/booking";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
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
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [confirmedSeats, setConfirmedSeats] = useState<string[]>([]);
  const { toast } = useToast();
  
  const form = useForm<Omit<BookingFormData, 'tickets' | 'ticketTier'>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      showtime: "",
    },
  });

  // Calculate pricing based on selected seats
  const goldCount = selectedSeats.filter(id => id.startsWith('GOLD')).length;
  const silverCount = selectedSeats.filter(id => id.startsWith('SILVER')).length;
  const goldPrice = goldCount * 450;
  const silverPrice = silverCount * 250;
  const totalAmount = goldPrice + silverPrice;
  const numberOfTickets = selectedSeats.length;

  const onSubmit = async (data: Omit<BookingFormData, 'tickets' | 'ticketTier'>) => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No Seats Selected",
        description: "Please select at least one seat to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Determine ticket tier based on seat selection
      const ticketTier = goldCount > 0 && silverCount === 0 ? 'gold' : 
                        silverCount > 0 && goldCount === 0 ? 'silver' : 'silver';

      const bookingData: BookingFormData = {
        ...data,
        ticketTier,
        tickets: numberOfTickets.toString(),
      };

      // Add seats info to booking
      const bookingWithSeats = {
        ...bookingData,
        selectedSeats: selectedSeats.map(id => id.replace('GOLD-', '').replace('SILVER-', '')),
        goldSeats: selectedSeats.filter(id => id.startsWith('GOLD')).map(id => id.replace('GOLD-', '')),
        silverSeats: selectedSeats.filter(id => id.startsWith('SILVER')).map(id => id.replace('SILVER-', '')),
        goldCount,
        silverCount,
        totalAmount,
      };

      await BookingService.createBooking(bookingWithSeats, movieTitle, movieId);

      setConfirmedSeats([...selectedSeats]);
      setIsSuccess(true);
      toast({
        title: "Booking Confirmed! 🎬",
        description: `Your booking for ${movieTitle} has been confirmed. Check your email for details.`,
      });
      
      form.reset();
      setSelectedSeats([]);
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

  if (isSuccess) {
    const confirmedGoldSeats = confirmedSeats.filter(id => id.startsWith('GOLD')).map(id => id.replace('GOLD-', ''));
    const confirmedSilverSeats = confirmedSeats.filter(id => id.startsWith('SILVER')).map(id => id.replace('SILVER-', ''));

    return (
      <Card className="max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-divine-white to-background">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-saffron mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-deep-blue mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-4">
            Your booking for <span className="font-semibold text-primary">{movieTitle}</span> has been successfully confirmed.
          </p>
          
          {/* Confirmed Seats Display */}
          <div className="bg-gradient-to-r from-saffron/10 to-primary/10 p-4 rounded-lg border border-saffron/20 mb-4 text-left">
            <h4 className="font-semibold text-deep-blue mb-2">Your Seats:</h4>
            {confirmedGoldSeats.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-xs text-yellow-700 font-medium">Gold:</span>
                {confirmedGoldSeats.map(seat => (
                  <span key={seat} className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                    {seat}
                  </span>
                ))}
              </div>
            )}
            {confirmedSilverSeats.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-blue-700 font-medium">Silver:</span>
                {confirmedSilverSeats.map(seat => (
                  <span key={seat} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {seat}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3 mb-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">💳 Payment Required</h3>
              <p className="text-sm text-yellow-700">
                Please show the confirmation email at the cinema counter to pay and collect your tickets.
              </p>
            </div>
          </div>
          <Button 
            onClick={() => {
              setIsSuccess(false);
              setConfirmedSeats([]);
            }}
            className="bg-gradient-to-r from-deep-blue to-primary hover:from-primary hover:to-deep-blue"
          >
            Book Another Movie
          </Button>
        </CardContent>
      </Card>
    );
  }

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
            {/* Showtime Selection - First */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-deep-blue border-b border-border pb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Select Showtime
              </h3>
              <FormField
                control={form.control}
                name="showtime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-deep-blue font-semibold">
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

            {/* Seat Selection */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-deep-blue border-b border-border pb-2 flex items-center gap-2">
                <Armchair className="w-5 h-5" />
                Select Your Seats
              </h3>
              <SeatSelection
                selectedSeats={selectedSeats}
                onSeatSelect={setSelectedSeats}
                maxSeats={10}
              />
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-deep-blue border-b border-border pb-2 flex items-center gap-2">
                <User className="w-5 h-5" />
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
                    <FormItem className="md:col-span-2">
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
              </div>
            </div>

            {/* Payment Summary */}
            {selectedSeats.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-deep-blue border-b border-border pb-2 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Summary
                </h3>
                <div className="bg-gradient-to-r from-saffron/10 to-primary/10 p-6 rounded-lg border border-saffron/20">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Movie:</span>
                      <span className="font-medium">{movieTitle}</span>
                    </div>
                    {goldCount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Gold Tickets:</span>
                        <span className="font-medium">{goldCount} × ₹450 = ₹{goldPrice}</span>
                      </div>
                    )}
                    {silverCount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Silver Tickets:</span>
                        <span className="font-medium">{silverCount} × ₹250 = ₹{silverPrice}</span>
                      </div>
                    )}
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
            )}

            <Button
              type="submit" 
              className="w-full bg-gradient-to-r from-deep-blue to-primary hover:from-primary hover:to-deep-blue transition-all duration-300 shadow-lg hover:shadow-xl border-0 py-6 text-lg font-semibold"
              disabled={isLoading || selectedSeats.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Booking...
                </>
              ) : selectedSeats.length === 0 ? (
                <>
                  <Armchair className="mr-2 h-5 w-5" />
                  Select Seats to Continue
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
