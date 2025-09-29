import { Card } from '@/app/components/ui';

export function RecentOrdersSkeleton() {
  const fakeRows = Array.from({ length: 5 });

  return (
    <Card>
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-2/5 mb-6"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></th>
                <th scope="col" className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-32"></div></th>
                <th scope="col" className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-12"></div></th>
                <th scope="col" className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24"></div></th>
                <th scope="col" className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16"></div></th>
              </tr>
            </thead>
            <tbody>
              {fakeRows.map((_, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </Card>
  );
}
