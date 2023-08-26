
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


// Exapnd text area as user types

const expandableTextareas = document.querySelectorAll('.expandable-textarea');

expandableTextareas.forEach(textarea => {
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});


// Helper function to format currency
function formatCurrency(amount) {
    return '$' + formatNumberWithCommas(amount.toFixed(2));
}

// Function to format number with commas
function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}




