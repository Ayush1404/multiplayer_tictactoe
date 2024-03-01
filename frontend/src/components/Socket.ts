import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'multiplayer-tictactoe.onrender.com';
// const URL ='localhost:3000'
export const socket = io(URL);