export interface Registro {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  tipo: 'entrada' | 'saida';
}
export let registros: Registro[] = [];

export function loadRegister() {
  const dados = localStorage.getItem('registros');
  if(dados) {
    registros = JSON.parse(dados);
  }
}
export function addRegister(novoRegistro: Registro) {
  registros.push(novoRegistro);
  localStorage.setItem('registros', JSON.stringify(registros))
}
export function removerRegistroPorId(id: string) {
  registros = registros.filter((item) => item.id !== id);
  localStorage.setItem('registros', JSON.stringify(registros));
}