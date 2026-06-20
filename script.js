import { get_ranking, post_ranking } from './script_db.js';
const loader = document.getElementById('loader')
const ladoCima = document.getElementById('resultado-api')
// const ladoBaixo = document.getElementById('lado-baixo')
const btnPlayAgn = document.getElementById('play-agn-btn')
const body = document.body
let cards = []
let ultimoCardAberto = null
let testeVitoria = 0
let pessaVirada = false
const start = document.getElementById('start')
const inputName = document.getElementById('input-name')
const btnName = document.getElementById('btn-name')
let nomePlayer = ''


resetGame()

async function resetGame() {
    cards = []
    testeVitoria = 0
    ladoCima.innerHTML = ''
    body.classList.remove('vitoria')
    loader.classList.remove('hidden')


    for (let i = 0; i < 10; i++) {
        await requisicao()
    }

    cards = [...cards, ...cards].sort(() => Math.random() - 0.5)

    // console.log(cards)

    cards.forEach((dados) => {
        ladoCima.innerHTML += `
        <div class="char-card card-${dados.id}" data-key="${dados.id}">
            <img src="${dados.imagem}" alt="${dados.name}">
            <div class="char-info" data-key="${dados.id}">
                <h3 class="font-bold text-xl text-lime-400">${dados.name}</h3>
            </div>
            <div class="back-card" data-key="${dados.id}"></div>
            <div class="carta-desvirada"></div>
        </div>`
    })


    loader.classList.add('hidden')
}

btnPlayAgn.addEventListener('click', async () => await resetGame())

btnName.addEventListener('click', () => {
    if (inputName.value){
        nomePlayer = inputName.value
        start.classList.add('hidden')
    }

})

function testadorDeVitoria() {
    testeVitoria++
    if (testeVitoria == 10) {
        body.classList.add('vitoria')
        // console.log('ganohu')

    }
}

ladoCima.addEventListener('click', (event) => {
    if (!pessaVirada) {
        const cardClicado = event.target.closest('.back-card')
        if (cardClicado.classList == 'back-card') {
            cardClicado.dataset.clicked = true
            if (!ultimoCardAberto) {
                ultimoCardAberto = cardClicado
                console.log(ultimoCardAberto)
            } else if (ultimoCardAberto.getAttribute('data-key') === cardClicado.getAttribute('data-key')) {
                ultimoCardAberto.classList.add('carta-revelada')
                cardClicado.classList.add('carta-revelada')
                console.log(cardClicado)
                ultimoCardAberto = null
                testadorDeVitoria()
            } else {
                pessaVirada = true
                setTimeout(() => {
                    ultimoCardAberto.dataset.clicked = false
                    cardClicado.dataset.clicked = false
                    ultimoCardAberto = null
                    pessaVirada = false
                }, 1000);
            }
        }
    }
})


async function requisicao() {
    try {
        const idAleatorio = Math.floor(Math.random() * 1025) + 1

        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`)

        const dados = await resposta.json()

        const pokemon = {
            id: dados.id,
            name: dados.name,
            imagem: dados.sprites.other['official-artwork'].front_default,
            tipo: dados.types[0].type.name
        }

        console.log(pokemon)

        cards = [...cards, pokemon]

        // console.log(cards)

    } catch (erro) {
        loader.classList.add('hidden')
        ladoCima.innerHTML = '<p class="text-red-500">Erro no portal. Tente novamente!</p>'
        console.error(erro)
    }
}