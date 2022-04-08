import { global } from '@angular/compiler/src/util';
import { AfterViewInit, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { GameRuleCommand, ShowGameLevel } from '../common/game-rule-model';
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
    if(!(this.context = this.screen.nativeElement.getContext('2d'))){
      console.error("Failed to initialize Canvas please restar the window");
    }
    this.gameLevel = this.createGame();
    const keyboard = this.createKeyboardListener();
    keyboard.keyBoardEventHandler(this.keyBoardEventSubject);
    keyboard.subscribe(this.gameLevel.movePlayer);
    setInterval(() => {
      this.drawScreen();
    }, 6);
    //this.drawScreen();
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
   let gameData = {
      players : {
        'player1' : { x : 0, y : 0},
        'player2' : { x : 6, y : 39}
      }, 
      ball : { x: 10, y: 20, speed: 1},
      screen : { 
        width: BasicSetupEnum.SCREEN_WIDTH, 
        height: BasicSetupEnum.SCREEN_HEIGTH 
      }
    }
    function movePLayer(command: GameRuleCommand){
      const screen = gameData.screen;
      const acceptedMoves = {
        KeyDownA(player : any){
          if(player.x -1 >= 0)
            player.x--;
          console.log(`Move player to the left!`);
        },
        KeyDownD(player : any){
          if((player.x + 1) * BasicSetupEnum.PLAYER_WIDTH < screen.width)
            player.x++;
          console.log(`Move player to the right!`);
        }
      }

      const keyPressed = 'KeyDown' + command.keyPressed!.toLocaleUpperCase();
      const player = gameData.players[command.playerId! as keyof typeof gameData.players];
      const moveFunction = acceptedMoves[keyPressed as keyof typeof acceptedMoves];
      moveFunction? moveFunction(player) : undefined;
    }
    
    gameLevel.movePlayer = movePLayer;
    gameLevel.gameState = gameData;

    return gameLevel;
  }

  drawScreen() : void {
    const players = this.gameLevel!.gameState!['players'];
    this.context!.clearRect(0, 0, 21, 40);
    const playerColor = 'blue';
    const ballColor = 'black';
    for(let playerId in players){
      const player = players[playerId as keyof typeof players];
      const posX = player.x * BasicSetupEnum.PLAYER_WIDTH;
      this.context!.fillStyle = playerColor; 
      this.context!.fillRect(posX, player.y, 3, 1);
    }
    
    const ball = this.gameLevel!.gameState!['ball'];
    this.context!.fillStyle = ballColor; 
    this.context!.fillRect(ball.x, ball.y, 1, 1); 

    this.requestId = requestAnimationFrame(() => this.drawScreen);
  }
}
