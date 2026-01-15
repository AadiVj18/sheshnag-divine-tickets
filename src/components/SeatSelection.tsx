import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Seat {
  id: string;
  row: string;
  number: number;
  tier: 'gold' | 'silver';
  isBooked: boolean;
}

interface SeatSelectionProps {
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
  maxSeats?: number;
}

// Generate seats for Gold (Balcony) - 27 seats (3 rows x 9 seats)
const generateGoldSeats = (): Seat[] => {
  const rows = ['A', 'B', 'C'];
  const seatsPerRow = 9;
  const seats: Seat[] = [];
  
  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        id: `GOLD-${row}${i}`,
        row,
        number: i,
        tier: 'gold',
        isBooked: Math.random() < 0.2, // 20% randomly booked for demo
      });
    }
  });
  
  return seats;
};

// Generate seats for Silver (Normal) - 155 seats (10 rows with varying seats)
const generateSilverSeats = (): Seat[] => {
  const rows = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  const seatsPerRow = [15, 15, 16, 16, 16, 16, 16, 15, 15, 15]; // Total: 155
  const seats: Seat[] = [];
  
  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= seatsPerRow[rowIndex]; i++) {
      seats.push({
        id: `SILVER-${row}${i}`,
        row,
        number: i,
        tier: 'silver',
        isBooked: Math.random() < 0.25, // 25% randomly booked for demo
      });
    }
  });
  
  return seats;
};

export const SeatSelection = ({ selectedSeats, onSeatSelect, maxSeats = 10 }: SeatSelectionProps) => {
  const [goldSeats] = useState<Seat[]>(generateGoldSeats);
  const [silverSeats] = useState<Seat[]>(generateSilverSeats);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) return;
    
    const isSelected = selectedSeats.includes(seat.id);
    
    if (isSelected) {
      onSeatSelect(selectedSeats.filter(id => id !== seat.id));
    } else {
      if (selectedSeats.length >= maxSeats) {
        return; // Max seats reached
      }
      onSeatSelect([...selectedSeats, seat.id]);
    }
  };

  const getSeatClass = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.id);
    
    if (seat.isBooked) {
      return "bg-gray-400 cursor-not-allowed opacity-50";
    }
    
    if (isSelected) {
      return seat.tier === 'gold' 
        ? "bg-yellow-500 text-white ring-2 ring-yellow-300 scale-110" 
        : "bg-blue-500 text-white ring-2 ring-blue-300 scale-110";
    }
    
    return seat.tier === 'gold'
      ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 cursor-pointer"
      : "bg-blue-100 hover:bg-blue-200 text-blue-800 cursor-pointer";
  };

  const goldCount = selectedSeats.filter(id => id.startsWith('GOLD')).length;
  const silverCount = selectedSeats.filter(id => id.startsWith('SILVER')).length;

  const goldPrice = goldCount * 450;
  const silverPrice = silverCount * 250;
  const totalPrice = goldPrice + silverPrice;

  const groupSeatsByRow = (seats: Seat[]) => {
    return seats.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {} as Record<string, Seat[]>);
  };

  const goldRows = groupSeatsByRow(goldSeats);
  const silverRows = groupSeatsByRow(silverSeats);

  return (
    <div className="space-y-6">
      {/* Screen */}
      <div className="relative">
        <div className="w-full h-8 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-full flex items-center justify-center text-gray-600 font-medium text-sm shadow-lg">
          SCREEN
        </div>
        <div className="w-full h-2 bg-gradient-to-b from-gray-400 to-transparent" />
      </div>

      {/* Gold Section (Balcony) */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 rounded-lg border border-yellow-200">
          <span className="text-yellow-700 font-bold text-sm uppercase tracking-wide">
            ✨ Gold Balcony - ₹450
          </span>
        </div>
        
        <div className="space-y-2 px-4">
          {Object.entries(goldRows).map(([row, seats]) => (
            <div key={row} className="flex items-center justify-center gap-1">
              <span className="w-6 text-center text-xs font-bold text-yellow-700">{row}</span>
              <div className="flex gap-1 flex-wrap justify-center">
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isBooked}
                    className={cn(
                      "w-7 h-7 rounded-t-lg text-xs font-medium transition-all duration-200 flex items-center justify-center",
                      getSeatClass(seat)
                    )}
                    title={seat.isBooked ? 'Booked' : `${seat.row}${seat.number} - ₹450`}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
              <span className="w-6 text-center text-xs font-bold text-yellow-700">{row}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Aisle */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Aisle</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Silver Section (Normal) */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 rounded-lg border border-blue-200">
          <span className="text-blue-700 font-bold text-sm uppercase tracking-wide">
            🎬 Silver Standard - ₹250
          </span>
        </div>
        
        <div className="space-y-2 px-2 overflow-x-auto">
          {Object.entries(silverRows).map(([row, seats]) => (
            <div key={row} className="flex items-center justify-center gap-1">
              <span className="w-6 text-center text-xs font-bold text-blue-700">{row}</span>
              <div className="flex gap-0.5 flex-wrap justify-center">
                {seats.map((seat, index) => (
                  <>
                    {index === Math.floor(seats.length / 2) && (
                      <div key={`aisle-${row}`} className="w-4" />
                    )}
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.isBooked}
                      className={cn(
                        "w-6 h-6 rounded-t-md text-[10px] font-medium transition-all duration-200 flex items-center justify-center",
                        getSeatClass(seat)
                      )}
                      title={seat.isBooked ? 'Booked' : `${seat.row}${seat.number} - ₹250`}
                    >
                      {seat.number}
                    </button>
                  </>
                ))}
              </div>
              <span className="w-6 text-center text-xs font-bold text-blue-700">{row}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-yellow-100 border border-yellow-200" />
          <span className="text-xs text-muted-foreground">Gold Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-blue-100 border border-blue-200" />
          <span className="text-xs text-muted-foreground">Silver Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-yellow-500" />
          <span className="text-xs text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-t-md bg-gray-400 opacity-50" />
          <span className="text-xs text-muted-foreground">Booked</span>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <div className="bg-gradient-to-r from-saffron/10 to-primary/10 p-4 rounded-lg border border-saffron/20">
          <h4 className="font-semibold text-deep-blue mb-3">Selected Seats</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSeats.map(seatId => {
              const isGold = seatId.startsWith('GOLD');
              const seatLabel = seatId.replace('GOLD-', '').replace('SILVER-', '');
              return (
                <span
                  key={seatId}
                  className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    isGold ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"
                  )}
                >
                  {seatLabel} ({isGold ? 'Gold' : 'Silver'})
                </span>
              );
            })}
          </div>
          <div className="space-y-1 text-sm">
            {goldCount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gold × {goldCount}</span>
                <span className="font-medium">₹{goldPrice}</span>
              </div>
            )}
            {silverCount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Silver × {silverCount}</span>
                <span className="font-medium">₹{silverPrice}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-border/50">
              <span className="font-semibold text-deep-blue">Total</span>
              <span className="font-bold text-saffron text-lg">₹{totalPrice}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
