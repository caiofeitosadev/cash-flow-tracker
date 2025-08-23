export function openModal() {
  const modal = document.getElementById('modal-wrapper') as HTMLElement;
  const modalChildren = document.getElementById('modal') as HTMLElement;
  if (modal) {
    modal.classList.add('active');
  }
  modal.addEventListener('click', (event) => {
    if (event.target !== modalChildren) {
      closeModal(modal);
    }
  });
}
export function closeModal(modalElement: HTMLElement) {
  modalElement.classList.remove('active');
}
