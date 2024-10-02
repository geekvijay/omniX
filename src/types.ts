export type Message = {
  type: string;
  payload?: any;
};

export type Command = {
  title: string;
  description: string;
  message: Message;
};
