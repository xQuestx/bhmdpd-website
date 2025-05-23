/**
 * Harbor Conditions API Integration
 * Fetches real-time data from NOAA CO-OPS API for Bar Harbor, ME (Station 8413320)
 */

class HarborConditions {
    constructor() {
        this.stationId = '8413320'; // Bar Harbor, ME
        this.baseUrl = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
        this.corsProxy = 'https://api.allorigins.win/raw?url=';
        this.updateInterval = 10 * 60 * 1000; // 10 minutes
        this.fallbackData = this.getFallbackData();
        this.consecutiveErrors = 0;
        this.maxRetries = 3;
        this.init();
    }

    getFallbackData() {
        return {
            visibility: { description: 'Good', visibility: '8.0 nm' },
            wind: { description: 'Light', speed: '8 mph', direction: 'SW' },
            waterLevel: { description: 'Normal', level: '2.1 ft' },
            tide: { nextTide: 'High Tide', time: '3:15 PM', height: '11.2 ft' }
        };
    }

    init() {
        this.fetchAllData();
        // Update every 10 minutes
        setInterval(() => this.fetchAllData(), this.updateInterval);
    }

    async fetchAllData() {
        this.showLoadingState();

        try {
            const [tideData, windData, visibilityData, waterLevelData] = await Promise.allSettled([
                this.fetchTidePredictions(),
                this.fetchWindData(),
                this.fetchVisibilityData(),
                this.fetchWaterLevel()
            ]);

            const hasValidData = [tideData, windData, visibilityData, waterLevelData].some(
                result => result.status === 'fulfilled' && result.value
            );

            if (hasValidData) {
                this.consecutiveErrors = 0;
                this.updateConditionsDisplay({
                    tide: tideData.status === 'fulfilled' ? tideData.value : this.fallbackData.tide,
                    wind: windData.status === 'fulfilled' ? windData.value : this.fallbackData.wind,
                    visibility: visibilityData.status === 'fulfilled' ? visibilityData.value : this.fallbackData.visibility,
                    waterLevel: waterLevelData.status === 'fulfilled' ? waterLevelData.value : this.fallbackData.waterLevel
                }, hasValidData);
            } else {
                throw new Error('No valid data received from any source');
            }

        } catch (error) {
            console.error('Error fetching harbor conditions:', error);
            this.consecutiveErrors++;
            
            if (this.consecutiveErrors >= this.maxRetries) {
                this.showFallbackData();
            } else {
                this.showErrorState();
                // Retry after a shorter interval
                setTimeout(() => this.fetchAllData(), 30000); // 30 seconds
            }
        } finally {
            this.hideLoadingState();
        }
    }

    showLoadingState() {
        const conditionItems = document.querySelectorAll('.condition-item');
        conditionItems.forEach(item => item.classList.add('loading'));
    }

    hideLoadingState() {
        const conditionItems = document.querySelectorAll('.condition-item');
        conditionItems.forEach(item => item.classList.remove('loading'));
    }

    showFallbackData() {
        console.log('Using fallback data due to API failures');
        this.updateConditionsDisplay(this.fallbackData, false);
        
        // Update conditions note to indicate fallback
        const conditionsNote = document.querySelector('.conditions-note p');
        if (conditionsNote) {
            conditionsNote.textContent = 'Live data temporarily unavailable. Showing representative conditions. Contact Harbor Master office at 207-288-5571 for current information.';
        }
    }

    async fetchTidePredictions() {
        const params = new URLSearchParams({
            date: 'today',
            station: this.stationId,
            product: 'predictions',
            datum: 'MLLW',
            time_zone: 'lst_ldt',
            interval: 'hilo',
            units: 'english',
            application: 'BHMDPD_Website',
            format: 'json'
        });

        const url = `${this.corsProxy}${encodeURIComponent(this.baseUrl + '?' + params)}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch tide data');
        
        const data = await response.json();
        return this.processTideData(data);
    }

    async fetchWindData() {
        const params = new URLSearchParams({
            date: 'latest',
            station: this.stationId,
            product: 'wind',
            time_zone: 'lst_ldt',
            units: 'english',
            application: 'BHMDPD_Website',
            format: 'json'
        });

        const url = `${this.corsProxy}${encodeURIComponent(this.baseUrl + '?' + params)}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch wind data');
        
        const data = await response.json();
        return this.processWindData(data);
    }

    async fetchVisibilityData() {
        const params = new URLSearchParams({
            date: 'latest',
            station: this.stationId,
            product: 'visibility',
            time_zone: 'lst_ldt',
            units: 'english',
            application: 'BHMDPD_Website',
            format: 'json'
        });

        const url = `${this.corsProxy}${encodeURIComponent(this.baseUrl + '?' + params)}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch visibility data');
        
        const data = await response.json();
        return this.processVisibilityData(data);
    }

    async fetchWaterLevel() {
        const params = new URLSearchParams({
            date: 'latest',
            station: this.stationId,
            product: 'water_level',
            datum: 'MLLW',
            time_zone: 'lst_ldt',
            units: 'english',
            application: 'BHMDPD_Website',
            format: 'json'
        });

        const url = `${this.corsProxy}${encodeURIComponent(this.baseUrl + '?' + params)}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch water level data');
        
        const data = await response.json();
        return this.processWaterLevelData(data);
    }

    processTideData(data) {
        if (!data.predictions || data.predictions.length === 0) {
            return { nextTide: 'Data unavailable', time: '' };
        }

        const now = new Date();
        const nextTide = data.predictions.find(prediction => {
            const predictionTime = new Date(prediction.t);
            return predictionTime > now;
        });

        if (nextTide) {
            const time = new Date(nextTide.t);
            const type = nextTide.type === 'H' ? 'High Tide' : 'Low Tide';
            const height = parseFloat(nextTide.v).toFixed(1);
            
            return {
                nextTide: type,
                time: time.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                }),
                height: `${height} ft`
            };
        }

        return { nextTide: 'No data', time: '', height: '' };
    }

    processWindData(data) {
        if (!data.data || data.data.length === 0) {
            return { speed: 'N/A', direction: 'N/A', description: 'No data' };
        }

        const latest = data.data[data.data.length - 1];
        const speed = parseFloat(latest.s);
        const direction = this.getWindDirection(parseFloat(latest.d));
        const description = this.getWindDescription(speed);

        return {
            speed: `${speed.toFixed(0)} mph`,
            direction: direction,
            description: description
        };
    }

    processVisibilityData(data) {
        if (!data.data || data.data.length === 0) {
            return { visibility: 'N/A', description: 'No data' };
        }

        const latest = data.data[data.data.length - 1];
        const visibility = parseFloat(latest.v);
        const description = this.getVisibilityDescription(visibility);

        return {
            visibility: `${visibility.toFixed(1)} nm`,
            description: description
        };
    }

    processWaterLevelData(data) {
        if (!data.data || data.data.length === 0) {
            return { level: 'N/A', description: 'No data' };
        }

        const latest = data.data[data.data.length - 1];
        const level = parseFloat(latest.v);
        const description = this.getWaterLevelDescription(level);

        return {
            level: `${level.toFixed(1)} ft`,
            description: description
        };
    }

    getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                           'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }

    getWindDescription(speed) {
        if (speed < 4) return 'Calm';
        if (speed < 11) return 'Light';
        if (speed < 22) return 'Moderate';
        if (speed < 34) return 'Strong';
        return 'Very Strong';
    }

    getVisibilityDescription(visibility) {
        if (visibility >= 10) return 'Excellent';
        if (visibility >= 5) return 'Good';
        if (visibility >= 2) return 'Fair';
        if (visibility >= 1) return 'Poor';
        return 'Very Poor';
    }

    getWaterLevelDescription(level) {
        if (level > 8) return 'Very High';
        if (level > 4) return 'High';
        if (level > -2) return 'Normal';
        if (level > -6) return 'Low';
        return 'Very Low';
    }

    updateConditionsDisplay(data, isLiveData = true) {
        // Update visibility
        if (data.visibility) {
            this.updateConditionItem('visibility', 'Visibility', 
                data.visibility.description, data.visibility.visibility);
        }

        // Update wind
        if (data.wind) {
            this.updateConditionItem('wind', 'Wind', 
                data.wind.description, 
                `${data.wind.speed} ${data.wind.direction}`);
        }

        // Update water level (sea state)
        if (data.waterLevel) {
            this.updateConditionItem('sea-state', 'Sea State', 
                data.waterLevel.description, data.waterLevel.level);
        }

        // Update next tide
        if (data.tide) {
            this.updateConditionItem('next-tide', 'Next Tide', 
                data.tide.nextTide, 
                data.tide.time + (data.tide.height ? ` (${data.tide.height})` : ''));
        }

        // Add last updated timestamp
        this.updateLastUpdated(isLiveData);
    }

    updateConditionItem(id, title, status, detail) {
        const conditionItems = document.querySelectorAll('.condition-item');
        
        conditionItems.forEach(item => {
            const titleElement = item.querySelector('h3');
            if (titleElement && titleElement.textContent.includes(title)) {
                const statusElement = item.querySelector('p');
                const detailElement = item.querySelector('.condition-detail');
                
                if (statusElement) statusElement.textContent = status;
                if (detailElement) detailElement.textContent = detail;
            }
        });
    }

    updateLastUpdated(isLiveData = true) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });

        // Update or create last updated element
        let lastUpdated = document.querySelector('.conditions-last-updated');
        if (!lastUpdated) {
            const conditionsNote = document.querySelector('.conditions-note');
            if (conditionsNote) {
                lastUpdated = document.createElement('div');
                lastUpdated.className = 'conditions-last-updated';
                conditionsNote.parentNode.insertBefore(lastUpdated, conditionsNote.nextSibling);
            }
        }
        
        if (lastUpdated) {
            const statusIcon = isLiveData ? 
                '<i class="fas fa-satellite-dish" style="color: #28a745;"></i>' : 
                '<i class="fas fa-exclamation-triangle" style="color: #ffc107;"></i>';
            const statusText = isLiveData ? 'Live data updated' : 'Fallback data shown';
            lastUpdated.innerHTML = `${statusIcon} ${statusText}: ${timeString}`;
        }
    }

    showErrorState() {
        const conditionItems = document.querySelectorAll('.condition-item');
        
        conditionItems.forEach(item => {
            const statusElement = item.querySelector('p');
            const detailElement = item.querySelector('.condition-detail');
            
            if (statusElement) statusElement.textContent = 'Unavailable';
            if (detailElement) detailElement.textContent = 'Data temporarily unavailable';
        });

        // Update conditions note to show error
        const conditionsNote = document.querySelector('.conditions-note p');
        if (conditionsNote) {
            conditionsNote.textContent = 'Real-time data is temporarily unavailable. Please check back later or contact the Harbor Master office.';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on harbor master page
    if (document.querySelector('.harbor-conditions')) {
        new HarborConditions();
    }
});