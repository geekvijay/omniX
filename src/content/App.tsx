import { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter } from '../components/Modal';
import { List } from '../components/List';
import { Message, Command } from '../types';
import * as c from '../constants';

const actions: Record<string, string> = {
  '/actions': c.COMMANDS_QUERY,
  '/bookmarks': c.BOOKMARKS_QUERY,
  '/history': c.HISTORY_QUERY,
  '/tabs': c.TABS_QUERY,
  '/remove': c.REMOVE_QUERY,
};

const App = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Command[]>([]);
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const actionRef = useRef<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const actionKey = value.length > 1 && Object.keys(actions).find((key) => key.startsWith(value.substring(0, 2)));

    if (actionKey && value.length == 2) {
      actionRef.current = actionKey;
      value = `${actionKey} `;
      dispatch({ type: actions[actionKey] });
    } else if (actionKey == value) {
      actionRef.current = null;
      value = '';
      dispatch({ type: c.DEFAULT_QUERY });
    } else if (actionKey) {
      const payload = value.substring(actionKey.length + 1);
      dispatch({ type: actions[actionKey], payload });
    } else {
      dispatch({ type: c.DEFAULT_QUERY, payload: value });
    }

    setSearch(value);
    setIndex(0);
  };

  const handleSelect = useCallback((item: Command) => {
    setOpen(false);

    if (actionRef.current == '/remove') {
      dispatch({ type: item.type == 'tab' ? c.TABS_REMOVE : c.BOOKMARKS_REMOVE, payload: item.id });
      return;
    }

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
    if (open) {
      dispatch({ type: c.DEFAULT_QUERY });
      inputRef.current?.focus();
    } else {
      setSearch('');
      setIndex(0);
    }
  }, [open]);

  useEffect(() => {
    const handleMessage = (message: Message) => {
      console.log(message);
      switch (message.type) {
        case c.TOGGLE_OMNIX:
          setOpen((prev) => !prev);
          break;
        case c.QUERY_SUCCESS:
          setItems(message.payload);
          break;
        default:
          break;
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  const dispatch = (message: Message) => {
    console.log(message);
    chrome.runtime.sendMessage(message);
  };

  return (
    <div className="omnix-dark omnix-text-left omnix-font-sans omnix-text-[16px] omnix-antialiased">
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
            className="omnix-w-full omnix-bg-transparent omnix-text-lg omnix-outline-none"
            value={search}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            autoFocus
          />
        </ModalHeader>
        <ModalContent>
          <List items={items} index={index} handleSelect={handleSelect} setIndex={setIndex} />
        </ModalContent>
        <ModalFooter>
          <div className="omnix-flex omnix-items-center omnix-justify-between">
            <span className="omnix-text-sm omnix-text-gray-500">{items.length} results</span>
            <div className="omnix-text-sm omnix-text-gray-500">Use arrow keys ↑↓ to navigate</div>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default App;
