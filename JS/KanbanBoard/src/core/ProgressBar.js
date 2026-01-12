class ProgressBar {
    constructor() {
        this.spinner = document.getElementById('global-spinner');
    }

    show() {
        if (this.spinner) {
            this.spinner.classList.remove('hidden');
        }
    }

    hide() {
        if (this.spinner) {
            this.spinner.classList.add('hidden');
        }
    }
}

export const progressBar = new ProgressBar();


