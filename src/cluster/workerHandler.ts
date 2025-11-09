import cluster from 'node:cluster';
import { styleText } from 'node:util';
import { users } from '../db';
import { styledWorker } from '../server/workerServer';
import { StoreChange } from './clusterManager';

const styledUser = styleText('yellowBright', 'User');
let isProcessingIPC = false;

export const setupWorkerHandler = () => {
  process.on('message', (message) => {
    const msg = message as StoreChange;
    if (msg.cmd === 'STORE_CHANGE') {
      isProcessingIPC = true;

      console.log(
        `[${styledWorker} ${cluster.worker!.id}] ${getActionText(msg.action)} store synchronized: ${styledUser} with id: ${msg.id || msg.user?.id}`,
      );

      switch (msg.action) {
        case 'ADD_USER':
          users.dispatch({ type: 'ADD_USER_WITH_ID', user: msg.user });
          break;
        case 'UPDATE_USER':
          users.dispatch({ type: 'UPDATE_USER', id: msg.id, user: msg.user });
          break;
        case 'DELETE_USER':
          users.dispatch({ type: 'DELETE_USER', id: msg.id });
          break;
      }

      isProcessingIPC = false;
    }
  });

  users.subscribe((newState, action) => {
    if (isProcessingIPC || !process.send) return;

    const messageData =
      action.type === 'ADD_USER'
        ? { ...action, user: newState[newState.length - 1] }
        : action;

    process.send({
      cmd: 'STORE_CHANGE',
      action: messageData.type,
      id: messageData.id || messageData.user?.id,
      user: messageData.user,
    });
  });
};

const getActionText = (action: string) => {
  return styleText('blueBright', action.toLowerCase());
};
