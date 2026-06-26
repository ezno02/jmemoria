import { buscarLeaderboard, salvarPontuacao } from './script_db.js';
const loader = document.getElementById('loader')
const ladoCima = document.getElementById('resultado-api')
// const ladoBaixo = document.getElementById('lado-baixo')
const btnPlayAgn = document.getElementById('play-agn-btn')
const start = document.getElementById('tela-inicial')
const inputName = document.getElementById('input-name')
const btnName = document.getElementById('btn-name')
const hud = document.getElementById('hud')
const hudNome = document.getElementById('hud-nome')
const hudTimer = document.getElementById('hud-timer')
const hudPares = document.getElementById('hud-pares')
const pontuacaoRanking = document.getElementById('pontuacao-ranking')
const tempoRanking = document.getElementById('tempo-ranking')
const tbody = document.getElementById('tbody-ranking')
const body = document.body
let cards = []
let ultimoCardAberto = null
let paresCards = 0
let pessaVirada = false
let nomePlayer = ''
let cronometro
let segundos = 0



async function iniciarJogo() {
    cards = []
    paresCards = 0
    ladoCima.innerHTML = ''
    tbody.innerHTML = ''
    body.classList.remove('vitoria')
    loader.classList.remove('hidden')
    hud.classList.remove('hidden')
    hudNome.innerText = `👤 ${nomePlayer}`
    hudPares.innerText = `🏹${paresCards} / 10 Pares`
    timer()
    await requisicao()
    cards = [...cards, ...cards].sort(() => Math.random() - 0.5)

    // console.log(cards)

    cards.forEach((dados) => {
        ladoCima.innerHTML += `
        <div class="char-card card-${dados.id}" data-key="${dados.id}">
            <div class="card-inner">
                <div class="card-frente">
                    <img src="${dados.imagem}" alt="${dados.name}">
                    <div class="char-info" data-key="${dados.id}">
                        <h3 class="font-bold text-xl text-lime-400">nome: ${dados.name}</h3>
                        <h3 class="font-bold text-xl text-lime-400">tipo: ${dados.tipo}</h3>
                    </div>
                </div>
                <div class="card-verso" data-key="${dados.id}"></div>
            </div>
        </div>`
    })


    loader.classList.add('hidden')
}

btnPlayAgn.addEventListener('click', async () => await iniciarJogo())

btnName.addEventListener('click', () => {
    if (inputName.value) {
        nomePlayer = inputName.value
        iniciarJogo()
        start.classList.add('hidden')
    }

})

async function verificarVitoria() {
    paresCards++
    hudPares.innerText = `${paresCards} / 10 Pares`
    if (paresCards == 10) {
        pararTimer()
        await salvarPontuacao(nomePlayer, calcularPontos(segundos), segundos)
        await criarRanking()
        body.classList.add('vitoria')
    }
}

async function criarRanking() {
    pontuacaoRanking.innerText = `${calcularPontos(segundos)} pts`
    tempoRanking.innerText = `Tempo: ${formatarTempo(segundos)}`
    const ranking = await buscarLeaderboard()
    console.log(ranking)
    const medalhas = ['🥇', '🥈', '🥉']
    ranking.forEach((r, i) => {
        const destaque = r.nome_jogador === nomePlayer ? 'class="linha-destaque"' : ''
        tbody.innerHTML += `
        <tr ${destaque}>
            <td>${medalhas[i] ?? i + 1}</td>
            <td>${r.nome_jogador} </td>
            <td>${formatarTempo(r.tempo_segundos)}</td>
            <td class="pts-ranking">${r.pontuacao.toLocaleString('pt-BR')} pts</td>
        </tr>`
    })
}

ladoCima.addEventListener('click', (event) => {
    if (!pessaVirada) {
        const cardClicado = event.target.closest('.card-verso')
        if (cardClicado.classList == 'card-verso') {
            cardClicado.dataset.clicked = true
            if (!ultimoCardAberto) {
                ultimoCardAberto = cardClicado
                console.log(ultimoCardAberto)
            } else if (ultimoCardAberto.getAttribute('data-key') === cardClicado.getAttribute('data-key')) {
                setTimeout(() => {
                    ultimoCardAberto.classList.add('card-acertada')
                    cardClicado.classList.add('card-acertada')
                    console.log(cardClicado)
                    ultimoCardAberto = null
                }, 600);
                verificarVitoria()
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

function timer() {
    clearInterval(cronometro)
    segundos = 0

    cronometro = setInterval(() => {
        segundos++
        hudTimer.innerText = `⏰${formatarTempo(segundos)}`
    }, 1000)
}

function formatarTempo(s) {
    const min = Math.floor(s / 60).toString().padStart(2, '0')

    const sec = (s % 60).toString().padStart(2, '0')

    return `${min}:${sec}`
}

function pararTimer() {
    clearInterval(cronometro)
    return segundos
}

function calcularPontos(s) {
    const pontuacao = Math.max(0, Math.floor(5000 - (s * 10)))
    return pontuacao
}

function aleatorizarPokemons(quantidade) {
    const ids = new Set()
    while (ids.size < quantidade) {
        ids.add(Math.floor(Math.random() * 151) + 1)
    }
    return ids
}

async function requisicao() {

    const ids = aleatorizarPokemons(10)

    for (const id of ids) {

        try {

            const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)

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
}