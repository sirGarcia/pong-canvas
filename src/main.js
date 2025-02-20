import { Directions, GameRuleCommand, ShowGameLevel } from "./app/common/game-rule-model.js";
import {BasicSetupEnum} from "./app/common/setup-enum.js";

function createKeyboardListener() {
    const state = {
        observer: []
    };

    function subscribe(observerFunction) {
        state.observer.push(observerFunction);
    }

    function notifyAll(command) {
        for (let observerFunction of state.observer) {
            observerFunction(command);
        }
    }

    function handleKeyDown(eventKeyDown) {
        const keyPressed = eventKeyDown.key;
        const command = {
            playerId: 'player1',
            keyPressed
        };
        notifyAll(command);
    }

    function keyBoardEventHandler(keyboardEvent) {
        handleKeyDown(keyboardEvent);
    }

    return {
        subscribe,
        keyBoardEventHandler
    };
}

function drawScreen(gameLevel, context, skipMoveBall, iDirection) {
    const players = gameLevel.gameState['players'];
    const balls = gameLevel.gameState['balls'];
    context.clearRect(0, 0, 21, 40);
    const playerColor = 'blue';
    const ballColor = 'black';
    let constBall = { ballId: 'ball1', direction: iDirection };

    const dir = new Directions();
    if ((skipMoveBall - balls['ball1'].speed) <= 0) {
        gameLevel.moveBall?.(constBall);
        if (gameLevel.checkBallCollision?.(constBall)) {
            console.log("Collision Detected");
            iDirection = dir.getOpositeDirection({ direction: iDirection });
            constBall.direction = iDirection;
            balls['ball1'].speed++;
            gameLevel.moveBall?.(constBall);
            gameLevel.moveBall?.(constBall);
        }
        console.log(iDirection);
        skipMoveBall = BasicSetupEnum.INITIAL_BALL_SPEED;
    } else {
        skipMoveBall--;
    }

    for (let playerId in players) {
        const player = players[playerId];
        context.fillStyle = playerColor; 
        context.fillRect(player.x, player.y, BasicSetupEnum.PLAYER_WIDTH, 1);
    }
    
    
    for (let ballId in balls) {
        const ball = balls[ballId];
        context.fillStyle = ballColor; 
        context.fillRect(ball.x, ball.y, 1, 1);
    } 

    let requestId = requestAnimationFrame(() => drawScreen(gameLevel, context, skipMoveBall, iDirection));
}

function createGame() {
    const gameLevel = new ShowGameLevel();
    let gameData = {
        players: {},
        balls: {},
        screen: {
            width: BasicSetupEnum.SCREEN_WIDTH,
            height: BasicSetupEnum.SCREEN_HEIGTH
        }
    };

    function addPlayer(command) {
        const playerId = command.playerId;
        const playerX = command.playerX;
        const playerY = command.playerY;

        gameData.players[playerId] = { "playerId": playerId, x: playerX, y: playerY };
    }

    function removePlayer(command) {
        const playerId = command.playerId;

        delete gameData.players[playerId];
    }

    function addBall(command) {
        const ball = {
            ballId: command.ballId,
            x: command.x,
            y: command.y,
            speed: command.speed
        };

        gameData.balls[ball.ballId] = ball;
    }

    function removeBall(command) {
        const ballId = command.ballId;

        delete gameData.balls[ballId];
    }

    function movePlayer(command) {
        const screen = gameData.screen;
        const acceptedMoves = {
            KeyDownA(player) {
                player.x = Math.max(0, player.x - 1);
            },
            KeyDownD(player) {
                player.x = Math.min((player.x + 1), (screen.width - BasicSetupEnum.PLAYER_WIDTH));
            }
        };

        const keyPressed = 'KeyDown' + command.keyPressed.toLocaleUpperCase();
        const player = gameData.players[command.playerId];
        const moveFunction = acceptedMoves[keyPressed];
        if (player && moveFunction) moveFunction(player);
    }

    function moveBall(command) {
        const ballId = command.ballId;
        const direction = command.direction;
        const acceptedDir = new Directions().getAcceptDirections();

        const ball = gameData.balls[ballId];
        const moveFunction = acceptedDir[direction];
        if (ball && moveFunction) moveFunction(ball);
    }

    function checkBallCollision(command) {
        const ballId = command.ballId;
        const ball = gameData.balls[ballId];
        const players = gameData.players;
        for (let playerId in players) {
            const player = players[playerId];
            if (ball.y === player.y && ball.x >= player.x && ball.x < (player.x + BasicSetupEnum.PLAYER_WIDTH)) {
                return true;
            }
        }
        return false;
    }

    gameLevel.gameState = gameData;
    gameLevel.movePlayer = movePlayer;
    gameLevel.addPlayer = addPlayer;
    gameLevel.removePlayer = removePlayer;
    gameLevel.addBall = addBall;
    gameLevel.removeBall = removeBall;
    gameLevel.moveBall = moveBall;
    gameLevel.checkBallCollision = checkBallCollision;

    return gameLevel;
}

function init(screen, gameLevel, keyboard, drawScreen) {
    
    console.log("Game Started");
    let context = null;

    if (!(context = screen.getContext('2d'))) {
    console.error("Failed to initialize Canvas please restart the window");
    }
    const player1 = {
        playerId: 'player1',
        playerX: 9,
        playerY: 0
    };
    const player2 = {
        playerId: 'player2',
        playerX: 9,
        playerY: 39
    };
    gameLevel.addPlayer?.(player1);
    gameLevel.addPlayer?.(player2);
    gameLevel.addBall?.({
        ballId: 'ball1',
        x: 10,
        y: 20,
        speed: 1
    });
    //keyboard.keyBoardEventHandler(this.keyBoardEventSubject);
    keyboard.subscribe(gameLevel.movePlayer);
    document.addEventListener('keydown', (event) => keyboard.keyBoardEventHandler(event));
    
    let requestId = requestAnimationFrame(() => drawScreen(gameLevel, context, BasicSetupEnum.INITIAL_BALL_SPEED, 'N'));
    
}

const screen = document.getElementById('gameScreen');
const gammeLevel = createGame();
const keyboard = createKeyboardListener();

document.addEventListener('DOMContentLoaded', init(screen, gammeLevel, keyboard, drawScreen));
