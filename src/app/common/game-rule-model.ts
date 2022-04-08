export class GameRuleCommand {
    playerId: string | undefined;
    keyPressed : string | undefined;
}

export class ShowGameLevel { 
    gameState : Record<string, any> | undefined;
    movePlayer : Function | undefined;
}