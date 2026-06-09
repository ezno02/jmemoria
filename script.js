const btnPortal = document.getElementById('btn-portal')
const loader = document.getElementById('loader')
const ladoCima = document.getElementById('lado-cima')
const ladoBaixo = document.getElementById('lado-baixo')
const btnPlayAgn = document.getElementById('play-agn-btn')
const body = document.body
let cards = []
let ultimoCardAberto = null
let testeVitoria = 0
let pessaVirada = false

async function resetGame() {
    cards = []
    testeVitoria = 0
    ladoBaixo.innerHTML = ''
    ladoCima.innerHTML = ''
    body.classList.remove('vitoria')
    loader.classList.remove('hidden')


    for (let i = 0; i < 4; i++) {
        await requisicao()
    }

    const cardsBaixo = [...cards].sort(() => Math.random() - 0.5)

    // console.log(cards)

    cards.forEach((dados) => forEachDosCards(dados, ladoCima))
    cardsBaixo.forEach((dados) => forEachDosCards(dados, ladoBaixo))


    loader.classList.add('hidden')
}

btnPortal.addEventListener('click', async () => await resetGame())

btnPlayAgn.addEventListener('click', async () => await resetGame())

const forEachDosCards = (dados, lado) => {
    lado.innerHTML += `
        <div class="char-card card-${dados.id}" data-key="${dados.id}">
            <img src="${dados.image}" alt="${dados.name}">
            <div class="char-info" data-key="${dados.id}">
                <h3 class="font-bold text-xl text-lime-400">${dados.name}</h3>
                <p class="text-sm  text-slate-300">Status: ${dados.status}</p>
                <p class="text-sm text-slate-300">Espécie: ${dados.species}</p>
            </div>
            <div class="back-card" data-key="${dados.id}"></div>
        </div>`
}

function testadorDeVitoria() {
    testeVitoria++
    if (testeVitoria == 4) {
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

ladoBaixo.addEventListener('click', (event) => {
    if (!pessaVirada) {
        const cardClicado = event.target.closest('div')
        if (cardClicado.classList == 'back-card') {
            cardClicado.dataset.clicked = true
            if (ultimoCardAberto) {
                if (ultimoCardAberto.getAttribute('data-key') === cardClicado.getAttribute('data-key')) {
                    console.log('deu bom')
                    ultimoCardAberto = null
                    testadorDeVitoria()
                } else {
                    // console.log('deu bom, ou nao')
                    pessaVirada = true
                    setTimeout(() => {
                        console.log(ultimoCardAberto)
                        ultimoCardAberto.dataset.clicked = false
                        cardClicado.dataset.clicked = false
                        ultimoCardAberto = null
                        pessaVirada = false
                    }, 1000);
                }
            } else {
                ultimoCardAberto = cardClicado
            }
        }
    }
})




async function requisicao() {
    try {
        const idAleatorio = Math.floor(Math.random() * 826) + 1

        const resposta = await fetch(`https://rickandmortyapi.com/api/character/${idAleatorio}`)

        const dados = await resposta.json()

        cards = [...cards, dados]

        console.log(cards)

    } catch (erro) {
        loader.classList.add('hidden')
        ladoCima.innerHTML = '<p class="text-red-500">Erro no portal. Tente novamente!</p>'
        console.error(erro)
    }
}