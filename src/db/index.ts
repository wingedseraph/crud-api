import { randomUUID } from 'node:crypto';

type GenericReducer<state, action> = (state: state, action: action) => state;

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

type UserAction = {
  type: 'ADD_USER' | 'ADD_USER_WITH_ID' | 'DELETE_USER' | 'UPDATE_USER';
  id?: string;
  user?: User;
};

const record: GenericReducer<User[], UserAction> = (
  state: User[] = [],
  action: UserAction,
) => {
  switch (action.type) {
    case 'ADD_USER': {
      const id = randomUUID();
      return state.concat([{ id, ...action.user } as User]);
    }
    
    case 'ADD_USER_WITH_ID': {
      return state.concat([action.user as User]);
    }

    case 'DELETE_USER':
      return state.filter((user) => user.id !== action.id);

    case 'UPDATE_USER':
      return state.map((user) =>
        user.id === action.id ? { ...user, ...action.user } : user,
      );

    default:
      return state;
  }
};

export const createStore = <state, action>(
  reducer: GenericReducer<state, action>,
  initialState: state,
) => {
  let state: state = initialState;
  const listeners: Array<(newState: state, action: action) => void> = [];

  const getState = () => state;
  
  const dispatch = (action: action) => {
    const newState = reducer(state, action);
    state = newState;
    listeners.forEach(listener => listener(state, action));
    return state;
  };
  
  const subscribe = (listener: (newState: state, action: action) => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  };

  return { getState, dispatch, subscribe };
};

const initialState: User[] = [];

export const users = createStore(record, initialState);
