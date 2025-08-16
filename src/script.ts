import { openModal, closeModal } from "./modal.js";
import type { Registro } from "./data.js";
import { addRegister, loadRegister, removerRegistroPorId } from "./data.js";
import { atualizarTotal, removerRegistro, renderizarTabela } from "./ui.js";

const description = document.getElementById('descricao');
const value = document.getElementById('valor');
const data = document.getElementById('data');
const table = document.getElementById('tabela-registros') as HTMLTableElement;
export const totalRegistro = document.getElementById('total-registros');
export const valorEntradas = document.getElementById('valor-entradas');
export const valorSaidas = document.getElementById('valor-saidas');
export const saldoFinal = document.getElementById('saldo-final');
const submit = document.getElementById('form-registro');
const btnEntrada = document.getElementById('btn-entrada');
const btnSaida = document.getElementById('btn-saida');
const btnFechar = document.getElementById('btn-fechar-modal');

let tipoTransacao: 'entrada' | 'saida' = 'entrada';

function onSubmit(event: Event) {
  event.preventDefault();
  if (
        description instanceof HTMLInputElement &&
        value instanceof HTMLInputElement &&
        data instanceof HTMLInputElement
    ) {
        const valueDescription = description.value;
        const valor = Number(value.value);
        const date = data.value;

        const newObject: Registro = {
            id: Date.now().toString(),
            descricao: valueDescription,
            valor: valor,
            data: date,
            tipo: tipoTransacao,
        };
        addRegister(newObject);
        renderizarTabela(table);
        atualizarTotal(totalRegistro, valorEntradas, valorSaidas, saldoFinal);
        closeModal();
    }

}

function init() {
  loadRegister();
  renderizarTabela(table);
  atualizarTotal(totalRegistro, valorEntradas, valorSaidas, saldoFinal);
  removerRegistro();
}

btnEntrada?.addEventListener('click', () => {
  tipoTransacao = 'entrada';
  openModal();
});
btnSaida?.addEventListener('click', () => {
  tipoTransacao = 'saida';
  openModal();
});
submit?.addEventListener('submit', onSubmit);
btnFechar?.addEventListener('click', closeModal);

init();