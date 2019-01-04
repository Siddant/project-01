document.addEventListener('DOMContentLoaded', () => {
  //const h1 = document.querySelector('h1')
  const width = 20
  const grid = document.querySelector('.grid')
  const alien = 11
  const alienRow = 5
  let playerIndex, previousIndex, timerId, shootingIndex, div, score =0

  //used to store the alien object and can be used in a global aspect
  let arr = []

  //class

  class Shooting {
    constructor(playeIndex, width, timerId) {
      this.shootingIndex = playeIndex
      this.width  =  width
      this.timerId = timerId
    }
    get shottingIndex() {
      return this.shootingIndex
    }
    get previousShootingIndex(){
      return this.shootingIndex + this.width
    }
    set shootingTimerId(minus) {
      this.timerId = minus
    }
    get shootingTimerId() {
      return this.timerId
    }
    minusWidth(){
      this.shootingIndex -= this.width
    }
    addWidth(){
      this.shootingIndex += this.width
    }
  }


  class Alien{
    constructor(alienIndex, points) {
      this.alienIndex = alienIndex
      this.points = points
      this.modify = 2
    }
    addIndex(){
      this.alienIndex *= this.modify
    }
  }


  //CREATE DIVS AND ADD DIVS
  function addElement () {
    const newDiv = document.createElement('div')
    grid.appendChild(newDiv)
  }


  //HANDLE PLAYER EVENTS
  function handleKeydown(e){
    previousIndex = playerIndex
    if(e.keyCode === 37 && playerIndex>(div.length-width)){
      playerIndex--
      movePlayer(playerIndex, previousIndex)
    }else if (e.keyCode === 39 && playerIndex<(div.length-1)){
      playerIndex++
      movePlayer(playerIndex, previousIndex)
    }else if (e.keyCode === 32){
      shoot(playerIndex, 'shooting')
    }
  }

  //ADD AND REMOVE PLAYER DIRECTION
  function movePlayer(playerIndex, previousIndex){
    div[previousIndex].classList.remove('player')
    div[playerIndex].classList.add('player')
  }

  //CREATE THE ALIEN OBJECT USING THE ALIEN CLASS
  function alienCreate(index, className){
    let startPosition = index
    let endPosiition = startPosition+alien
    let points = 30
    for(let i = 0; i<alien*alienRow; i++) {


      if(startPosition === endPosiition){
        endPosiition+=width
        startPosition= (startPosition-10)+20

      }else{
        startPosition++
      }
      if(startPosition === (index+20+1) ||startPosition === (index+60+1) ){
        points -= 10
      }
      const aliens = new Alien(startPosition , points)
      div[aliens.alienIndex].classList.add(className)
      arr.push(aliens)
      console.log(aliens)
    }
  }

  //CREATES A BULLET OBJECT THAT WILL BE TRIGGERED WHEN USER PRESS THE SPACE
  function shoot(playerIndex,classname){
    shootingIndex = playerIndex
    let playerShoot = new Shooting(shootingIndex,width,0)
    timerId = setInterval(()=> {
      playerShoot.minusWidth()
      if(playerShoot.shottingIndex<0){
        clearInterval(playerShoot.shootingTimerId)
        div[playerShoot.shottingIndex+width].classList.remove(classname)
        playerShoot = undefined
      }else{
        if((playerShoot.shottingIndex+width)!==playerIndex)div[playerShoot.shottingIndex+width]
          .classList.remove(classname)
        div[playerShoot.shottingIndex].classList.add(classname)
      }
      if(playerShoot)checkHit(playerShoot.shottingIndex, classname, playerShoot.shootingTimerId)

    }, 100)
    if(playerShoot.shootingTimerId===0)playerShoot.shootingTimerId = timerId
  }


  //collision dection  to check if the users hit the alien
  function checkHit(playerShoot, className, timerId){
    arr.forEach(elem =>{
      if(!!elem.alienIndex && elem.alienIndex === playerShoot){
        clearInterval(timerId)
        div[playerShoot].classList.remove(className)
        div[playerShoot].classList.remove('alien')
        score += elem.points
        elem = undefined
        console.log(score)
      }
    })
    arr = arr.filter(elem => elem.alienIndex !== playerShoot)
  }


  //INITIALIZE THE GAME
  function init(){
    for(let i = 0; i<width*width; i++) {
      addElement()
    }
    div = document.querySelectorAll('.grid div')
    document.addEventListener('keydown', handleKeydown)
    alienCreate(23,'alien')
    playerIndex = (div.length-1)-(width/2)
    div[playerIndex].classList.add('player')
  }

  init()
})
