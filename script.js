const btnPortal = document.getElementById('btn-portal')
const loader = document.getElementById('loader')
const ladoCima = document.getElementById('lado-cima')
const ladoBaixo = document.getElementById('lado-baixo')
const body = document.getElementsByTagName('body')
let cards = []
let ultimoCardAberto = null
let testeVitoria = 0

btnPortal.addEventListener('click', async () => {
    ladoBaixo.innerHTML = ''
    ladoCima.innerHTML = ''
    loader.classList.remove('hidden')

    // aquui

    for (let i = 0; i < 4; i++) {
        await requisicao()
    }

    const cardsBaixo = [...cards].sort(() => Math.random() - 0.5)

    // console.log(cards)

    cards.forEach((dados) => forEachDosCards(dados, ladoCima))
    cardsBaixo.forEach((dados) => forEachDosCards(dados, ladoBaixo))


    loader.classList.add('hidden')
})

const forEachDosCards = (dados, lado) => {
    lado.innerHTML += `
        <div class="char-card card-${dados.id}" data-key="${dados.id}">
            <img src="${dados.image}" alt="${dados.name}">
            <div class="char-info" data-key="${dados.id}">
                <h3 class="font-bold text-xl text-lime-400">${dados.name}</h3>
                <p class="text-sm  text-slate-300">Status: ${dados.status}</p>
                <p class="text-sm text-slate-300">Espécie: ${dados.species}</p>
            </div>
        </div>`
}

function testadorDeVitoria() {
    testeVitoria++
    if (testeVitoria == 4) {
        body.classList.add ='vitoria'
        console.log('ganohu')
    }
}

ladoCima.addEventListener('click', (event) => {
    const cardClicado = event.target.closest('div')
    cardClicado.dataset.clicked = true
    if (!ultimoCardAberto) {
        ultimoCardAberto = cardClicado
        console.log(ultimoCardAberto)
    } else if (ultimoCardAberto.getAttribute('data-key') === cardClicado.getAttribute('data-key')) {
        ultimoCardAberto = null
        testadorDeVitoria()
    } else {
        setTimeout(() => {
            ultimoCardAberto.dataset.clicked = false
            cardClicado.dataset.clicked = false
            ultimoCardAberto = null
        }, 1000);
    }
})

ladoBaixo.addEventListener('click', (event) => {
    const cardClicado = event.target.closest('div')
    cardClicado.dataset.clicked = true
    if (ultimoCardAberto) {
        if(ultimoCardAberto.getAttribute('data-key') === cardClicado.getAttribute('data-key')) {
            console.log('deu bom')
            ultimoCardAberto = null
            testadorDeVitoria()
        } else {
            // console.log('deu bom, ou nao')
            setTimeout(() => {
                console.log(ultimoCardAberto)
                ultimoCardAberto.dataset.clicked = false
                cardClicado.dataset.clicked = false
                ultimoCardAberto = null
            }, 1000);
        }
    } else {
        ultimoCardAberto = cardClicado
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