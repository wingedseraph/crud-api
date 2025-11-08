import { randomUUID } from 'node:crypto';

type GenericReducer<state, action> = (state: state, action: action) => state;

type User = {
  username: string;
  age: number;
  hobbies: string[];
  id: string;
};

type UserAction = {
  type: 'ADD_USER' | 'DELETE_USER' | 'UPDATE_USER';
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

    case 'DELETE_USER':
      return state.filter((user) => user.id !== action.id);

    case 'UPDATE_USER':
      return state.map((user) => user.id === action.id ? {...user, ...action.user} : user) 

    default:
      return state;
  }
};

export const createStore = <state, action>(
  reducer: GenericReducer<state, action>,
  initialState: state,
) => {
  let state: state = initialState;

  const getState = () => state;
  const dispatch = (action: action) => {
    state = reducer(state, action);
    return state;
  };

  return { getState, dispatch };
};

// todo: remove before push
const initialState: User[] = [
  {
    username: 'good',
    age: 23,
    hobbies: ['good'],
    id: '550e8400-e29b-41d4-a716-446655440000',
  },
  {
    username: 'gold',
    age: 19,
    hobbies: ['NONE'],
    id: 'da0ed38e-eb3d-4d50-864a-30de53a257d6',
  },
];

export const users = createStore(record, initialState);
