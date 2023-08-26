
//targets the ".phoneNumber" class

document.addEventListener('DOMContentLoaded', () => {
    const phoneInputs = document.querySelectorAll('.phoneNumber');

    phoneInputs.forEach(phoneInput => {
        phoneInput.addEventListener('input', () => {
            const value = phoneInput.value.replace(/\D/g, ''); // Remove non-numeric characters
            const formattedValue = formatPhoneNumber(value);
            phoneInput.value = formattedValue
        });
    });

    function formatPhoneNumber(value) {
        const match = value.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            const formattedValue = (match[1] ? `(${match[1]}` : '') +
                (match[2] ? `) ${match[2]}` : '') +
                (match[3] ? `-${match[3]}` : '');
            return formattedValue;
        }
        return value;
    }
});




