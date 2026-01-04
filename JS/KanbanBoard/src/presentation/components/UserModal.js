export class UserModal {
    constructor(user) {
        this.user = user;
    }

    render() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay fixed inset-0 flex items-center justify-center p-4 z-[200] pointer-events-auto';
        
        overlay.innerHTML = `
            <div class="modal-content bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-slide-up">
                <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 class="text-lg font-bold text-gray-800">Account Details</h2>
                    <button class="close-modal text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div class="p-8 flex flex-col items-center">
                    <img src="${this.user.profileIcon}" alt="Profile" class="w-24 h-24 rounded-full border-4 border-blue-50 shadow-md mb-4">
                    <h3 class="text-xl font-bold text-gray-800">${this.user.name}</h3>
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase mt-1">
                        ${this.user.role}
                    </span>

                    <div class="w-full mt-8 space-y-4 text-sm">
                        <div class="flex justify-between items-center py-2 border-b border-gray-50">
                            <span class="text-gray-500 font-medium">Email</span>
                            <span class="text-gray-800 font-semibold">${this.user.email}</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-gray-50">
                            <span class="text-gray-500 font-medium">Language</span>
                            <span class="text-gray-800 font-semibold uppercase">${this.user.language}</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                            <span class="text-gray-500 font-medium">User ID</span>
                            <span class="text-gray-400 font-mono text-[10px]">${this.user.id}</span>
                        </div>
                    </div>
                </div>

                <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button class="close-modal px-6 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-gray-900 transition-colors shadow-sm">
                        Close
                    </button>
                </div>
            </div>
        `;

        const close = () => {
            overlay.classList.add('opacity-0');
            overlay.querySelector('.modal-content').classList.add('translate-y-4');
            setTimeout(() => overlay.remove(), 200);
        };

        overlay.querySelectorAll('.close-modal').forEach(b => b.onclick = close);
        overlay.onclick = (e) => { if (e.target === overlay) close(); };

        return overlay;
    }
}

