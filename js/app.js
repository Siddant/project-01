document.addEventListener('DOMContentLoaded', () => {
  //const h1 = document.querySelector('h1')
  const width = 20
  const grid = document.querySelector('.grid')



  function addElement () {
    const newDiv = document.createElement('div')
    grid.appendChild(newDiv)
  }


  //h1.textContent = 'hello world'
  console.log(grid)
  for(let i = 0; i<width*width; i++) {
    addElement()
  }



})
