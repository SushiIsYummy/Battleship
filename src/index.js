import addMarker from './js/DOM/addMarkerOnGameboard';
import clearGameboardDOM from './js/DOM/clearGameboardDOM';
import createGameboardGrid from './js/DOM/createGameboardGrid';
import renderShipsOnGameBoard from './js/DOM/renderShipsOnGameboard';
import Gameboard from './js/factories/Gameboard';
import Player from './js/factories/Player';
import Ship from './js/factories/Ship';
import { startGame, setUpPreGameStart } from './js/gameplay';
import { placeShipsRandomly } from './js/utils/gameboardUtils';

import '/src/css/styles.css';

setUpPreGameStart();
