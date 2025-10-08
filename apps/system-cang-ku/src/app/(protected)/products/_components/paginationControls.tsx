import { Button, IconButton, Icon } from '@/app/components/ui';

export function PaginationControls() {
  return (
    <div className="mt-6 flex justify-between items-center text-sm">
      <Button variant="ghost" color="secondary" icon={<Icon name="arrowleft" />}>
        Anterior
      </Button>
      <div className="flex items-center gap-2">
        <span className="font-bold p-2">01</span>
        <span className="text-gray-500 p-2">02</span>
        <span className="text-gray-500 p-2">03</span>
        <span className="text-gray-500">...</span>
        <span className="text-gray-500 p-2">20</span>
      </div>
      <Button variant="ghost" color="secondary" icon={<Icon name="arrowright" />} iconButtonPosition="right">
        Siguiente
      </Button>
    </div>
  );
}
