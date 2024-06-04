// src/data/usersdb.tsx
export type User = {
    id: number;
    username: string;
    name: string;
    latitude: number;
    longitude: number;
    description: string;
    avatarUrl: string;

};

const users: User[] = [
    {
        id: 1,
        username: 'torvalds',
        name: 'Linus Torvalds',
        latitude: 37.3861,
        longitude: -122.0839,
        description: 'Creator of Linux',
        avatarUrl: 'https://avatars.githubusercontent.com/torvalds'
    },
    {
        id: 2,
        username: 'gaearon',
        name: 'Dan Abramov',
        latitude: 37.7749,
        longitude: -122.4194,
        description: 'Co-author of Redux',
        avatarUrl: 'https://avatars.githubusercontent.com/gaearon'
    },
    {
        id: 3,
        username: 'yyx990803',
        name: 'Evan You',
        latitude: 34.0522,
        longitude: -118.2437,
        description: 'Creator of Vue.js',
        avatarUrl: 'https://avatars.githubusercontent.com/yyx990803'
    },
    {
        id: 4,
        username: 'addyosmani',
        name: 'Addy Osmani',
        latitude: 40.7128,
        longitude: -74.0060,
        description: 'Google Chrome DevTools',
        avatarUrl: 'https://avatars.githubusercontent.com/addyosmani'
    },
    {
        id: 5,
        username: 'jakearchibald',
        name: 'Jake Archibald',
        latitude: 51.5074,
        longitude: -0.1278,
        description: 'Google Chrome Team',
        avatarUrl: 'https://avatars.githubusercontent.com/jakearchibald'
    },
];

export default users;
