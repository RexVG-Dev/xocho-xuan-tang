import { Card } from '@/app/components/ui';

export function LowProductsStockSkeleton() {
  return (
    <Card title="Productos con bajo stock" className="bg-white">
      <div className="animate-pulse">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-3 bg-gray-200 rounded w-2/5"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-3 bg-gray-200 rounded w-2/5"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-3 bg-gray-200 rounded w-2/5"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </Card>
  );
}
