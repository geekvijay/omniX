import { MESSAGE_TYPE } from './constants';

export type MessageType = keyof typeof MESSAGE_TYPE;

export type Message = {
  type: MessageType;
  payload?: any;
};

export type Command = {
  id: number;
  type: 'command';
  title: string;
  description: string;
  message: Message;
};

export type Tab = chrome.tabs.Tab & { message: Message; type: 'tab'; description: string };
export type Bookmark = chrome.bookmarks.BookmarkTreeNode & { message: Message; type: 'bookmark'; description: string };
export type History = chrome.history.HistoryItem & { message: Message; type: 'history'; description: string };
export type Item = Command | Tab | Bookmark | History;
