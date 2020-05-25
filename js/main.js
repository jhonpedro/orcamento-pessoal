// Serve para colocar os 10+1 ultimos anos dentro do select de ano
function pegarAno(){
    let data = new Date
    let comecoAno = 2010
    let fimAno = data.getFullYear()
    let select = document.getElementById('ano')
    
    for( comecoAno; comecoAno <= fimAno + 1 ; comecoAno++ ){
        let option = document.createElement('option')
        option.innerHTML = comecoAno
        option.value = comecoAno
        
        select.appendChild(option)
    }
}

// funcao para subir o container no momento do click
function subir(){
    let content = document.getElementById('conteudo')
    content.style.top = '20px'
}

function catchDespesaValues(){
    let dia = document.getElementById('dia')
    let mes = document.getElementById('mes')
    let ano = document.getElementById('ano')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        dia.value.trim(), 
        mes.value, 
        ano.value, 
        tipo.value, 
        descricao.value.trim(), 
        valor.value.trim())
    
    dia.value = ''
    mes.value = ''
    ano.value = ''
    tipo.value = ''
    descricao.value = ''
    valor.value = ''

    return despesa

}

class Despesa {
    constructor(dia, mes, ano, tipo, descricao, valor) {
        this.dia = dia
        this.mes = mes
        this.ano = ano
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(i == 'dia'){
                if(this[i]<1 || this[i]>31) {
                    return false
                }
            }
            if(this[i] == undefined || this[i] == '' || this[i] == null || this[i] == NaN){
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id',0)
        }
    }

    getNextId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(despesas){
        let id = this.getNextId()
        localStorage.setItem(id, JSON.stringify(despesas))
        localStorage.setItem('id',id)
    }
    
    recuperarTodosRegistros(){
        let lenght_id = localStorage.getItem('id')
        let array = new Array
        
        for(let i = 1; i <= lenght_id; i++){
            let despesa = JSON.parse(localStorage.getItem(i))
            if(despesa != null){
                despesa.id = i
                array.push(despesa)
            }
        }

        return array
    }
    
    pesquisar(despesa){
        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()
        
        if(despesa.dia != '' ){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        
        return despesasFiltradas

    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd

function cadastrarDespesa(){
    let despesa = catchDespesaValues()
        
    if(despesa.validarDados()){
        bd.gravar(despesa)
        document.getElementById('h1Modal').innerHTML = 'Sucesso'
        document.getElementById('h1Modal').className = 'modal-title text-success'
        document.getElementById('pModal').innerHTML = 'Sucesso no cadastro da despesa'
        document.getElementById('buttonModal').innerHTML = 'Voltar'
        document.getElementById('buttonModal').className = 'btn btn-outline-success'
        
        let botao_consulta = document.createElement('button')
        botao_consulta.innerHTML = 'Consultar'
        botao_consulta.className = 'btn btn-outline-success'
        botao_consulta.onclick = () => window.location.href = 'consulta.html'
        document.getElementById('footerModal').appendChild(botao_consulta)
        $('#registraDespesaModal').modal('show')
        
        document.getElementById('buttonModal').onclick = () => botao_consulta.remove()
    } else {
        document.getElementById('h1Modal').innerHTML = 'Erro'
        document.getElementById('h1Modal').className = 'modal-title text-danger'
        document.getElementById('pModal').innerHTML = 'Erro no cadastro da despesa favor verificar os dados'
        document.getElementById('buttonModal').innerHTML = 'Voltar'
        document.getElementById('buttonModal').className = 'btn btn-outline-danger'
        $('#registraDespesaModal').modal('show')
    }
}

function carregarDesespesas(despesa){
    let despesas = despesa
    
    let lista = document.getElementById('corpoTabela')
    lista.innerHTML = null
    despesas.forEach(despesa => {
        let linha = lista.insertRow()

        switch(despesa.tipo){
            case "1":
                despesa.tipo = 'Alimentação'
                break
            case "2":
                despesa.tipo = 'Educação'
                break
            case "3":
                despesa.tipo = 'Lazer'
                break
            case "4":
                despesa.tipo = 'Saúde'
                break
            case "5":
                despesa.tipo = 'Transporte'
                break
        }

        linha.insertCell(0).innerHTML = `${despesa.dia}/${despesa.mes}/${despesa.ano}`
        linha.insertCell(1).innerHTML = despesa.tipo
        linha.insertCell(2).innerHTML = despesa.descricao
        linha.insertCell(3).innerHTML = `R$ ${despesa.valor}`
        
        let btn = document.createElement('button')
        btn.className = 'btn btn-outline-danger font-weigth-bold'
        btn.innerHTML = '&times;'
        btn.id = `id_despesa_${despesa.id}`
        btn.onclick = () => {
            let id = btn.id
            id = id.replace('id_despesa_','')
            bd.remover(id)
            this.carregarDesespesas(bd.recuperarTodosRegistros())
        }
        linha.insertCell(4).append(btn)
    })
}

function pesquisaDespesa(){
    let despesa_pesquisar = catchDespesaValues()
    despesa_pesquisar = bd.pesquisar(despesa_pesquisar)

    carregarDesespesas(despesa_pesquisar)
}