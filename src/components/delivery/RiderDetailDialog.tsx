
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bike, 
  PhoneCall, 
  Mail, 
  Star, 
  MapPin, 
  Calendar,
  TrendingUp,
  User
} from 'lucide-react';
import { Rider } from '@/types';
import { format } from 'date-fns';

interface RiderDetailDialogProps {
  rider: Rider;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RiderDetailDialog({ rider, open, onOpenChange }: RiderDetailDialogProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">Available</Badge>;
      case 'busy':
        return <Badge variant="warning">Busy</Badge>;
      case 'offline':
        return <Badge variant="outline">Offline</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Mock delivery history
  const deliveryHistory = [
    {
      id: 'del-1',
      date: new Date(2023, 4, 15),
      address: '123 Main St, Anytown',
      status: 'completed'
    },
    {
      id: 'del-2',
      date: new Date(2023, 4, 14),
      address: '456 Oak Ave, Somewhere',
      status: 'completed'
    },
    {
      id: 'del-3',
      date: new Date(2023, 4, 13),
      address: '789 Pine Rd, Nowhere',
      status: 'completed'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {rider.name}
          </DialogTitle>
          <DialogDescription>
            Rider details and performance metrics
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <PhoneCall className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${rider.phone}`} className="hover:underline">{rider.phone}</a>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${rider.email}`} className="hover:underline">{rider.email}</a>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Vehicle Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Bike className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="capitalize">{rider.vehicleType}</span>
                  </div>
                  {rider.vehicleNumber && (
                    <div className="flex items-center">
                      <span className="w-4 mr-2"></span>
                      <span>Number: {rider.vehicleNumber}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {rider.currentLocation && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Current Location</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        Lat: {rider.currentLocation.latitude.toFixed(6)}, 
                        Long: {rider.currentLocation.longitude.toFixed(6)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        Updated: {format(rider.currentLocation.lastUpdated, 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <div className="space-y-2">
                  <div>{getStatusBadge(rider.status)}</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-amber-500" />
                    <span>{rider.rating.toFixed(1)} out of 5.0</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{rider.totalDeliveries} completed deliveries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Recent Deliveries</h4>
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-3 p-3 bg-muted/30 font-medium text-sm">
                <div>Date</div>
                <div>Location</div>
                <div>Status</div>
              </div>
              
              {deliveryHistory.map(delivery => (
                <div key={delivery.id} className="grid grid-cols-3 p-3 border-t text-sm">
                  <div>{format(delivery.date, 'MMM d, yyyy')}</div>
                  <div className="truncate">{delivery.address}</div>
                  <div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                </div>
              ))}
              
              {deliveryHistory.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No delivery history available
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => window.open(`mailto:${rider.email}`)}
            className="hidden sm:flex"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
