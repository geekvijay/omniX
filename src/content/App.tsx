import { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter } from '../components/Modal';
import { Message, Command } from '../types';
import * as c from '../constants';

const App = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Command[]>([]);
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: c.DEFAULT_QUERY, payload: e.target.value });
    setSearch(e.target.value);
    setIndex(0);
  };

  const handleSelect = useCallback((item: Command) => {
    setOpen(false);
    switch (item.message.type) {
      case c.BROWSER_FULLSCREEN:
        document.documentElement.requestFullscreen();
        break;
      case c.BROWSER_PRINT:
        setTimeout(() => window.print(), 100);
        break;
      case c.BROWSER_SCROLL_TO_BOTTOM:
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        break;
      case c.BROWSER_SCROLL_TO_TOP:
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      default:
        dispatch(item.message);
        break;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          setIndex((prevIndex) => (prevIndex >= items.length - 1 ? prevIndex : prevIndex + 1));
          break;
        case 'ArrowUp':
          setIndex((prevIndex) => (prevIndex <= 0 ? prevIndex : prevIndex - 1));
          break;
        case 'Enter':
          handleSelect(items[index]);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, items, handleSelect]);

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
      dispatch({ type: c.DEFAULT_QUERY });
      setSearch('');
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleMessage = (message: Message) => {
      console.log(message);
      switch (message.type) {
        case c.TOGGLE_OMNIX:
          setOpen((prev) => !prev);
          break;
        case c.DEFAULT_QUERY_SUCCESS:
          setItems(message.payload);
          break;
        default:
          break;
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  const dispatch = (message: Message) => chrome.runtime.sendMessage(message);

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
            {items.map((item, i) => (
              <div
                className={`omnix-p-2 ${index === i ? 'omnix-bg-blue-500' : 'omnix-bg-white'}`}
                onClick={() => handleSelect(item)}
              >
                {item.title}
              </div>
            ))}
          </div>
        </ModalContent>
        <ModalFooter>
          <div className="omnix-flex omnix-items-center omnix-justify-between">
            <span className="omnix-text-sm omnix-text-gray-500">{items.length} results</span>
            <div className="omnix-text-sm omnix-text-gray-500">Use arrow keys ↑↓ to navigate</div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default App;
