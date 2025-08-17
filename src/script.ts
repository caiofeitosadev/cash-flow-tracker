import { openModal, closeModal } from './modal.js';
import type { Registro } from './data.js';
import {
  addRegister,
  loadRegister,
  registros,
  removerRegistroPorId,
} from './data.js';
import {
  atualizarTotal,
  editarRegistro,
  removerRegistro,
  renderizarTabela,
  setRegistroIdParaEditar,
  getRegistroIdParaEditar,
  registroIdParaDeletar,
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
const modal = document.getElementById('modal-wrapper') as HTMLElement;
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
const startDateInput = document.getElementById(
  'start-date',
) as HTMLInputElement;
const endDateInput = document.getElementById('end-date') as HTMLInputElement;
const modalDelete = document.getElementById('delete-modal') as HTMLElement;
const buttonCancelDelete = document.getElementById(
  'cancel-delete',
) as HTMLButtonElement;
const buttonConfirmDelete = document.getElementById(
  'confirm-delete',
) as HTMLButtonElement;

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
  closeModal(modal);
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
btnFechar?.addEventListener('click', () => {
  closeModal(modal);
});
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
function applyFilter(): void {
  const searchValue = searchInput.value.toLowerCase();
  const startDate = startDateInput.value
    ? new Date(startDateInput.value)
    : null;
  const endDate = endDateInput.value ? new Date(endDateInput.value) : null;

  const filtered = registros.filter((registro) => {
    const matchesSearch = registro.descricao
      .toLowerCase()
      .includes(searchValue);

    const matchesType =
      activeFilter === 'todos' || registro.tipo === activeFilter;

    const registroDate = new Date(registro.data);
    const afterStartDate = !startDate || registroDate >= startDate;
    const beforeEndDate = !endDate || registroDate <= endDate;
    const matchesDate = afterStartDate && beforeEndDate;
    return matchesSearch && matchesType && matchesDate;
  });

  renderizarTabela(table, filtered);
  atualizarTotal(totalRegistro, valorEntradas, valorSaidas, saldoFinal);
}
filterContainer.addEventListener('click', (event) => {
  if (event.target instanceof HTMLButtonElement) {
    const botao = event.target;
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
  }
  applyFilter();
});
buttonConfirmDelete.addEventListener('click', () => {
  if (registroIdParaDeletar) {
    removerRegistroPorId(registroIdParaDeletar);
    renderizarTabela(table, registros);
    atualizarTotal(totalRegistro, valorEntradas, valorSaidas, saldoFinal);
    showNotification('O registro foi excluído com sucesso!', 'success');
    closeModal(modalDelete);
  }
});
buttonCancelDelete.addEventListener('click', () => {
  closeModal(modalDelete);
});
init();
