
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Map, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryStatusProps {
  className?: string;
}

export function DeliveryStatus({ className }: DeliveryStatusProps) {
  const deliveries = [
    {
      id: "1",
      order: "#34560",
      customer: "John Smith",
      address: "123 Main St, Anytown",
      rider: {
        name: "Mike Johnson",
        avatar: "",
      },
      status: "in-progress",
      progress: 65,
      estimatedDelivery: "12:45 PM",
    },
    {
      id: "2",
      order: "#34561",
      customer: "Sarah Wilson",
      address: "456 Oak Ave, Somewhere",
      rider: {
        name: "Alex Davis",
        avatar: "",
      },
      status: "assigned",
      progress: 20,
      estimatedDelivery: "1:30 PM",
    },
    {
      id: "3",
      order: "#34558",
      customer: "Emily Brown",
      address: "789 Pine St, Nowhere",
      rider: {
        name: "Chris Taylor",
        avatar: "",
      },
      status: "completed",
      progress: 100,
      estimatedDelivery: "12:15 PM",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-warning/10 text-warning border-warning/30"
          >
            In Progress
          </Badge>
        );
      case "assigned":
        return (
          <Badge
            variant="outline"
            className="bg-info/10 text-info border-info/30"
          >
            Assigned
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-success/10 text-success border-success/30"
          >
            Completed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-muted text-muted-foreground"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Delivery Status</CardTitle>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            <Map className="mr-1 h-3.5 w-3.5" />
            View Map
          </Button>
        </div>
        <CardDescription>Real-time delivery tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="border rounded-lg p-3 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    Order {delivery.order} • {delivery.customer}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {delivery.address}
                  </div>
                </div>
                {getStatusBadge(delivery.status)}
              </div>

              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={delivery.rider.avatar} />
                  <AvatarFallback>
                    {delivery.rider.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xs font-medium">
                    {delivery.rider.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Rider
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Delivery progress</span>
                  <span className="font-medium">
                    {delivery.status === "completed"
                      ? "Delivered"
                      : `ETA ${delivery.estimatedDelivery}`}
                  </span>
                </div>
                <Progress value={delivery.progress} className="h-1.5" />
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              variant="link"
              size="sm"
              className="text-xs"
              asChild
            >
              <a href="/delivery">
                View All Deliveries{" "}
                <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
