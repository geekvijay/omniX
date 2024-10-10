import React, { useRef, useEffect } from 'react';
import { Item } from '../types';

interface Props {
  items: Item[];
  index: number;
  handleSelect: (item: Item) => void;
  setIndex: (index: number) => void;
}

export const List: React.FC<Props> = ({ items, index, handleSelect, setIndex }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.children[index]?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  return (
    <div ref={listRef}>
      {items.map((item, i) => (
        <div
          key={`${item.type}-${item.id}`}
          className={`omnix-flex omnix-cursor-pointer omnix-items-center omnix-justify-between omnix-gap-2 omnix-border-l-4 omnix-border-solid omnix-p-2 ${index === i ? 'omnix-border-sky-500 omnix-bg-slate-100 dark:omnix-bg-slate-950' : 'omnix-border-transparent'}`}
          onClick={() => handleSelect(item)}
          onMouseMove={() => setIndex(i)}
        >
          <div className="omnix-flex omnix-w-3/4 omnix-flex-col">
            <div className="omnix-truncate">{item.title}</div>
            <div className="omnix-truncate omnix-text-sm omnix-text-gray-500">{item.description}</div>
          </div>
          <div className="omnix-rounded-md omnix-border omnix-border-transparent omnix-bg-slate-100 omnix-px-2.5 omnix-py-0.5 omnix-text-sm omnix-text-slate-600 omnix-shadow-sm omnix-transition-all">
            {item.type}
          </div>
        </div>
      ))}
    </div>
  );
};
