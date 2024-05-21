const allCharacters = 'https://swapi.dev/api/'

const getAllCharachters = async () => {
   const response = await fetch(allCharacters + 'people/?page=' + currentPage)
   return await response.json()
}

const getInfoFromApi = async (link) => {
   const response = await fetch(link)
   return await response.json()
}

const listAllCharacters = async () => {
   const char = await getAllCharachters()
   listCharachters(char)
}

let pagesCount = 1

const searchCharacters = async (searchWord) => {
   const response = await fetch(allCharacters + 'people/?search=' + searchWord)
   let searchResult = await response.json()
   if (searchResult.count == 0) {
      const characters = document.getElementById('characters-container')
      characters.innerHTML = ''
      const character = document.getElementById('characters-container-not')
      character.innerHTML = `<h3 id='not-found'> Character not found </h3>`
   } else {
      listCharachters(searchResult)
   }
}

const closePopup = () => {
   let popupContainer = document.getElementById('popup-container')
   if (popupContainer.style.display == 'none') {
      popupContainer.style.display = 'block'
   } else {
      popupContainer.style.display = 'none'
   }
}

const search = () => {
   let searchWord = document.getElementById('searchBar').value
   searchCharacters(searchWord)
}

let currentPage = 1

const listCharachters = async (char) => {
   const characters = document.getElementById('characters-container')
   characters.innerHTML = ''
   for (let el of char.results) {
      let charDiv = document.createElement('div')
      charDiv.className = 'character1'
      let frameDiv = document.createElement('div')
      frameDiv.className = 'frame'
      let hEl = document.createElement('h1')
      hEl.innerText = el.name
      frameDiv.appendChild(hEl)
      charDiv.appendChild(frameDiv)
      charDiv.addEventListener('click', async () => {
         closePopup()
         let popupContainer = document.getElementById('popup1')
         popupContainer.style.display = 'block'
         popupContainer.innerHTML = `
                  <div class="popup">
                     <h2 class="name">${el.name}</h2>
                    <button class="close" onclick="closePopup()">&times;</button>
                     <div class="content">
                        <h3>Height: ${el.height}</h3>
                        <h3>Mass: ${el.mass}</h3>
                        <h3>Hair color: ${el.hair_color}</h3>
                        <h3>Skin color: ${el.skin_color}</h3>
                        <h3>Eye color: ${el.eye_color}</h3>
                        <h3>Birth year: ${el.birth_year}</h3>
                        <h3>Gender: ${el.gender}</h3>
                     </div>
                     <h3 id="toggle-hidden">Click here to see more information</h3>
                     <div id="hidden-content" style="display: none">
                        ${await insertComplexData()}
                     </div>
                  </div>
         `

         document
            .getElementById('toggle-hidden')
            .addEventListener('click', function () {
               let hiddenContent = document.getElementById('hidden-content')
               if (hiddenContent.style.display === 'none') {
                  hiddenContent.style.display = 'block'
               } else {
                  hiddenContent.style.display = 'none'
               }
            })
      })

      async function insertComplexData() {
         let result = '<h3> <b> Films: </b> </h3>'
         if (el.films.length != 0) {
            for (let film of el.films) {
               let filmInfo = await getInfoFromApi(film)
               result += `<h3>${filmInfo.title}</h3>`
            }
         } else {
            return 'Films not found'
         }

         result += '<h3> <b> Species: </b> </h3> '
         if (el.species == undefined || el.species.length == 0) {
            result += `<h3> Species not found </h3>`
         }
         for (let specie of el.species) {
            let specieInfo = await getInfoFromApi(specie)
            result += `<h3>${specieInfo.name}</h3>`
         }

         result += '<h3> <b> Vehicles: </b></h3>'
         for (let vehicle of el.vehicles) {
            let vehicleInfo = await getInfoFromApi(vehicle)
            result += `<h3>${vehicleInfo.name}</h3>`
         }

         result += '<h3> <b> Starships: </b> </h3>'
         for (let starship of el.starships) {
            let starshipInfo = await getInfoFromApi(starship)
            result += `<h3>${starshipInfo.name}</h3>`
         }

         return result
      }

      characters.appendChild(charDiv)
   }

   pagesCount = Math.ceil(char.count / 10)
}

async function insertPagination() {
   setTimeout(() => {
      const pagination = document.getElementById('pagination')
      pagination.innerHTML = ''

      let prev = document.createElement('a')
      prev.innerHTML = '&laquo;'
      prev.addEventListener('click', () => {
         currentPage--
         if (currentPage < 1) currentPage = 1
         updatePagination()
         listAllCharacters()
      })
      pagination.appendChild(prev)

      for (let i = 1; i <= pagesCount; i++) {
         let pageLink = document.createElement('a')
         pageLink.textContent = i

         pageLink.addEventListener('click', () => {
            currentPage = i
            updatePagination()
            listAllCharacters()
         })

         pagination.appendChild(pageLink)
      }
      let next = document.createElement('a')
      next.innerHTML = '&raquo;'

      next.addEventListener('click', () => {
         currentPage++
         if (currentPage > pagesCount) currentPage = pagesCount
         updatePagination()
         listAllCharacters()
      })
      pagination.appendChild(next)

      updatePagination()
   }, '1500')
}

function updatePagination() {
   let allPageLinks = document.querySelectorAll('#pagination a')
   allPageLinks.forEach((link) => link.classList.remove('active'))

   let currentLink = document.querySelector(
      `#pagination a:nth-child(${currentPage + 1})`
   )
   currentLink.classList.add('active')
}

listAllCharacters()
insertPagination()
