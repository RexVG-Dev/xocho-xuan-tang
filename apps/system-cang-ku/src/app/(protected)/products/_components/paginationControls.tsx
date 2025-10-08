import { Button, IconButton, Icon } from '@/app/components/ui';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const generatePageNumbers = (currentPage: number, totalPages: number) => {
  const pages = new Set<number | string>();
  
  // Siempre mostrar la primera página
  pages.add(1);

  // Páginas alrededor de la actual
  if (currentPage > 1) pages.add(currentPage - 1);
  pages.add(currentPage);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  // Siempre mostrar la última página
  if (totalPages > 1) {
    pages.add(totalPages);
  }
  
  const pageArray = Array.from(pages).sort((a,b) => (a as number) - (b as number));
  const finalPages: (number | string)[] = [];

  let lastPage: number | null = null;
  for (const page of pageArray) {
    if (lastPage !== null && (page as number) - lastPage > 1) {
      finalPages.push('...');
    }
    finalPages.push(page);
    lastPage = page as number;
  }
  
  return finalPages;
};

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange
}: PaginationControlsProps ) {
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  // No mostrar nada si solo hay una página o menos
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex justify-between items-center text-sm">
      <Button
        variant="ghost"
        color="secondary"
        icon={<Icon name="arrowleft" />}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Anterior
      </Button>
      <div className="flex items-center gap-2">
        {pageNumbers.map((page, index) =>
          typeof page === 'number' ? (
            <IconButton
              key={`${page}-${index}`}
              variant={currentPage === page ? 'solid' : 'ghost'}
              color={currentPage === page ? 'danger' : 'secondary'}
              onClick={() => onPageChange(page)}
              rounded='md'
              className="h-8 w-8 flex items-center justify-center transition-colors"
            >
              {page}
            </IconButton>
          ) : (
            <span key={`dots-${index}`} className="text-gray-500 p-2">...</span>
          )
        )}
      </div>
      <Button
        variant="ghost"
        color="secondary"
        icon={<Icon name="arrowright" />}
        iconButtonPosition="right"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </Button>
    </div>
  );
}
