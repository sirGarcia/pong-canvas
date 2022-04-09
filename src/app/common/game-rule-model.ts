export class GameRuleCommand {
    playerId: string | undefined;
    keyPressed : string | undefined;
}

export class ShowGameLevel { 
    gameState : Record<string, any> | undefined;
    movePlayer : Function | undefined;
    addPlayer : Function | undefined;
    removePlayer : Function | undefined;
    addBall: Function | undefined;
    removeBall : Function | undefined;
    moveBall : Function | undefined;
    checkBallColision : Function | undefined;
}

export class  Directions{
    getAcceptDirections(){
        return {
            N(ball: any) {
                ball.y--;
            },
            S(ball: any) {
                ball.y++;
            }
        }
    }

    getOpositeDirection(command : any) : string | undefined{
        if(command.direction == 'N'){
            return 'S'
        }
        if(command.direction == 'S'){
            return 'N'
        }
        return undefined;
    }
    
}