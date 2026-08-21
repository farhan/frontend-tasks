// Web Worker for handling heavy data exports
self.onmessage = function(e) {
    const { tasks, format } = e.data;

    console.log(`[Worker] Starting export of ${tasks.length} tasks in ${format} format...`);

    try {
        let result;
        if (format === 'json') {
            result = JSON.stringify(tasks, null, 2);
        } else if (format === 'csv') {
            result = convertToCSV(tasks);
        }

        // Simulate heavy processing
        const startTime = Date.now();
        while (Date.now() - startTime < 500) { /* busy wait */ }

        self.postMessage({ success: true, data: result });
    } catch (error) {
        self.postMessage({ success: false, error: error.message });
    }
};

function convertToCSV(tasks) {
    if (tasks.length === 0) return '';
    const headers = Object.keys(tasks[0]).join(',');
    const rows = tasks.map(task => {
        return Object.values(task).map(val => {
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
        }).join(',');
    });
    return [headers, ...rows].join('\n');
}

