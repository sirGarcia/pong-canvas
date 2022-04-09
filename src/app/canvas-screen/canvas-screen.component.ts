import { global } from '@angular/compiler/src/util';
import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { Directions, GameRuleCommand, ShowGameLevel } from '../common/game-rule-model';
import { BasicSetupEnum } from '../common/setup-enum';


@Component({
  selector: 'app-canvas-screen',
  templateUrl: './canvas-screen.component.html',
  styleUrls: ['./canvas-screen.component.css']
})
export class CanvasScreenComponent implements AfterViewInit {

  @ViewChild('screen')
  screen!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D | null;
  requestId!: number;
  gameLevel : ShowGameLevel | undefined;
  keyBoardEventSubject : Observable<any> = fromEvent(document, 'keydown');
  constructor(private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    let iDirection = 'N'
    let skipMoveBall = BasicSetupEnum.INITIAL_BALL_SPEED;
    if(!(this.context = this.screen.nativeElement.getContext('2d'))){
      console.error("Failed to initialize Canvas please restar the window");
    }
    this.gameLevel = this.createGame();
    const keyboard = this.createKeyboardListener();
    const player1 = {
      playerId: 'player1',
      playerX : 9,
      playerY : 0
    };
    const player2 = {
      playerId: 'player2',
      playerX : 9,
      playerY : 39
    };
    this.gameLevel.addPlayer?.(player1);
    this.gameLevel.addPlayer?.(player2);
    this.gameLevel.addBall?.({
      ballId: 'ball1',
      x : 10,
      y : 20,
      speed : 1
    });
    keyboard.keyBoardEventHandler(this.keyBoardEventSubject);
    keyboard.subscribe(this.gameLevel.movePlayer);
    
    setInterval(() => {
      const dir = new Directions();
      if((skipMoveBall - this.gameLevel!.gameState!['balls']['ball1'].speed) <= 0){
        this.gameLevel!.moveBall?.({ballId: 'ball1', direction : iDirection});
        if(this.gameLevel!.checkBallColision?.({ballId: 'ball1'})){
          iDirection = dir.getOpositeDirection({direction : iDirection})!;
          this.gameLevel!.gameState!['balls']['ball1'].speed++;
          this.gameLevel!.moveBall?.({ballId: 'ball1', direction : iDirection});
        };
        console.log(iDirection);
        skipMoveBall = BasicSetupEnum.INITIAL_BALL_SPEED;
      }else {
        skipMoveBall--;
      }
      
      this.drawScreen();
    }, 6);
  }

  createKeyboardListener(){
    const state = {
      observer : [] as any
    };

    function subscribe(observerFunction : any){
      state.observer.push(observerFunction);
    }

    function notifyAll(command : any){
      for(let observerFunction of state.observer){
        observerFunction(command);
      }
    }

    function handleKeyDown(eventKeyDown : any){
      const keyPressed = eventKeyDown.key;
      const command = {
        playerId : 'player1',
        keyPressed
      }
      notifyAll(command);
    }

    function keyBoardEventHandler(keyboardEvent : Observable<any>): void {
      keyboardEvent.subscribe((event) => {
        handleKeyDown(event);
      });
    }

    return {
      subscribe, 
      keyBoardEventHandler
    }
  }

 createGame() : ShowGameLevel {
   const gameLevel = new ShowGameLevel();
   let gameData : any = {
      players : {}, 
      balls : {},
      screen : { 
        width: BasicSetupEnum.SCREEN_WIDTH, 
        height: BasicSetupEnum.SCREEN_HEIGTH 
      }
    }

    function addPlayer(command : any){
      const playerId = command!.playerId;
      const playerX = command!.playerX;
      const playerY = command!.playerY;

      gameData.players[playerId as keyof typeof gameData.players] = {x : playerX, y : playerY};
     
    }

    function removePlayer(command : any){
      const playerId = command.playerId;

      delete gameData.players[playerId as keyof typeof gameData.players];
    }

    function addBall(command : any){
      const ball = {
        ballId : command!.ballId,
        x : command!.x, 
        y : command!.y,
        speed : command!.speed
      }
      
      gameData.balls[ball.ballId as keyof typeof gameData.balls] = ball;
    }
    function removeBall(command : any){
      const ballId = command.ballId;

      delete gameData.balls[ballId as keyof typeof gameData.balls];
    }
    function movePLayer(command: GameRuleCommand){
      const screen = gameData.screen;
      const acceptedMoves = {
        KeyDownA(player : any){
          player.x = Math.max(0, player.x -1);
        },
        KeyDownD(player : any){
          player.x = Math.min((player.x + 1), (screen.width - BasicSetupEnum.PLAYER_WIDTH));
        }
      }

      const keyPressed = 'KeyDown' + command.keyPressed!.toLocaleUpperCase();
      const player = gameData.players[command.playerId! as keyof typeof gameData.players];
      const moveFunction = acceptedMoves[keyPressed as keyof typeof acceptedMoves];
      if(player && moveFunction) moveFunction(player);

    }

    function moveBall(command: any){
      const ballId = command.ballId;
      const direction = command.direction;
      const acceptedDir = new Directions().getAcceptDirections();
      
      const ball =  gameData.balls[ballId as keyof typeof gameData.balls];
      const moveFunction = acceptedDir![direction as keyof typeof acceptedDir];
      if(ball && moveFunction) moveFunction(ball);
    }
    
    function checkBallColision(command : any) : boolean | undefined{
      const ballId = command.ballId;
      const ball = gameData.balls[ballId as keyof typeof gameData.balls];
      const players = gameData['players'];
      for(let playerId in gameData.players){
        const player = players[playerId as keyof typeof players];
        if(ball.y === player.y && ball.x >= player.x && ball.x < (player.x + BasicSetupEnum.PLAYER_WIDTH) ){
          return true;
        }
      }
      return false;
    }

    gameLevel.gameState = gameData;
    gameLevel.movePlayer = movePLayer;
    gameLevel.addPlayer = addPlayer;
    gameLevel.removePlayer = removePlayer;
    gameLevel.addBall = addBall;
    gameLevel.removeBall= removeBall;
    gameLevel.moveBall = moveBall;
    gameLevel.checkBallColision = checkBallColision;


    return gameLevel;
  }

  drawScreen() : void {
    const players = this.gameLevel!.gameState!['players'];
    this.context!.clearRect(0, 0, 21, 40);
    const playerColor = 'blue';
    const ballColor = 'black';
    for(let playerId in players){
      const player = players[playerId as keyof typeof players];
      const posX = player.x;
      this.context!.fillStyle = playerColor; 
      this.context!.fillRect(posX, player.y, BasicSetupEnum.PLAYER_WIDTH, 1);
    }
    
    const balls = this.gameLevel!.gameState!['balls'];
    for(let ballId in balls){
      const ball = balls[ballId as keyof typeof balls];
      this.context!.fillStyle = ballColor; 
      this.context!.fillRect(ball.x, ball.y, 1, 1);
    } 

    this.requestId = requestAnimationFrame(() => this.drawScreen);
  }
}
