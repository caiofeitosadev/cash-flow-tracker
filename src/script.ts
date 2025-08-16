import { openModal, closeModal } from "./modal.js";
import type { Registro } from "./data.js";
import { registros } from "./data.js";
import { getRegistroIdParaEditar } from "./ui.js";
import { addRegister, loadRegister } from "./data.js";
import { atualizarTotal, editarRegistro, removerRegistro, renderizarTabela, setRegistroIdParaEditar } from "./ui.js";

const description = document.getElementById('descricao') as HTMLInputElement;
const value = document.getElementById('valor') as HTMLInputElement;
const data = document.getElementById('data') as HTMLInputElement;
const table = document.getElementById('tabela-registros') as HTMLTableElement;
export const totalRegistro = document.getElementById('total-registros');
export const valorEntradas = document.getElementById('valor-entradas');
export const valorSaidas = document.getElementById('valor-saidas');
export const saldoFinal = document.getElementById('saldo-final');
const submit = document.getElementById('form-registro');
const btnEntrada = document.getElementById('tipo-entrada') as HTMLInputElement;
const btnSaida = document.getElementById('tipo-saida')  as HTMLInputElement;
const btnFechar = document.getElementById('btn-fechar-modal');


let tipoTransacao: 'entrada' | 'saida' = 'entrada';
export function setTipoTransacao(tipo: 'entrada' | 'saida') {
    tipoTransacao = tipo;
}
function onSubmit(event: Event) {
    event.preventDefault();
    const id = getRegistroIdParaEditar();
    const valueDescription = (description as HTMLInputElement)?.value;
    const valor = Number((value as HTMLInputElement)?.value);
    const date = (data as HTMLInputElement)?.value;
    if (id !== null) {
        const index = registros.findIndex((registro) => registro.id === id);
        if (index !== -1 && valueDescription && valor && date) {
          registros[index]!.descricao = valueDescription;
          registros[index]!.valor = valor;
          registros[index]!.data = date;
          registros[index]!.tipo = tipoTransacao;
          localStorage.setItem('registros', JSON.stringify(registros));
        }
        
        setRegistroIdParaEditar(null);
    } else {
        if (valueDescription && valor && date) {
            const newObject: Registro = {
                id: Date.now().toString(),
                descricao: valueDescription,
                valor: valor,
                data: date,
                tipo: tipoTransacao,
            };
            addRegister(newObject);
        }
    }

    renderizarTabela(table);
    atualizarTotal(totalRegistro, valorEntradas, valorSaidas, saldoFinal);
    closeModal();
}


function init() {
  loadRegister();
  renderizarTabela(table);
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

init();