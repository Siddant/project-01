document.addEventListener('DOMContentLoaded', () => {
  //const h1 = document.querySelector('h1')
  const width = 20
  const grid = document.querySelector('.grid')
  let playerIndex, previousIndex



  function addElement () {
    const newDiv = document.createElement('div')
    grid.appendChild(newDiv)
  }

  //h1.textContent = 'hello world'
  for(let i = 0; i<width*width; i++) {
    addElement()
  }


  const div = document.querySelectorAll('.grid div')

  playerIndex = (div.length-1)-(width/2)

  div[playerIndex].classList.add('player')

  function handleKeydown(e){
    previousIndex = playerIndex
    if(e.keyCode === 37 && playerIndex>(div.length-width)){
      playerIndex--
      movePlayer(playerIndex, previousIndex)
    }else if (e.keyCode === 39&& playerIndex<(div.length-1)){
      playerIndex++
      movePlayer(playerIndex, previousIndex)
    }
  }

  function movePlayer(playerIndex, previousIndex){
    div[previousIndex].classList.remove('player')
    div[playerIndex].classList.add('player')


  }

  document.addEventListener('keydown', handleKeydown)



})
