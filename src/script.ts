import { openModal, closeModal } from './modal.js';
import type { Registro } from './data.js';
import { addRegister, loadRegister, registros } from './data.js';
import {
  atualizarTotal,
  editarRegistro,
  removerRegistro,
  renderizarTabela,
  setRegistroIdParaEditar,
  getRegistroIdParaEditar,
  showNotification,
} from './ui.js';

let activeFilter: 'todos' | 'entrada' | 'saida' = 'todos';
let tipoTransacao: 'entrada' | 'saida' = 'entrada';
export const totalRegistro = document.getElementById('total-registros');
export const valorEntradas = document.getElementById('valor-entradas');
export const valorSaidas = document.getElementById('valor-saidas');
export const saldoFinal = document.getElementById('saldo-final');
const description = document.getElementById('descricao') as HTMLInputElement;
const value = document.getElementById('valor') as HTMLInputElement;
const data = document.getElementById('data') as HTMLInputElement;
const table = document.getElementById('tabela-registros') as HTMLTableElement;
const submit = document.getElementById('form-registro');
const btnEntrada = document.getElementById('tipo-entrada') as HTMLInputElement;
const btnSaida = document.getElementById('tipo-saida') as HTMLInputElement;
const btnFechar = document.getElementById('btn-fechar-modal');
const registrarEntrada = document.getElementById('btn-entrada');
const registrarSaida = document.getElementById('btn-saida');
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const btnFilterAll = document.getElementById('filter-all') as HTMLButtonElement;
const btnFilterEntrada = document.getElementById(
  'filter-entrada',
) as HTMLButtonElement;
const btnFilterSaida = document.getElementById(
  'filter-saida',
) as HTMLButtonElement;
const filterContainer = document.querySelector(
  '.filter-container',
) as HTMLElement;

export function setTipoTransacao(tipo: 'entrada' | 'saida') {
  tipoTransacao = tipo;
  const radioEntrada = document.getElementById(
    'tipo-entrada',
  ) as HTMLInputElement;
  const radioSaida = document.getElementById('tipo-saida') as HTMLInputElement;
  if (tipo === 'entrada') {
    radioEntrada.checked = true;
  } else {
    radioSaida.checked = true;
  }
}
function onSubmit(event: Event) {
  event.preventDefault();
  const id = getRegistroIdParaEditar();
  const valueDescription = description.value;
  const valor = Number(value.value);
  const date = data.value;
  const regexDate = /^\d{4}-\d{2}-\d{2}$/;
  if (
    valueDescription.length < 1 ||
    isNaN(valor) ||
    valor <= 0 ||
    !regexDate.test(date)
  ) {
    showNotification(
      'Você precisa preencher todos os campos com valores válidos.',
      'error',
    );
    return;
  }
  if (id !== null) {
    const index = registros.findIndex((registro) => registro.id === id);
    if (index !== -1) {
      registros[index]!.descricao = valueDescription;
      registros[index]!.valor = valor;
      registros[index]!.data = date;
      registros[index]!.tipo = tipoTransacao;
      localStorage.setItem('registros', JSON.stringify(registros));
    }
    showNotification('Registro editado com sucesso.', 'success');
    setRegistroIdParaEditar(null);
  } else {
    const newObject: Registro = {
      id: Date.now().toString(),
      descricao: valueDescription,
      valor: valor,
      data: date,
      tipo: tipoTransacao,
    };
    showNotification('Registro adicionado com sucesso.', 'success');
    addRegister(newObject);
  }
  renderizarTabela(table, registros);
  atualizarTotal(totalRegistro, valorEntradas, valorSaidas, saldoFinal);
  closeModal();
}

function init() {
  loadRegister();
  renderizarTabela(table, registros);
  atualizarTotal(totalRegistro, valorEntradas, valorSaidas, saldoFinal);
  removerRegistro();
  editarRegistro();
}

btnEntrada?.addEventListener('click', () => {
  setTipoTransacao('entrada');
  openModal();
});
btnSaida?.addEventListener('click', () => {
  setTipoTransacao('saida');
  openModal();
});
submit?.addEventListener('submit', onSubmit);
btnFechar?.addEventListener('click', closeModal);
registrarEntrada?.addEventListener('click', () => {
  setTipoTransacao('entrada');
  openModal();
});
registrarSaida?.addEventListener('click', () => {
  setTipoTransacao('saida');
  openModal();
});
searchInput?.addEventListener('keyup', () => {
  const searchValue = searchInput.value.toLowerCase();
  const filtered = registros.filter((registro) => {
    return registro.descricao.toLowerCase().includes(searchValue);
  });
  renderizarTabela(table, filtered);
});
function applyFilter() {
  const searchValue = searchInput.value.toLowerCase();
  if (activeFilter === 'todos') {
    const filtered = registros
      .filter((registro) => {
        return registro.descricao.toLowerCase().includes(searchValue);
      })
      .filter(() => {
        return true;
      });
    renderizarTabela(table, filtered);
  } else if (activeFilter === 'entrada') {
    const filtered = registros
      .filter((registro) => {
        return registro.descricao.toLowerCase().includes(searchValue);
      })
      .filter((tipo) => {
        return tipo.tipo === 'entrada';
      });
    renderizarTabela(table, filtered);
  } else {
    const filtered = registros
      .filter((registro) => {
        return registro.descricao.toLowerCase().includes(searchValue);
      })
      .filter((tipo) => {
        return tipo.tipo === 'saida';
      });
    renderizarTabela(table, filtered);
  }
}
filterContainer?.addEventListener('click', (event) => {
  const botao = <HTMLElement>event.target;
  btnFilterAll.classList.remove('active');
  btnFilterEntrada.classList.remove('active');
  btnFilterSaida.classList.remove('active');
  if (botao.id === 'filter-all') {
    activeFilter = 'todos';
    btnFilterAll.classList.add('active');
  } else if (botao.id === 'filter-entrada') {
    activeFilter = 'entrada';
    btnFilterEntrada.classList.add('active');
  } else {
    activeFilter = 'saida';
    btnFilterSaida.classList.add('active');
  }
  applyFilter();
});
init();
