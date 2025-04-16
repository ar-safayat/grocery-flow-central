
import { useState } from 'react';
import {
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  UserRound,
  Bike,
  Phone,
  Mail,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Rider, RiderStatus } from '@/types';
import { RiderDetailDialog } from '@/components/delivery/RiderDetailDialog';

const mockRiders: Rider[] = Array(10).fill(null).map((_, index) => ({
  id: `r-${1000 + index}`,
  name: [
    'Alex Johnson',
    'Maria Garcia',
    'David Lee',
    'Sarah Williams',
    'Michael Brown',
    'Emma Wilson',
    'James Taylor',
    'Olivia Davies',
    'Daniel Martinez',
    'Sophia Anderson',
  ][index],
  phone: `(555) ${100 + index}-${4000 + index}`,
  email: `rider${index + 1}@example.com`,
  vehicleType: index % 3 === 0 ? 'car' : index % 3 === 1 ? 'motorcycle' : 'bicycle',
  vehicleNumber: index % 3 === 0 ? `CAR-${1000 + index}` : index % 3 === 1 ? `MC-${2000 + index}` : undefined,
  currentLocation: index % 4 !== 0 ? {
    latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
    longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
    lastUpdated: new Date(),
  } : undefined,
  status: ['available', 'busy', 'offline'][index % 3] as RiderStatus,
  rating: Math.floor(Math.random() * 2) + 3 + Math.random(),
  totalDeliveries: Math.floor(Math.random() * 500) + 10,
}));

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>(mockRiders);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddRiderDialogOpen, setIsAddRiderDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newRider, setNewRider] = useState<Partial<Rider>>({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'motorcycle',
    vehicleNumber: '',
    status: 'offline',
    rating: 5.0,
    totalDeliveries: 0,
  });
  const { toast } = useToast();

  const filteredRiders = riders.filter(rider => 
    rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rider.phone.includes(searchQuery) ||
    rider.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRider = () => {
    if (!newRider.name || !newRider.phone || !newRider.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const rider: Rider = {
      id: `r-${1000 + riders.length}`,
      name: newRider.name,
      phone: newRider.phone,
      email: newRider.email,
      vehicleType: newRider.vehicleType || 'motorcycle',
      vehicleNumber: newRider.vehicleNumber,
      status: 'offline',
      rating: 5.0,
      totalDeliveries: 0,
    };
    
    setRiders([...riders, rider]);
    setNewRider({
      name: '',
      phone: '',
      email: '',
      vehicleType: 'motorcycle',
      vehicleNumber: '',
      status: 'offline',
      rating: 5.0,
      totalDeliveries: 0,
    });
    setIsAddRiderDialogOpen(false);
    
    toast({
      title: "Rider Added",
      description: `${rider.name} has been added to the system.`,
    });
  };

  const handleStatusChange = (riderId: string, status: RiderStatus) => {
    const updatedRiders = riders.map(rider => {
      if (rider.id === riderId) {
        return { ...rider, status };
      }
      return rider;
    });
    setRiders(updatedRiders);
    
    toast({
      title: "Rider Status Updated",
      description: `Rider status has been changed to ${status}.`,
    });
  };

  const viewRiderDetails = (rider: Rider) => {
    setSelectedRider(rider);
    setIsDetailDialogOpen(true);
  };

  const getStatusBadge = (status: RiderStatus) => {
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

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car':
        return <span className="bg-blue-100 text-blue-800 p-1 rounded-full"><Bike className="h-4 w-4" /></span>;
      case 'motorcycle':
        return <span className="bg-amber-100 text-amber-800 p-1 rounded-full"><Bike className="h-4 w-4" /></span>;
      case 'bicycle':
        return <span className="bg-green-100 text-green-800 p-1 rounded-full"><Bike className="h-4 w-4" /></span>;
      default:
        return <Bike className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Riders</h1>
          <p className="text-muted-foreground">
            Manage delivery riders and view their performance
          </p>
        </div>
        <Button onClick={() => setIsAddRiderDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rider
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search by name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRiders.map((rider) => (
          <Card key={rider.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <UserRound className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{rider.name}</CardTitle>
                    <CardDescription>
                      {getVehicleIcon(rider.vehicleType)}{' '}
                      <span className="ml-1 capitalize">{rider.vehicleType}</span>
                      {rider.vehicleNumber && ` • ${rider.vehicleNumber}`}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => viewRiderDetails(rider)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStatusChange(rider.id, 'available')}>
                      Set as Available
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(rider.id, 'busy')}>
                      Set as Busy
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(rider.id, 'offline')}>
                      Set as Offline
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid gap-2 text-sm">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>{rider.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>{rider.email}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-amber-500 mr-2" />
                  <span>{rider.rating.toFixed(1)}/5.0 • {rider.totalDeliveries} deliveries</span>
                </div>
                <div className="flex items-center mt-2">
                  <div className="mr-2">Status:</div>
                  {getStatusBadge(rider.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredRiders.length === 0 && (
        <div className="text-center py-10">
          <UserRound className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No riders found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or add a new rider.
          </p>
        </div>
      )}

      <Dialog open={isAddRiderDialogOpen} onOpenChange={setIsAddRiderDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Rider</DialogTitle>
            <DialogDescription>
              Add a new delivery rider to the system. Fill in all required information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rider-name" className="text-right">
                Full Name*
              </Label>
              <Input
                id="rider-name"
                value={newRider.name}
                onChange={(e) => setNewRider({ ...newRider, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rider-phone" className="text-right">
                Phone*
              </Label>
              <Input
                id="rider-phone"
                value={newRider.phone}
                onChange={(e) => setNewRider({ ...newRider, phone: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rider-email" className="text-right">
                Email*
              </Label>
              <Input
                id="rider-email"
                type="email"
                value={newRider.email}
                onChange={(e) => setNewRider({ ...newRider, email: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle-type" className="text-right">
                Vehicle Type
              </Label>
              <Select 
                value={newRider.vehicleType} 
                onValueChange={(value) => setNewRider({ ...newRider, vehicleType: value })}
              >
                <SelectTrigger className="col-span-3" id="vehicle-type">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="bicycle">Bicycle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle-number" className="text-right">
                Vehicle Number
              </Label>
              <Input
                id="vehicle-number"
                value={newRider.vehicleNumber || ''}
                onChange={(e) => setNewRider({ ...newRider, vehicleNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRiderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRider}>Add Rider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedRider && (
        <RiderDetailDialog 
          rider={selectedRider}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
        />
      )}
    </div>
  );
}
