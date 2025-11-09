import cluster from 'node:cluster';
import { styleText } from 'node:util';
import { users } from '../db';
import { styledWorker } from '../server/workerServer';
import { StoreChange } from './clusterManager';

const styledUser = styleText('yellowBright', 'User');
let isSyncingFromIPC = false;

export const setupWorkerHandler = () => {
  process.on('message', (message) => {
    const msg = message as StoreChange;
    if (msg.cmd === 'STORE_CHANGE') {
      isSyncingFromIPC = true;

      try {
        switch (msg.action) {
          case 'ADD_USER':
            users.dispatch({
              type: 'ADD_USER_WITH_ID',
              user: msg.user,
            });
            console.log(
              `[${styledWorker} ${cluster.worker!.id}] ${msg.action} store synchronized: ${styledUser} added with ID ${msg.user?.id}`,
            );
            break;

          case 'UPDATE_USER':
            users.dispatch({
              type: 'UPDATE_USER',
              id: msg.id,
              user: msg.user,
            });
            console.log(
              `[${styledWorker} ${cluster.worker!.id}] ${msg.action} store synchronized: ${styledUser} updated with ID ${msg.id}`,
            );
            break;

          case 'DELETE_USER':
            users.dispatch({
              type: 'DELETE_USER',
              id: msg.id,
            });
            console.log(
              `[${styledWorker} ${cluster.worker!.id}] ${msg.action} store synchronized: ${styledUser} deleted with ID ${msg.id}`,
            );
            break;
        }
      } finally {
        isSyncingFromIPC = false;
      }
    }
  });

  users.subscribe((newState, action) => {
    if (isSyncingFromIPC || !process.send) {
      return;
    }

    let messageData = action;
    if (action.type === 'ADD_USER') {
      const newUser = newState[newState.length - 1];
      messageData = { ...action, user: newUser };
    }

    process.send({
      cmd: 'STORE_CHANGE',
      action: messageData.type,
      id:
        messageData.id || (messageData.user ? messageData.user.id : undefined),
      user: messageData.user,
    });
  });
};
