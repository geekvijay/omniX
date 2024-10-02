import { useState, useEffect, useRef } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter } from '../components/Modal';
import { Action } from '../types';
import { TOGGLE_OMNIX } from '../constants';

interface Item {
  id: number;
  name: string;
}

const initialItems: Item[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' },
  { id: 6, name: 'Item 6' },
  { id: 7, name: 'Item 7' },
  { id: 8, name: 'Item 8' },
  { id: 9, name: 'Item 9' },
  { id: 10, name: 'Item 10' },
  { id: 11, name: 'Item 11' },
  { id: 12, name: 'Item 12' },
  { id: 13, name: 'Item 13' },
  { id: 14, name: 'Item 14' },
  { id: 15, name: 'Item 15' },
  { id: 16, name: 'Item 16' },
  { id: 17, name: 'Item 17' },
  { id: 18, name: 'Item 18' },
  { id: 19, name: 'Item 19' },
];

const App = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Item[]>(initialItems);
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  let filteredItems = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  filteredItems = search ? [{ id: 0, name: search }, ...filteredItems] : filteredItems;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setIndex((prevIndex) => (prevIndex >= filteredItems.length - 1 ? prevIndex : prevIndex + 1));
      } else if (e.key === 'ArrowUp') {
        setIndex((prevIndex) => (prevIndex <= 0 ? prevIndex : prevIndex - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, filteredItems]);

  useEffect(() => {
    if (listRef.current) {
      const selectedItem = listRef.current.children[index];
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [index]);

  useEffect(() => {
    if (open) {
      setSearch('');
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleMessage = (message: Action) => {
      switch (message.type) {
        case TOGGLE_OMNIX:
          setOpen((prev) => !prev);
          break;
        default:
          break;
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalHeader>
          <input
            type="text"
            placeholder="Search"
            className="omnix-w-full omnix-bg-transparent omnix-outline-none"
            value={search}
            onChange={handleChange}
            ref={inputRef}
            autoFocus
          />
        </ModalHeader>
        <ModalContent>
          <div ref={listRef}>
            {filteredItems.map((item, i) => (
              <div
                key={item.id}
                data-index={i}
                className={`omnix-p-2 ${index === i ? 'omnix-bg-blue-500' : 'omnix-bg-white'}`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </ModalContent>
        <ModalFooter>
          <div className="omnix-flex omnix-items-center omnix-justify-between">
            <span className="omnix-text-sm omnix-text-gray-500">{filteredItems.length} results</span>
            <div className="omnix-text-sm omnix-text-gray-500">Use arrow keys ↑↓ to navigate</div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default App;
