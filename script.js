const btnPortal = document.getElementById('btn-portal')
const loader = document.getElementById('loader')
const ladoCima = document.getElementById('lado-cima')
const ladoBaixo = document.getElementById('lado-baixo')
let cards = []
let ultimoCardAberto = null

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


async function teste(e,){
    const classe = `.card-${e}`
    const card = document.querySelector(classe)
    card.style.color = 'red'

    if (ultimoCardAberto === e) {
        
    }

}


const forEachDosCards = (dados, lado) => {
    lado.innerHTML += `
        <div class="char-card card-${dados.id}" onClick="teste(${dados.id})">
            <img src="${dados.image}" alt="${dados.name}">
            <div class="char-info">
                <h3 class="font-bold text-xl text-lime-400">${dados.name}</h3>
                <p class="text-sm  text-slate-300">Status: ${dados.status}</p>
                <p class="text-sm text-slate-300">Espécie: ${dados.species}</p>
            </div>
        </div>`
}



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