import { type IncomingMessage, type ServerResponse } from 'http';

export const post = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  const { method, url } = req;

  res.end(`:: POST :: method: ${method}, url: ${url}`);
};
