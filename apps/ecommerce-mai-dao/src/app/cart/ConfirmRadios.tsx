import { useState } from 'react';

import { Modal } from '../components/ui/molecules/modal';

const options = [
  { label: 'Acepto aviso de privacidad', value: 'privacy', modalText: 'Lorem aviso de privacidad.' },
  { label: 'Acepto términos y condiciones', value: 'terms', modalText: 'Lorem términos y condiciones.' },
  { label: 'Acepto políticas de envío', value: 'shipping', modalText: 'Lorem políticas de envío.' },
];

export function ConfirmRadios({ value, onChange }: { value: string[]; onChange: (val: string[]) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleShowModal = (text: string) => {
    setModalContent(text);
    setModalOpen(true);
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
            onClick={() => handleShowModal(opt.modalText)}
          >
            {opt.label}
          </span>
        </div>
      ))}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Información" closeButton={true}>
        <div className="p-4">
          {modalContent}
        </div>
      </Modal>
    </div>
  );
}
