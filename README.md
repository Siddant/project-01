# WDI Project 1
# General Assembly Project 1: Space Invaders

![Image of Logo](assets/readme/space-invaders-logo.png)


## Time frame
9 Days

You can find a hosted version here: https://siddant.github.io/project-01/

## Technology Used
* Javascript (ES6)
* Css
* HTML5
* GitHub

## Game Summary

Space Invaders is a classic arcade game from the 80s. The player aims to shoot an invading alien armada, before it reaches the planet's surface using a mounted gun turret.

The player can only move left or right. The aliens also move from left to right, and also down each time the reach the side of the screen. The aliens also periodically drop bombs towards the player.

Once the player has destroyed a wave of aliens, the game starts again. The aim is to achieve the highest score possible before either being destroyed by the aliens, or allowing them to reach the planet's surface.

## Game Controls:
* Use the ← and → to move left or right.
* Use the spacebar to shoot the invading aliens

# Game Instructions
1. The game start with  a start screen displaying the game title, start game button, instruction button and a High Score button

![Screenshot](assets/readme/home-screen.png)

2. Upon pressing the start button, the game will begin. The game will display the player ship at the bottom of the screen and the enemy ships which is located at the top of the screen. The ship can be controlled by using the ← or → key. Space bar to shoot missile.The game will also display you score points, the game current level and your health bar.

![Screenshot](assets/readme/game.png)

3. By pressing the space bar the player has the ability to shoot the alien ship and shop the waves of alien from invading the earth.

![Screenshot](assets/readme/missle-fire.png)


4. Points are collected by shooting down the aliens ship, the points depends on the ship the player has shoot down.The aliens ship at the 2 top row is worth 30 points each, the middle 2 row is worth 20 points each, the last row is worth 10 points and the mysterious ship that fly past the top is a mystery.

![Screenshot](assets/readme/points.png)

 5. If the player is able to clear the current waves of enemies, it will be replaced by another waves of enemies ship and the level increase. As the player start progress though out the level each waves of enemies start getting difficult to beat as they get faster.

 ![Screenshot](assets/readme/level.png)

 6. The enemies has the ability to fire, so player have to avoid the enemies lazers. If the player do get hit by the enemies lazers, their heath bar will start decreasing. The player health bar is located at the top right corner. If the player health runs out the game will end. The game will also end if the approaching enemies do managed to get to the bottom of the screen. At the end of the game the player do have the options to record their score.

 ![Screenshot](assets/readme/game-end.png)


 7. The main aim of the game is to get as many points as possible. The top 10 recorded high score will be displayed. This option is located at the start menu.

 ![Screenshot](assets/readme/high-score.png)

## Process
  This game is based on a grid layout, so the development process of the game started by creating a 20 X 20 grid. The main div called the grid contains 400 individual div element, each one of these divs were created using javascript so each of these divs can be manipulated over the DOM later. To display enemy ships or the player ship within the div element, an class had to be added called weather 'alien' or 'player'.

  The game movement mechanics were achieved by simply removing the class from the current position and reapplying the class to the new position on the div element. The same mechanics applies to the game lasers. Referring to the code below to move left take the current position index -1, to move right  current position index +1 and to move up take the current position index + 20:
  ```
    moveDown(){
      this.alienIndex += this.width
    }
    moveLeft(){
      this.alienIndex -= 1
    }
    moveRight(){
      this.alienIndex += 1
    }
  ```
  Each enemy were created using a class constructor function:
  ```
  class Alien{
    constructor(alienIndex, points, width, cssClass) {
      this.alienIndex = alienIndex
      this.points = points
      this.width = width
      this.class = cssClass
    }
    set index(index){
      this.alienIndex = index
    }
    get index(){
      return this.alienIndex
    }
    set directionMovemnt(direction){
      this.movment = direction
    }
    get directionMovemnt(){
      return this.movment
    }
    moveDown(){
      this.alienIndex += this.width
    }
    moveLeft(){
      this.alienIndex -= 1
    }
    moveRight(){
      this.alienIndex += 1
    }
    checkEdge(){
      return (this.alienIndex+1)%width === 0 || this.alienIndex%width === 0
    }
  }
  ```
  After each of the alien object were created, they were pushed into an array called an alienArray. By having all of the aliens in an array displaying and moving them together using a foreach method was easier to do. Each of the alien object has a method ```checkEdge()```, which check whether any of them has reached the edge of the grid. Upon reaching grid edge a global variable will be changed which decide the direction of the alien ship movement.

  When the users click the start button it triggers an event which will call the ```startTimer()``` function. Inside of function it contains a ```setInterval()```, the interval id is set in a variable called gameTimerId. This is the main timing interval as it controls the alien movement, check whether the game should end and also the controls the speed of the alien ship movement which will run every 0.75 seconds this will start decreasing after clearing level.

  Each laser are created using a laser class constructor function. To create the laser object when ever the user presses the space button or the alien can shoot, a function had to created which control which direction the laser can start shooting from .

  ```
  //CREATES A laser OBJECT THAT WILL BE TRIGGERED WHEN USER PRESS THE SPACE
  function shoot(playerIndex, shooter, className){
    shootingIndex = playerIndex
    if(shooter === 'user'){
      usersLaser = new Shooting(shootingIndex-width,width,0,shooter, className)
      timerId = setInterval(()=> movelaser(usersLaser), 30)
      if(usersLaser.shootingTimerId===0)usersLaser.shootingTimerId = timerId
    }else{
      const laser = new Shooting(shootingIndex,width,0,shooter, className)
      timerId = setInterval(()=> movelaser(laser), 50)
      if(laser.shootingTimerId===0)laser.shootingTimerId = timerId
    }
  }
  ```
  To get the laser to move up and down a individual ```setInterval()``` function had to be implemented, this interval function makes the laser move independently.

  A function was also created called ```checkHit()``` which checks if a laser has hit the alien ship, by
  looping through all the alines ship in alienArray to check if its location is the same laser index.If there is a match then the alien object is removed from the alienArray using the ```filter``` method, also the it's class name is removed from the div element. It works exactly the same when the user are hit by the alien laser, but instead the alien heath bar decreases.

  To make the aliens to shoot randomly a function called ``` alienShoots()```  was implemented, by using the js method of ```Math.random()``` which will generate a random number. If the generated number is greater than 0.2 than a random alien from the array has the ability to shoot.


  As the core functionality of the game worked properly a final feature were added which allow users to add and display scores. After the game ended and the user enter their name, the value of the score is stored in the localStorage. In the localStorage it's stored with key of HighScore, each of the score are saved as an object like ```{user: "<player name>", score: <player score>```. In the localStorage these object are stored with in an array.

  To display the top 10 high score, it was implemented by retrieving the array from the localStorage. The array was first sorted using : ```const modified = highScoreArray.sort((a,b) => b['score']-a['score']).slice(0,10)```, this function sort the array from highest number to lowest number then using slice function it keeps the 10 elements and removes the rest in the array.

## Challenges

The movement of large groups of aliens in formation similar to the original game was a huge issue. As each of the alien ship was an individual object and trying to move them individually caused a lot of ship to move out of synch or started overlapping on top of another. A lot of trial and error to the ship movement function had to be made in-order to make the movement look similar to the original game.

The game involves a lot of different time based methods and functions which gets invoked at the same time, so it was a challenge to make sure that the game mechanics such as the collision detection work properly. Since the laser and the movement of the alien ship occur at different milliseconds, it was difficult to make sure that the correct ship was hit and was removed properly. Also the laser collision physics does not work properly if the aliens laser and the players laser were to be at the same grid then they will ignore each other and move through them. Therefore the game collision physics need to be worked on further.

Time management of the project was a huge challenge, I started developing the game before making any kind of plans. This caused a lot of issue during the development process, as a lot of time was spent towards thinking about questing such as what the game should look like or what kind of features should the game have.

## Wins
By invested time in the stying the game, particularly adding few design such as adding background images made the game look and feel like a professional game.

The use of class constructor function in the project was really helpful as it made the code reusable and manageable. The code can be refactored further allowing it to be reused in a different game project, typically a vertically scrolling shooter where the action is viewed from above and scrolls up the screen. Similar to the game below on the link:

https://en.wikipedia.org/wiki/Category:Vertically_scrolling_shooters

There were few bugs in the code that was difficult to fix particularly understanding the meaning behind them, so researching these bugs and finding the solution was a satisfying moment overall the project. Also I am pleased to see an improvement in my problem solving skills.

## Future Features

If I had more time then, I would like to make the game design more responsive. To make the game playable on any device such as mobile, table or larger screen. I would also like to included a game control plane which would appear for touchscreen device.

I would have put more animation or sound to make the game come more alive. I would have also like to make the background image to move every few seconds to get the impression that the player is moving on the space.

The movement of the alien ship could be improved, as they move similar to the original game (left to right and go down if they reach the wall). Their movement could be dynamically improved some ship moving right, some moving left some ship coming down and some ship spawning at random location. Some of an additional implementation ideas are listed below:
* Different types of waves of alien.
* Different images for aliens ship as the player start progressing through out the level.
* Different type of object could be implemented such as an astroid or a satellite moving towards the player, which they has to avoid.
