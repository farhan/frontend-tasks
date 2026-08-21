export class Toast {
    /**
     * Show a toast message
     * @param {string} title 
     * @param {string} body 
     * @param {string} type 'success' | 'error' | 'info' | 'warning'
     */
    static show(title, body, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `pointer-events-auto w-80 p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 translate-x-full opacity-0 ${this.getTypeStyles(type)}`;
        
        toast.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h4 class="text-sm font-bold text-gray-800">${title}</h4>
                    <p class="text-xs text-gray-600 mt-1">${body}</p>
                </div>
                <button class="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        });

        const closeBtn = toast.querySelector('button');
        const remove = () => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        };

        closeBtn.onclick = remove;
        setTimeout(remove, 5000);
    }

    static getTypeStyles(type) {
        switch (type) {
            case 'success': return 'bg-white border-green-500';
            case 'error': return 'bg-white border-red-500';
            case 'warning': return 'bg-white border-yellow-500';
            default: return 'bg-white border-blue-500';
        }
    }
}


