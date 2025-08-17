export function openModal() {
  const modal = document.getElementById('modal-wrapper');
  if (modal) {
    modal.classList.add('active');
  }
}

export function closeModal(modalElement: HTMLElement) {
  modalElement.classList.remove('active');
}
