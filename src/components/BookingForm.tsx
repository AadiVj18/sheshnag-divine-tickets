import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, User, Mail, Phone, Ticket, Clock } from "lucide-react";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  tickets: z.string().min(1, "Please select number of tickets"),
  showtime: z.string().min(1, "Please select a showtime"),
});

const WEBHOOK_URL = "https://aadivijay18.app.n8n.cloud/webhook/booking-response";

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  movieTitle: string;
  showtimes: string[];
}

export const BookingForm = ({ movieTitle, showtimes }: BookingFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      tickets: "",
      showtime: "",
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    
    try {
      const bookingData = {
        ...data,
        movie: movieTitle,
        bookingId: `SHESH-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      // Send booking data to the webhook
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(bookingData),
      });

      setIsSuccess(true);
      toast({
        title: "Booking Confirmed! 🎬",
        description: `Your booking for ${movieTitle} has been confirmed. Check your email for details.`,
      });
      
      form.reset();
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
    return (
      <Card className="max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-divine-white to-background">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-saffron mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-deep-blue mb-2">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            Your booking for <span className="font-semibold text-primary">{movieTitle}</span> has been successfully confirmed. 
            You will receive a confirmation email shortly.
          </p>
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

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-gradient-to-br from-divine-white to-background">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                'Confirm Booking'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};