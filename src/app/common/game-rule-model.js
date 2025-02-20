export class GameRuleCommand {
    constructor() {
        this.playerId = undefined;
        this.keyPressed = undefined;
    }
}

export class ShowGameLevel { 
    constructor() {
        this.gameState = undefined;
        this.movePlayer = undefined;
        this.addPlayer = undefined;
        this.removePlayer = undefined;
        this.addBall = undefined;
        this.removeBall = undefined;
        this.moveBall = undefined;
        this.checkBallColision = undefined;
    }
}

export class Directions {
    getAcceptDirections() {
        return {
            N: function(ball) {
                ball.y--;
            },
            S: function(ball) {
                ball.y++;
            }
        };
    }

    getOpositeDirection(command) {
        if (command.direction === 'N') {
            return 'S';
        }
        if (command.direction === 'S') {
            return 'N';
        }
        return undefined;
    }
}
