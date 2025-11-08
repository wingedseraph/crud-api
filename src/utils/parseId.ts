import { IncomingMessage } from 'node:http';

export const parseId = (request: IncomingMessage) => {
  if (!request) return null;
  const { url } = request;

  const parsed = url && url.match(/\/users\/([^?#]+)/);
  if (parsed) return parsed[1] ?? null;
};
