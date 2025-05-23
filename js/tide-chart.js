/**
 * Tide Chart Widget
 * Creates a 7-day tide forecast chart using Chart.js and NOAA CO-OPS API
 */

class TideChart {
    constructor() {
        this.stationId = '8413320'; // Bar Harbor, ME
        this.baseUrl = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
        this.corsProxy = ''; // Try direct API call first
        this.chart = null;
        this.init();
    }

    init() {
        // Wait a moment for Chart.js to load if needed
        if (typeof Chart === 'undefined') {
            console.log('Chart.js not yet loaded, waiting...');
            setTimeout(() => {
                if (typeof Chart === 'undefined') {
                    console.error('Chart.js failed to load');
                    this.showSimpleFallback();
                } else {
                    console.log('Chart.js loaded, fetching tide data...');
                    this.fetchWeeklyTideData();
                }
            }, 1000);
        } else {
            console.log('Chart.js already available');
            this.fetchWeeklyTideData();
        }
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

            const url = this.corsProxy ? 
                `${this.corsProxy}${encodeURIComponent(this.baseUrl + '?' + params)}` :
                `${this.baseUrl}?${params}`;
            
            console.log('Fetching tide data from:', url);
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Failed to fetch weekly tide data');
            
            const data = await response.json();
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
            this.showFallbackChart();
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

        const canvas = document.getElementById('tideChart');
        if (!canvas) {
            console.error('Tide chart canvas not found');
            return;
        }
        
        console.log('Creating chart with', chartData.labels.length, 'data points');

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

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Tide Height',
                    data: chartData.heights,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    pointBackgroundColor: (context) => {
                        if (!context || !predictions[context.dataIndex]) return '#3b82f6';
                        const prediction = predictions[context.dataIndex];
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
                                const prediction = predictions[context[0].dataIndex];
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
                                const prediction = predictions[context.dataIndex];
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
        window.tideChartInstance = new TideChart();
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