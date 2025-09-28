import { Card } from '@/app/components/ui';

export function SummarySkeleton() {
  return (
    <Card title="Resumen" className="bg-white">
      <div className="space-y-4 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-3/5"/>
          <div className="h-4 bg-gray-200 rounded w-1/5"/>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-2/5"/>
          <div className="h-4 bg-gray-200 rounded w-1/5"/>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-3/5"/>
          <div className="h-4 bg-gray-200 rounded w-1/4"/>
        </div>
      </div>
    </Card>
  );
}
