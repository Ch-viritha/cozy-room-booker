import { BookingResult as BookingResultType } from "@/types/hotel";
import { CheckCircle2, XCircle, Clock, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingResultProps {
  result: BookingResultType | null;
}

export function BookingResult({ result }: BookingResultProps) {
  if (!result) {
    return (
      <div className="bg-card rounded-xl border shadow-sm p-4">
        <h2 className="font-semibold text-lg mb-2">Booking Result</h2>
        <p className="text-muted-foreground text-sm">
          No booking made yet. Enter the number of rooms and click "Book Rooms".
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border shadow-sm p-4">
      <h2 className="font-semibold text-lg mb-3">Booking Result</h2>
      
      <div
        className={cn(
          "flex items-start gap-3 p-3 rounded-lg",
          result.success ? "bg-[hsl(var(--success-muted))]" : "bg-[hsl(var(--error-muted))]"
        )}
      >
        {result.success ? (
          <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] mt-0.5 shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-[hsl(var(--error))] mt-0.5 shrink-0" />
        )}
        
        <div className="space-y-2 flex-1">
          <p className={cn(
            "font-medium",
            result.success ? "text-[hsl(var(--success))]" : "text-[hsl(var(--error))]"
          )}>
            {result.message}
          </p>
          
          {result.success && result.rooms.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  Rooms: <strong>{result.rooms.join(", ")}</strong>
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  Total Travel Time: <strong>{result.travelTime} minute(s)</strong>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
