import { RoomManager } from './roomManager.mjs';

const socket = io.connect('/ot');
const roomManager = new RoomManager(socket);