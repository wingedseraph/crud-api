import { type IncomingMessage, type ServerResponse } from 'node:http';

import { routes } from 'src/handler/handler';

// function route(path, res, handlerObj, payload) {
export const route = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  // console.log(`Routing request for '${path}'`);
  const { method, url } = req;
  console.log(`method: ${method}, url: ${url} ${res.headersSent}`);

  console.log(routes[method]);

  // res.end(`method: ${method}, url: ${url}`);

  // console.log(path, method)
  // const routeFound = typeof handlerObj[path] == 'function' && handlerObj.hasOwnProperty(path);
  //
  // return routeFound ? handlerObj[path](res, payload) : failed(path, res);
};
