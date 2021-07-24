'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_prod')) ?? []
const setLocalStorage = (dbProd) => localStorage.setItem("db_prod", JSON.stringify(dbProd))

const deleteProd = (index) => {
    const dbProd = readProd()
    dbProd.splice(index, 1)
    setLocalStorage(dbProd)
}

const updateProd = (index, prod) => {
    const dbProd = readProd()
    dbProd[index] = prod
    setLocalStorage(dbProd)
}

const readProd = () => getLocalStorage()

const createProd = (prod) => {
    const dbProd = getLocalStorage()
    dbProd.push (prod)
    setLocalStorage(dbProd)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('cod').dataset.index = 'new'
}

const saveProd = () => {
    debugger
    if (isValidFields()) {
        const prod = {
            cod: document.getElementById('cod').value,
            nome: document.getElementById('nome').value,
            preco: document.getElementById('preco').value,
            description: document.getElementById('description').value
        }
        const index = document.getElementById('cod').dataset.index
        if (index == 'new') {
            createProd(prod)
            updateTable()
            closeModal()
        } else {
            updateProd(index, prod)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (prod, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${prod.cod}</td>
        <td>${prod.nome}</td>
        <td>${prod.preco}</td>
        <td>${prod.description}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Alterar</button>
            <button type="button" class="button red" id="delete-${index}" >Limpar</button>
        </td>
    `
    document.querySelector('#tableProd>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableProd>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbProd = readProd()
    clearTable()
    dbProd.forEach(createRow)
}

const fillFields = (prod) => {
    document.getElementById('cod').value = prod.cod
    document.getElementById('nome').value = prod.nome
    document.getElementById('preco').value = prod.preco
    document.getElementById('description').value = prod.description
    document.getElementById('cod').dataset.index = prod.index
}

const editProd = (index) => {
    const prod = readProd()[index]
    prod.index = index
    fillFields(prod)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editProd(index)
        } else {
            const prod = readProd()[index]
            const response = confirm(`Deseja realmente excluir o produtuo ${prod.cod}`)
            if (response) {
                deleteProd(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarProd')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveProd)

document.querySelector('#tableProd>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)