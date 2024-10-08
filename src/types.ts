import { MESSAGE_TYPE } from './constants';

export type MessageType = keyof typeof MESSAGE_TYPE;

export type Message = {
  type: MessageType;
  payload?: any;
};

export type Command = {
  id: number;
  type: string;
  title: string;
  description: string;
  message: Message;
};
