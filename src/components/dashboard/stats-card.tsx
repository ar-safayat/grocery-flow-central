
import { ReactNode } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
  className,
}: StatsCardProps) {
  const isTrendPositive = trend && trend > 0;
  const isTrendNegative = trend && trend < 0;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="w-4 h-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
      {(trend || trendLabel) && (
        <CardFooter className="px-4 py-3 border-t bg-muted/50">
          <div className="flex items-center text-xs">
            {trend !== undefined && (
              <span
                className={cn(
                  "mr-1 rounded-full px-1",
                  isTrendPositive && "bg-success/20 text-success",
                  isTrendNegative && "bg-danger/20 text-danger",
                  !isTrendPositive && !isTrendNegative && "bg-muted-foreground/20 text-muted-foreground"
                )}
              >
                {isTrendPositive && "+"}
                {trend}%
              </span>
            )}
            <span className="text-muted-foreground">
              {trendLabel || "from previous period"}
            </span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
