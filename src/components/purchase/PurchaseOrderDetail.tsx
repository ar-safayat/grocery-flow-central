
import { useState } from 'react';
import {
  ClipboardList,
  Calendar,
  Store,
  CheckCircle2,
  Clock,
  FileText,
  Printer,
  Download,
  MessageSquare,
  Truck,
  Edit,
  X,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { PurchaseOrder, PurchaseOrderStatus } from '@/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface PurchaseOrderDetailProps {
  purchaseOrder: PurchaseOrder;
  onStatusChange?: (status: PurchaseOrderStatus) => void;
}

export function PurchaseOrderDetail({ purchaseOrder, onStatusChange }: PurchaseOrderDetailProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [note, setNote] = useState('');
  const { toast } = useToast();

  const getStatusColor = (status: PurchaseOrderStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-muted text-muted-foreground';
      case 'sent':
        return 'bg-blue-100 text-blue-700';
      case 'confirmed':
        return 'bg-purple-100 text-purple-700';
      case 'partial':
        return 'bg-amber-100 text-amber-700';
      case 'received':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const updateStatus = (newStatus: PurchaseOrderStatus) => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      onStatusChange?.(newStatus);
      setIsUpdating(false);
      
      toast({
        title: "Status Updated",
        description: `Purchase order status changed to ${newStatus}.`,
      });
    }, 800);
  };

  const sendNote = () => {
    if (!note.trim()) return;
    
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      setShowDialog(false);
      setNote('');
      
      toast({
        title: "Note Sent",
        description: "Your note has been sent to the vendor.",
      });
    }, 800);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Purchase Order #{purchaseOrder.poNumber}</h2>
            <p className="text-muted-foreground">
              Created on {format(purchaseOrder.createdAt, 'PPP')}
            </p>
          </div>
        </div>
        
        <Badge className={getStatusColor(purchaseOrder.status)}>
          {purchaseOrder.status.toUpperCase()}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-2">
              <Store className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">{purchaseOrder.vendor.name}</div>
                <div className="text-sm text-muted-foreground">{purchaseOrder.vendor.contactPerson}</div>
                <div className="text-sm text-muted-foreground">{purchaseOrder.vendor.email}</div>
                <div className="text-sm text-muted-foreground">{purchaseOrder.vendor.phone}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivery Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                {purchaseOrder.deliveryDate ? (
                  <span>Expected on {format(purchaseOrder.deliveryDate, 'PPP')}</span>
                ) : (
                  <span className="text-muted-foreground">No delivery date set</span>
                )}
              </div>
            </div>
            
            {purchaseOrder.status === 'confirmed' && (
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <div>Vendor confirmed delivery</div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items:</span>
                <span>{purchaseOrder.items.length}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${purchaseOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>
            Details of items in this purchase order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-8 p-3 bg-muted/50 font-medium">
              <div className="col-span-3">Product</div>
              <div className="col-span-1 text-center">Quantity</div>
              <div className="col-span-1 text-center">Received</div>
              <div className="col-span-1 text-right">Unit Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            <Separator />
            {purchaseOrder.items.map((item, index) => (
              <div key={item.id}>
                <div className="grid grid-cols-8 p-3">
                  <div className="col-span-3">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-xs text-muted-foreground">{item.productId}</div>
                  </div>
                  <div className="col-span-1 text-center">{item.quantity}</div>
                  <div className="col-span-1 text-center">
                    {item.receivedQuantity}
                    {item.receivedQuantity < item.quantity && (
                      <Badge variant="outline" className="ml-2">Partial</Badge>
                    )}
                  </div>
                  <div className="col-span-1 text-right">${item.unitPrice.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-medium">${item.total.toFixed(2)}</div>
                </div>
                {index < purchaseOrder.items.length - 1 && <Separator />}
              </div>
            ))}
            <Separator />
            <div className="grid grid-cols-8 p-3 bg-muted/20">
              <div className="col-span-5 md:col-span-6 font-medium">Total</div>
              <div className="col-span-3 md:col-span-2 text-right font-medium">${purchaseOrder.total.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {purchaseOrder.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{purchaseOrder.notes}</p>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-wrap gap-3 justify-between">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            View as PDF
          </Button>
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Note to Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Send Note to Vendor</DialogTitle>
                <DialogDescription>
                  This note will be emailed to {purchaseOrder.vendor.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea
                  placeholder="Enter your message to the vendor..."
                  className="min-h-[150px]"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={sendNote}
                  disabled={isUpdating || !note.trim()}
                >
                  {isUpdating ? "Sending..." : "Send Note"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {purchaseOrder.status === 'draft' && (
            <>
              <Button
                variant="default"
                onClick={() => updateStatus('sent')}
                disabled={isUpdating}
              >
                <Clock className="h-4 w-4 mr-2" />
                Send to Vendor
              </Button>
              <Button
                variant="outline"
                disabled={isUpdating}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </>
          )}
          
          {purchaseOrder.status === 'sent' && (
            <>
              <Button
                variant="default"
                onClick={() => updateStatus('confirmed')}
                disabled={isUpdating}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Confirmed
              </Button>
              <Button
                variant="destructive"
                onClick={() => updateStatus('cancelled')}
                disabled={isUpdating}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel Order
              </Button>
            </>
          )}
          
          {purchaseOrder.status === 'confirmed' && (
            <Button
              variant="default"
              onClick={() => updateStatus('received')}
              disabled={isUpdating}
            >
              <Truck className="h-4 w-4 mr-2" />
              Mark as Received
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
