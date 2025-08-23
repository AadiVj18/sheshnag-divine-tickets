import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  Ticket, 
  Crown, 
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { BookingService } from "@/services/bookingService";
import { BookingData } from "@/types/booking";
import { TICKET_TIERS } from "@/config/ticketTiers";

export const AdminPanel = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'paid' | 'cancelled'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    setLoading(true);
    const allBookings = BookingService.getAllBookings();
    setBookings(allBookings);
    setLoading(false);
  };

  const updateBookingStatus = (bookingId: string, newStatus: BookingData['status']) => {
    const success = BookingService.updateBookingStatus(bookingId, newStatus);
    if (success) {
      loadBookings();
      toast({
        title: "Status Updated",
        description: `Booking status updated to ${newStatus}`,
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: BookingData['status']) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500', icon: AlertCircle },
      confirmed: { color: 'bg-blue-500', icon: CheckCircle },
      paid: { color: 'bg-green-500', icon: CheckCircle },
      cancelled: { color: 'bg-red-500', icon: XCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTicketTierIcon = (tier: 'silver' | 'gold') => {
    return tier === 'gold' ? (
      <Crown className="w-4 h-4 text-yellow-500" />
    ) : (
      <Star className="w-4 h-4 text-gray-500" />
    );
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' ? true : booking.status === filter
  );

  const totalRevenue = bookings
    .filter(booking => booking.status === 'paid')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-primary mr-2" />
        <span>Loading bookings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-deep-blue">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage all bookings and track revenue</p>
        </div>
        <Button onClick={loadBookings} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold text-deep-blue">{bookings.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingBookings}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid Bookings</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'paid').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-saffron">₹{totalRevenue}</p>
              </div>
              <Ticket className="w-8 h-8 text-saffron" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-deep-blue">Filter by status:</span>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-deep-blue mb-2">No Bookings Found</h3>
              <p className="text-muted-foreground">
                {filter === 'all' ? 'No bookings have been made yet.' : `No ${filter} bookings found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-deep-blue">{booking.movieTitle}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Booking ID: {booking.id}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{booking.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{booking.customerEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{booking.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-saffron mb-1">₹{booking.totalAmount}</div>
                    <div className="flex items-center gap-1 justify-end mb-2">
                      {getTicketTierIcon(booking.ticketTier)}
                      <span className="text-sm text-muted-foreground">
                        {booking.numberOfTickets} {TICKET_TIERS[booking.ticketTier].name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{booking.showtime}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <span className="text-sm font-medium text-deep-blue">Update Status:</span>
                  <Select 
                    value={booking.status} 
                    onValueChange={(value: BookingData['status']) => updateBookingStatus(booking.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
