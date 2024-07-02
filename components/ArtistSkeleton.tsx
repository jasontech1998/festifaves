import { Skeleton } from "@/components/ui/skeleton";

export const ArtistSkeleton = () => (
  <div className="flex items-center p-2 bg-accent rounded-lg overflow-hidden">
    <div className="w-12 h-12 rounded-full mr-3 relative overflow-hidden shimmer-wrapper">
      <Skeleton className="w-full h-full rounded-full" />
    </div>
    <div className="flex-1">
      <div className="h-4 w-3/4 mb-2 relative overflow-hidden shimmer-wrapper">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="h-3 w-1/2 relative overflow-hidden shimmer-wrapper">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  </div>
);
