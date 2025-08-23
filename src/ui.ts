import { registros, removerRegistroPorId, type Registro } from './data.js';
import formatDate from './formatDate.js';
import { openModal } from './modal.js';
import {
  data,
  description,
  saldoFinal,
  setTipoTransacao,
  totalRegistro,
  valorEntradas,
  valorSaidas,
  value,
} from './script.js';

let registroIdParaEditar: string | null = null;
export let registroIdParaDeletar: string | null = null;
export function setRegistroIdParaEditar(id: string | null) {
  registroIdParaEditar = id;
}
export function getRegistroIdParaEditar() {
  return registroIdParaEditar;
}

export function atualizarTotal(
  totalRegistro: HTMLElement | null,
  valorEntradas: HTMLElement | null,
  valorSaidas: HTMLElement | null,
  saldoFinal: HTMLElement | null,
) {
  let totalEntradas = 0;
  let totalSaidas = 0;
  let saldo = 0;

  registros.forEach((registro) => {
    if (registro.tipo === 'entrada') {
      totalEntradas += registro.valor;
    } else {
      totalSaidas += registro.valor;
    }
  });

  const registroTotal = registros.length;
  saldo = totalEntradas - totalSaidas;

  if (totalRegistro) totalRegistro.textContent = registroTotal.toString();
  if (valorEntradas)
    valorEntradas.textContent = totalEntradas.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  if (valorSaidas)
    valorSaidas.textContent = totalSaidas.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  if (saldoFinal)
    saldoFinal.textContent = saldo.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
}

export function renderizarTabela(
  table: HTMLTableElement | null,
  listaDeRegistros: Registro[],
) {
  if (table) {
    table.innerHTML = '';
    let tabela = '';
    listaDeRegistros.forEach((registro) => {
      tabela += `
        <tr>
          <td>${registro.id}</td>
          <td>${registro.descricao}</td>
          <td>${registro.valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}</td>
          <td>${formatDate(registro.data)}</td>
          <td>
            <span class="badge badge-${registro.tipo}">${registro.tipo}</span>
          </td>
          <td>
            <button class="btn-excluir" data-id="${
              registro.id
            }">Excluir</button>
            <button class="btn-editar" data-id="${registro.id}">Editar</button>
          </td>
        </tr>
      `;
    });
    table.innerHTML = tabela;
  }
}
export function editarRegistro() {
  const descricaoInput = document.querySelector(
    '#descricao',
  ) as HTMLInputElement;
  const valorInput = document.querySelector('#valor') as HTMLInputElement;
  const dataInput = document.querySelector('#data') as HTMLInputElement;
  const table = document.querySelector('table');
  if (table) {
    table.addEventListener('click', (event) => {
      const target = <HTMLElement>event.target;
      if (target.classList.contains('btn-editar')) {
        const id = target.getAttribute('data-id');
        if (id) {
          setRegistroIdParaEditar(id);
          const registroEditar = registros.find(
            (registro) => registro.id === id,
          );
          if (registroEditar && descricaoInput && valorInput && dataInput) {
            descricaoInput.value = registroEditar.descricao;
            valorInput.value = registroEditar.valor.toString();
            dataInput.value = registroEditar.data;
            setTipoTransacao(registroEditar.tipo);
            openModal();
          }
        }
      }
    });
  }
}
export function removerRegistro() {
  const modalDelete = document.getElementById('delete-modal');
  const table = document.querySelector('table');
  table?.addEventListener('click', (event) => {
    const target = <HTMLElement>event.target;
    if (target.classList.contains('btn-excluir')) {
      const id = target.getAttribute('data-id');
      if (id) {
        modalDelete?.classList.add('active');
        registroIdParaDeletar = id;
      }
    }
  });
}
export function limparInputs() {
  const descricaoInput = document.querySelector(
    '#descricao',
  ) as HTMLInputElement;
  const valorInput = document.querySelector('#valor') as HTMLInputElement;
  const dataInput = document.querySelector('#data') as HTMLInputElement;
  descricaoInput.value = '';
  valorInput.value = '';
  dataInput.value = '';
}
export function showNotification(mensagem: string, type: 'success' | 'error') {
  const element = document.getElementById('notificacao');
  if (element) {
    element.textContent = '';
    element.className = 'notificacao';
    element.textContent = mensagem;
    element.classList.add(type);
    element.classList.add('show');
    setTimeout(() => {
      element.classList.remove('show');
      element.classList.remove(type);
    }, 3000);
  }
}
