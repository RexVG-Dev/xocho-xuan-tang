import { useState } from 'react';
import { Modal } from '../components/ui/molecules/modal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const options = [
  { label: 'Acepto aviso de privacidad', value: 'privacy', file: '/content/privacy.md' },
  { label: 'Acepto términos y condiciones', value: 'terms', file: '/content/termsAndConditions.md' },
  { label: 'Acepto políticas de envío', value: 'shipping', file: '/content/shippingPolicy.md' },
];

export function ConfirmRadios({ value, onChange }: { value: string[]; onChange: (val: string[]) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleShowModal = async (file: string) => {
    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      const content = await response.text();
      setModalContent(content);
      setModalOpen(true);
    } catch (error) {
      console.error('Error loading modal content:', error);
    }
  };

  const handleToggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className="space-y-2 mb-4">
      {options.map((opt, idx) => (
        <div
          key={opt.value}
          className={`flex items-center gap-2 text-sm font-semibold `}
        >
          <input
            type="checkbox"
            checked={value.includes(opt.value)}
            onChange={e => handleToggle(opt.value)}
            className="accent-red-500 w-4 h-4 cursor-pointer"
          />
          <span
            className="cursor-pointer underline decoration-dotted"
            onClick={() => handleShowModal(opt.file)}
          >
            {opt.label}
          </span>
        </div>
      ))}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} closeButton={true}>
        <div className="p-4 max-h-96 overflow-y-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{modalContent}</ReactMarkdown>
        </div>
      </Modal>
    </div>
  );
}
