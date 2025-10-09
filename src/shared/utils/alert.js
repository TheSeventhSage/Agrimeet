// Alert utility functions for success and error messages
export const showAlert = (message, type = 'info', duration = 5000) => {
    // Remove any existing alerts
    // Extract message from error objects
    const getDisplayMessage = (msg) => {
        if (typeof msg === 'string') return msg;
        if (msg?.message) return msg.message;
        if (msg?.error) return msg.error;
        if (typeof msg === 'object') {
            // Try to extract first error message from object
            const firstError = Object.values(msg)[0];
            return Array.isArray(firstError) ? firstError[0] : firstError;
        }
        return 'An unexpected error occurred';
    };

    const displayMessage = getDisplayMessage(message);

    // Rest of your existing showAlert function remains the same...
    const existingAlert = document.getElementById('alert-container');
    if (existingAlert) existingAlert.remove();

    // Create alert container
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    alertContainer.className = 'fixed top-4 right-4 z-50 max-w-sm';

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `p-4 rounded-lg shadow-lg border-l-4 flex items-center gap-3 ${type === 'success'
        ? 'bg-green-50 border-green-500 text-green-800'
        : type === 'error'
            ? 'bg-red-50 border-red-500 text-red-800'
            : type === 'warning'
                ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
                : 'bg-blue-50 border-blue-500 text-blue-800'
        }`;

    // Create icon based on type
    const icon = document.createElement('div');
    icon.className = 'shrink-0';
    icon.innerHTML = type === 'success'
        ? '✓'
        : type === 'error'
            ? '✕'
            : type === 'warning'
                ? '⚠'
                : 'ℹ';

    // Create message
    const messageEl = document.createElement('div');
    messageEl.className = 'flex-1';
    messageEl.textContent = message;

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'shrink-0 text-gray-400 hover:text-gray-600';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => alertContainer.remove();

    // Assemble alert
    alert.appendChild(icon);
    alert.appendChild(messageEl);
    alert.appendChild(closeBtn);
    alertContainer.appendChild(alert);

    // Add to DOM
    document.body.appendChild(alertContainer);

    // Auto remove after duration
    setTimeout(() => {
        if (alertContainer.parentNode) {
            alertContainer.remove();
        }
    }, duration);
};

// Convenience functions
export const showSuccess = (message, duration) => showAlert(message, 'success', duration);
export const showError = (message, duration) => showAlert(message, 'error', duration);
export const showWarning = (message, duration) => showAlert(message, 'warning', duration);
export const showInfo = (message, duration) => showAlert(message, 'info', duration);
