class ExportManager {
    constructor() {
        this.worker = null;
    }

    /**
     * Export tasks using the Web Worker
     * @param {Object[]} tasks 
     * @param {string} format 'json' or 'csv'
     * @returns {Promise<string>}
     */
    async exportTasks(tasks, format = 'json') {
        return new Promise((resolve, reject) => {
            if (!this.worker) {
                this.worker = new Worker(new URL('./workers/exportWorker.js', import.meta.url));
            }

            this.worker.onmessage = (e) => {
                if (e.data.success) {
                    resolve(e.data.data);
                } else {
                    reject(new Error(e.data.error));
                }
            };

            this.worker.onerror = (err) => {
                reject(err);
            };

            this.worker.postMessage({ tasks, format });
        });
    }

    /**
     * Trigger a file download in the browser
     * @param {string} content 
     * @param {string} filename 
     * @param {string} contentType 
     */
    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}

const exportManager = new ExportManager();
export { exportManager as default };

