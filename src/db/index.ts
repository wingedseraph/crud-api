type User = {
  username: string;
  age: number;
  hobbies?: string[];
  id: string;
};

// todo: remove before push
export const users: User[] = [
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
