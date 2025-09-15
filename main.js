const dlg = document.getElementById('contactDialog');
const successDlg = document.getElementById('successDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const closeSuccessBtn = document.getElementById('closeSuccessDialog');
const form = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendLetter')
let lastActive = null;


openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal(); // модальный режим + затемнение
    dlg.querySelector('input,select,textarea,button')?.focus();
});

closeBtn.addEventListener('click', () => dlg.close('cancel'));

closeSuccessBtn.addEventListener('click', () => {
    successDlg.close();
    lastActive?.focus();
});

form?.addEventListener('submit', (e) => {
    // 1) Сброс кастомных сообщений
    [...form.elements].forEach(el => el.setCustomValidity?.(''));
    // 2) Проверка встроенных ограничений
    if (!form.checkValidity()) {
        e.preventDefault();
        // Пример: таргетированное сообщение
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }
        form.reportValidity(); // показать браузерные подсказки
        // A11y: подсветка проблемных полей
        [...form.elements].forEach(el => {
            if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity())
        });
        return;
    }
    // 3) Успешная «отправка» (без сервера)
    e.preventDefault();
    dlg.close('success');
    setTimeout(() => {
        successDlg.showModal();
    }, 300);
    form.reset();
});

dlg.addEventListener('close', () => { 
    if (dlg.returnValue === 'success') {
        // Если форма отправлена успешно, не возвращаем фокус
        return;
    }
    lastActive?.focus(); 
});
// Esc по умолчанию вызывает событие 'cancel' и закрывает <dialog>