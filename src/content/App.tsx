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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
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
      case 'Escape':
        setOpen(false);
        break;
      default:
        break;
    }
  };

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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          inputRef.current?.focus();
          e.stopPropagation();
        }}
      >
        <ModalHeader>
          <input
            type="text"
            placeholder="Search"
            className="omnix-w-full omnix-bg-transparent omnix-outline-none"
            value={search}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            autoFocus
          />
        </ModalHeader>
        <ModalContent>
          <div ref={listRef}>
            {items.map((item, i) => (
              <div
                key={`${item.type}-${item.id}`}
                className={`omnix-flex omnix-cursor-pointer omnix-items-center omnix-justify-between omnix-gap-2 omnix-border-l-4 omnix-border-solid omnix-p-2 ${index === i ? 'omnix-border-blue-500' : 'omnix-border-transparent'}`}
                onClick={() => handleSelect(item)}
              >
                <div className="omnix-flex omnix-flex-col">
                  <div>{item.title}</div>
                  <div className="omnix-text-sm omnix-text-gray-500">{item.description}</div>
                </div>
                <div className="omnix-rounded-md omnix-border omnix-border-transparent omnix-bg-slate-100 omnix-px-2.5 omnix-py-0.5 omnix-text-sm omnix-text-slate-600 omnix-shadow-sm omnix-transition-all">
                  {item.type}
                </div>
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
