/**
 * Tide Chart Widget
 * Creates a 7-day tide forecast chart using Chart.js and NOAA CO-OPS API
 */

// Make TideChart available globally
window.TideChart = class TideChart {
    constructor() {
        this.stationId = '8413320'; // Bar Harbor, ME
        this.baseUrl = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
        this.corsProxy = 'https://api.allorigins.win/raw?url='; // CORS proxy for NOAA API
        this.chart = null;
        this.init();
    }

    init() {
        // Wait for Chart.js to load with multiple retries
        this.waitForChartJS();
    }
    
    waitForChartJS(retries = 0) {
        if (typeof Chart !== 'undefined') {
            console.log('Chart.js is available, fetching tide data...');
            this.fetchWeeklyTideData();
            return;
        }
        
        if (retries >= 10) { // Give up after 10 retries (5 seconds)
            console.error('Chart.js failed to load after multiple attempts');
            this.showSimpleFallback();
            return;
        }
        
        console.log(`Waiting for Chart.js... (attempt ${retries + 1})`);
        setTimeout(() => {
            this.waitForChartJS(retries + 1);
        }, 500);
    }

    async loadChartJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js';
            script.onload = () => {
                console.log('Chart.js loaded successfully');
                resolve();
            };
            script.onerror = (error) => {
                console.error('Failed to load Chart.js:', error);
                reject(error);
            };
            document.head.appendChild(script);
        });
    }

    async fetchWeeklyTideData() {
        try {
            // Get 7 days of tide predictions starting from today
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 7);
            
            const beginDate = new Date();
            
            const params = new URLSearchParams({
                begin_date: this.formatDate(beginDate),
                end_date: this.formatDate(endDate),
                station: this.stationId,
                product: 'predictions',
                datum: 'MLLW',
                time_zone: 'lst_ldt',
                interval: 'hilo',
                units: 'english',
                application: 'BHMDPD_Website',
                format: 'json'
            });

            let url;
            if (this.corsProxy) {
                // Different CORS proxies have different URL formats
                if (this.corsProxy.includes('allorigins')) {
                    url = `${this.corsProxy}${encodeURIComponent(this.baseUrl + '?' + params)}`;
                } else {
                    // For corsproxy.io and others, don't encode the URL
                    url = `${this.corsProxy}${this.baseUrl}?${params}`;
                }
            } else {
                url = `${this.baseUrl}?${params}`;
            }
            
            console.log('Fetching tide data from:', url);
            console.log('Request parameters:', params.toString());
            
            const response = await fetch(url);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const text = await response.text();
            console.log('Raw response:', text.substring(0, 200) + '...');
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error('Failed to parse JSON:', parseError);
                throw new Error('Invalid JSON response from API');
            }
            
            console.log('NOAA API Response:', data);
            
            // Check if we have valid predictions data
            if (!data || (!data.predictions && !data.data)) {
                console.warn('No predictions data in response, using fallback');
                this.showFallbackChart();
                return;
            }
            
            this.createTideChart(data);

        } catch (error) {
            console.error('Error fetching weekly tide data:', error);
            console.error('Error details:', error.message);
            
            // Try alternative CORS proxies
            if (!this.proxyAttempts) {
                this.proxyAttempts = 1;
            }
            
            const proxies = [
                'https://api.allorigins.win/raw?url=',
                'https://corsproxy.io/?',
                'https://cors-anywhere.herokuapp.com/',
                '' // Try direct connection as last resort
            ];
            
            if (this.proxyAttempts < proxies.length) {
                const nextProxy = proxies[this.proxyAttempts];
                console.log(`Trying proxy ${this.proxyAttempts + 1} of ${proxies.length}: ${nextProxy || 'direct connection'}`);
                this.corsProxy = nextProxy;
                this.proxyAttempts++;
                setTimeout(() => this.fetchWeeklyTideData(), 500); // Small delay before retry
            } else {
                console.log('All proxy attempts failed, showing fallback chart');
                this.showFallbackChart();
            }
        }
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }

    createTideChart(data) {
        // Handle both 'predictions' and 'data' response formats
        const predictions = data.predictions || data.data;
        
        if (!predictions || predictions.length === 0) {
            console.warn('No predictions array found or empty, using fallback');
            this.showFallbackChart();
            return;
        }

        console.log('Processing', predictions.length, 'tide predictions');
        const chartData = this.processChartData(predictions);
        
        if (!chartData.labels.length || !chartData.heights.length) {
            console.warn('No chart data processed, using fallback');
            this.showFallbackChart();
            return;
        }

        // Store data for later use
        this.chartData = chartData;
        this.predictions = predictions;
        
        // Populate the tide table
        this.populateTideTable(predictions);
        
        // Check if the tides tab is currently active
        const tidesTab = document.getElementById('tides');
        if (tidesTab && tidesTab.classList.contains('active')) {
            this.renderChart();
        } else {
            console.log('Tides tab not active, deferring chart render');
            // Chart will be rendered when tab is clicked
        }
    }
    
    renderChart() {
        if (!this.chartData || !this.predictions) {
            console.error('No chart data available');
            return;
        }
        
        const canvas = document.getElementById('tideChart');
        if (!canvas) {
            console.error('Tide chart canvas not found');
            return;
        }
        
        console.log('Creating chart with', this.chartData.labels.length, 'data points');
        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
        console.log('Canvas parent visible:', canvas.parentElement.offsetHeight > 0);

        const ctx = canvas.getContext('2d');

        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        
        // Clear any existing chart instances on this canvas
        Chart.getChart(canvas)?.destroy();

        if (typeof Chart === 'undefined') {
            console.error('Chart.js not loaded, using fallback');
            this.showFallbackChart();
            return;
        }

        // Force canvas to be visible and properly sized
        canvas.style.display = 'block';
        canvas.style.width = '100%';
        canvas.style.height = '400px';
        
        // Set canvas actual dimensions
        const container = canvas.parentElement;
        if (container) {
            canvas.width = container.offsetWidth || 800;
            canvas.height = 400;
        }
        
        // Create a small delay to ensure the canvas is rendered
        setTimeout(() => {
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: this.chartData.labels,
                    datasets: [{
                        label: 'Tide Height',
                        data: this.chartData.heights,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        pointBackgroundColor: (context) => {
                            if (!context || !this.predictions[context.dataIndex]) return '#3b82f6';
                            const prediction = this.predictions[context.dataIndex];
                            return prediction.type === 'H' ? '#3b82f6' : '#10b981';
                        },
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            title: (context) => {
                                const prediction = this.predictions[context[0].dataIndex];
                                const date = new Date(prediction.t);
                                return date.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                });
                            },
                            label: (context) => {
                                const prediction = this.predictions[context.dataIndex];
                                const type = prediction.type === 'H' ? 'High Tide' : 'Low Tide';
                                const height = parseFloat(prediction.v).toFixed(1);
                                return `${type}: ${height} ft`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date & Time',
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            maxRotation: 45,
                            maxTicksLimit: 10
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Height (feet above MLLW)',
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        },
                        beginAtZero: false,
                        min: -2,
                        max: 14
                    }
                }
            }
            });

            // Update chart for dark mode if needed
            this.updateChartForTheme();
            
            console.log('Chart created successfully:', this.chart);
        }, 100); // 100ms delay to ensure canvas is rendered
    }

    processChartData(predictions) {
        const labels = [];
        const heights = [];

        console.log('Sample prediction data:', predictions[0]);

        predictions.forEach((prediction, index) => {
            if (index < 3) console.log('Processing prediction', index, ':', prediction);
            
            // Handle different possible data formats
            const timeValue = prediction.t || prediction.time || prediction.date_time;
            const heightValue = prediction.v || prediction.value || prediction.height;
            
            if (!timeValue || !heightValue) {
                console.warn('Missing time or height data in prediction:', prediction);
                return;
            }
            
            const date = new Date(timeValue);
            if (isNaN(date.getTime())) {
                console.warn('Invalid date in prediction:', timeValue);
                return;
            }
            
            const shortLabel = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                hour12: true
            });
            
            labels.push(shortLabel);
            heights.push(parseFloat(heightValue));
        });

        console.log('Processed chart data:', { labelCount: labels.length, heightCount: heights.length });
        return { labels, heights };
    }

    showFallbackChart() {
        // Create a sample chart with representative data if API fails
        const fallbackData = this.generateFallbackData();
        
        const canvas = document.getElementById('tideChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Properly destroy existing chart and clear canvas
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        
        // Clear any existing chart instances on this canvas
        Chart.getChart(canvas)?.destroy();

        this.chart = new Chart(ctx, {
            type: 'line',
            data: fallbackData,
            options: this.getChartOptions()
        });

        // Show notice about fallback data
        this.showFallbackNotice();
        
        // Populate table with sample data
        this.populateFallbackTable();
    }

    generateFallbackData() {
        const labels = [];
        const heights = [];
        const now = new Date();

        // Generate sample tide data for 7 days
        for (let day = 0; day < 7; day++) {
            for (let tide = 0; tide < 4; tide++) { // 2 high, 2 low tides per day
                const date = new Date(now);
                date.setDate(date.getDate() + day);
                date.setHours(6 + (tide * 6), tide % 2 === 0 ? 15 : 45, 0, 0);

                const label = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    hour12: true
                });

                labels.push(label);
                
                // Alternate between high (10-12 ft) and low (0-2 ft) tides
                const isHigh = tide % 2 === 0;
                const height = isHigh ? 
                    10 + Math.random() * 2 : 
                    0.5 + Math.random() * 1.5;
                heights.push(height);
            }
        }

        return {
            labels,
            datasets: [{
                label: 'Tide Height (Sample Data)',
                data: heights,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                fill: true,
                tension: 0.4,
                borderWidth: 2
            }]
        };
    }

    getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date & Time',
                        font: { weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        maxRotation: 45,
                        maxTicksLimit: 10
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Height (feet above MLLW)',
                        font: { weight: 'bold' }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        drawBorder: false
                    },
                    beginAtZero: false,
                    min: -2,
                    max: 14
                }
            }
        };
    }

    showFallbackNotice() {
        const chartHeader = document.querySelector('.tide-chart-header p');
        if (chartHeader) {
            chartHeader.textContent = 'Sample tide data shown - Live data temporarily unavailable';
            chartHeader.style.color = '#ffc107';
        }
    }

    updateChartForTheme() {
        if (!this.chart) return;

        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#e0e0e0' : '#495057';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        this.chart.options.scales.x.title.color = textColor;
        this.chart.options.scales.y.title.color = textColor;
        this.chart.options.scales.x.ticks.color = textColor;
        this.chart.options.scales.y.ticks.color = textColor;
        this.chart.options.scales.x.grid.color = gridColor;
        this.chart.options.scales.y.grid.color = gridColor;

        this.chart.update('none');
    }
    
    refreshChart() {
        if (this.chart) {
            console.log('Refreshing tide chart...');
            this.chart.resize();
            this.chart.update();
        }
    }
    
    populateTideTable(predictions) {
        const tableBody = document.getElementById('tideTableBody');
        if (!tableBody) return;
        
        // Clear loading message
        tableBody.innerHTML = '';
        
        // Group predictions by date
        const tidesByDate = {};
        
        predictions.forEach(prediction => {
            const date = new Date(prediction.t);
            const dateKey = date.toLocaleDateString('en-US');
            
            if (!tidesByDate[dateKey]) {
                tidesByDate[dateKey] = {
                    date: date,
                    highTides: [],
                    lowTides: []
                };
            }
            
            const tideInfo = {
                time: date.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                }).replace(' ', ''),
                height: parseFloat(prediction.v).toFixed(1),
                isPM: date.getHours() >= 12
            };
            
            if (prediction.type === 'H') {
                tidesByDate[dateKey].highTides.push(tideInfo);
            } else {
                tidesByDate[dateKey].lowTides.push(tideInfo);
            }
        });
        
        // Create table rows
        Object.keys(tidesByDate).forEach(dateKey => {
            const dayData = tidesByDate[dateKey];
            const row = document.createElement('tr');
            
            // Date cell
            const dateCell = document.createElement('td');
            const dayName = dayData.date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = dayData.date.getDate();
            dateCell.innerHTML = `${dayNum} ${dayName}`;
            row.appendChild(dateCell);
            
            // High tide cells (AM and PM)
            const highAM = dayData.highTides.find(t => !t.isPM);
            const highPM = dayData.highTides.find(t => t.isPM);
            
            row.appendChild(this.createTideCell(highAM?.time || '-'));
            row.appendChild(this.createTideCell(highAM?.height || '-'));
            row.appendChild(this.createTideCell(highPM?.time || '-'));
            row.appendChild(this.createTideCell(highPM?.height || '-'));
            
            // Low tide cells (AM and PM)
            const lowAM = dayData.lowTides.find(t => !t.isPM);
            const lowPM = dayData.lowTides.find(t => t.isPM);
            
            row.appendChild(this.createTideCell(lowAM?.time || '-'));
            row.appendChild(this.createTideCell(lowAM?.height || '-'));
            row.appendChild(this.createTideCell(lowPM?.time || '-'));
            row.appendChild(this.createTideCell(lowPM?.height || '-'));
            
            tableBody.appendChild(row);
        });
    }
    
    createTideCell(content) {
        const cell = document.createElement('td');
        cell.textContent = content;
        return cell;
    }
    
    populateFallbackTable() {
        const tableBody = document.getElementById('tideTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // Sample tide data for demonstration
        const sampleData = [
            { date: 'Fri', highAM: '12:17AM', highAMft: '12.4', highPM: '-', highPMft: '-', lowAM: '6:08AM', lowAMft: '-1.5', lowPM: '6:29PM', lowPMft: '0.2' },
            { date: 'Sat', highAM: '12:39AM', highAMft: '13.0', highPM: '1:07PM', highPMft: '12.6', lowAM: '6:57AM', lowAMft: '-1.4', lowPM: '7:22PM', lowPMft: '0.1' },
            { date: 'Sun', highAM: '1:31AM', highAMft: '12.6', highPM: '1:57PM', highPMft: '12.5', lowAM: '7:47AM', lowAMft: '-1.0', lowPM: '8:16PM', lowPMft: '0.0' },
            { date: 'Mon', highAM: '2:25AM', highAMft: '12.0', highPM: '2:48PM', highPMft: '12.2', lowAM: '8:37AM', lowAMft: '-0.4', lowPM: '9:11PM', lowPMft: '0.1' },
            { date: 'Tue', highAM: '3:22AM', highAMft: '11.2', highPM: '3:41PM', highPMft: '11.8', lowAM: '9:29AM', lowAMft: '0.3', lowPM: '10:06PM', lowPMft: '0.3' }
        ];
        
        const now = new Date();
        sampleData.forEach((data, index) => {
            const row = document.createElement('tr');
            const futureDate = new Date(now);
            futureDate.setDate(now.getDate() + index);
            
            // Date cell
            const dateCell = document.createElement('td');
            dateCell.innerHTML = `${futureDate.getDate()} ${data.date}`;
            row.appendChild(dateCell);
            
            // Add tide data cells
            row.appendChild(this.createTideCell(data.highAM));
            row.appendChild(this.createTideCell(data.highAMft));
            row.appendChild(this.createTideCell(data.highPM));
            row.appendChild(this.createTideCell(data.highPMft));
            row.appendChild(this.createTideCell(data.lowAM));
            row.appendChild(this.createTideCell(data.lowAMft));
            row.appendChild(this.createTideCell(data.lowPM));
            row.appendChild(this.createTideCell(data.lowPMft));
            
            tableBody.appendChild(row);
        });
    }
    
    showSimpleFallback() {
        const canvas = document.getElementById('tideChart');
        if (!canvas) return;
        
        // Replace canvas with a simple text display
        const container = canvas.parentElement;
        const fallbackDiv = document.createElement('div');
        fallbackDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 8px; border: 2px dashed #dee2e6;">
                <i class="fas fa-chart-line" style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem; display: block;"></i>
                <h3 style="color: #495057; margin-bottom: 1rem;">Tide Forecast Currently Unavailable</h3>
                <p style="color: #6c757d; margin-bottom: 1rem;">We're experiencing technical difficulties loading the interactive tide chart.</p>
                <p style="color: #6c757d; margin: 0;"><strong>For current tide information, please contact the Harbor Master at 207-288-5571</strong></p>
            </div>
        `;
        
        container.innerHTML = '';
        container.appendChild(fallbackDiv);
        
        // Update header message
        const chartHeader = document.querySelector('.tide-chart-header p');
        if (chartHeader) {
            chartHeader.textContent = 'Chart temporarily unavailable - Contact Harbor Master for current conditions';
            chartHeader.style.color = '#dc3545';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on harbor master page
    if (document.querySelector('.tide-chart-section') && !window.tideChartInstance) {
        console.log('Initializing Tide Chart...');
        window.tideChartInstance = new window.TideChart();
        
        // If the tides tab is already active, make sure chart loads immediately
        const tidesTab = document.getElementById('tides');
        if (tidesTab && tidesTab.classList.contains('active')) {
            console.log('Tides tab is active on page load');
        }
    }
});

// Update chart theme when dark mode is toggled
document.addEventListener('click', (e) => {
    if (e.target.closest('#darkModeToggle')) {
        setTimeout(() => {
            const tideChart = window.tideChartInstance;
            if (tideChart) {
                tideChart.updateChartForTheme();
            }
        }, 100);
    }
});