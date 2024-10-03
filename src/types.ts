export type Message = {
  type: string;
  payload?: any;
};

export type Command = {
  id: number;
  type: string;
  title: string;
  description: string;
  message: Message;
};
