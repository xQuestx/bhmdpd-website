/**
 * Harbor Conditions API Integration
 * Fetches real-time data from NOAA CO-OPS API for Bar Harbor, ME (Station 8413320)
 */

class HarborConditions {
    constructor() {
        this.stationId = '8413320'; // Bar Harbor, ME
        this.baseUrl = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
        this.updateInterval = 10 * 60 * 1000; // 10 minutes
        this.fallbackData = this.getFallbackData();
        this.consecutiveErrors = 0;
        this.maxRetries = 3;
        this.init();
    }

    getFallbackData() {
        return {
            wind: { description: 'Light', speed: '8 mph', direction: 'SW' },
            waterLevel: { description: 'Normal', level: '2.1 ft' },
            tide: { nextTide: 'High Tide', time: '3:15 PM', height: '11.2 ft' },
            tideRange: { description: 'Moderate', range: '10.8 ft range' },
            tidePhase: { description: 'Rising', timeToNext: '2 hrs to high' },
            todayTides: { description: '2 High / 2 Low', next: 'Next: High 3:15 PM' }
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
            const [tideData, windData, waterLevelData] = await Promise.allSettled([
                this.fetchTidePredictions(),
                this.fetchWindData(),
                this.fetchWaterLevel()
            ]);

            const hasValidData = [tideData, windData, waterLevelData].some(
                result => result.status === 'fulfilled' && result.value
            );

            if (hasValidData) {
                this.consecutiveErrors = 0;
                const processedTide = tideData.status === 'fulfilled' ? tideData.value : this.fallbackData.tide;
                
                this.updateConditionsDisplay({
                    tide: processedTide,
                    wind: windData.status === 'fulfilled' ? windData.value : this.fallbackData.wind,
                    waterLevel: waterLevelData.status === 'fulfilled' ? waterLevelData.value : this.fallbackData.waterLevel,
                    tideRange: this.calculateTideRange(processedTide),
                    tidePhase: this.calculateTidePhase(processedTide),
                    todayTides: this.calculateTodayTides(processedTide)
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
            application: 'BarHarborPD_Website',
            format: 'json'
        });

        const url = `${this.baseUrl}?${params}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch tide data');
        
        const data = await response.json();
        return this.processTideData(data);
    }

    async fetchWindData() {
        const params = new URLSearchParams({
            date: 'today',
            station: this.stationId,
            product: 'wind',
            time_zone: 'lst_ldt',
            units: 'english',
            application: 'BarHarborPD_Website',
            format: 'json'
        });

        const url = `${this.baseUrl}?${params}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch wind data');
        
        const data = await response.json();
        return this.processWindData(data);
    }

    calculateTideRange(tideData) {
        if (!tideData.allTides || tideData.allTides.length < 4) {
            return this.fallbackData.tideRange;
        }
        
        const today = new Date().toDateString();
        const todayTides = tideData.allTides.filter(tide => 
            new Date(tide.time).toDateString() === today
        );
        
        if (todayTides.length < 2) return this.fallbackData.tideRange;
        
        const heights = todayTides.map(tide => parseFloat(tide.height));
        const maxHeight = Math.max(...heights);
        const minHeight = Math.min(...heights);
        const range = maxHeight - minHeight;
        
        let description = 'Moderate';
        if (range > 12) description = 'Very Large';
        else if (range > 10) description = 'Large';
        else if (range < 8) description = 'Small';
        
        return {
            description: description,
            range: `${range.toFixed(1)} ft range`
        };
    }

    calculateTidePhase(tideData) {
        if (!tideData.nextTide || !tideData.currentLevel) {
            return this.fallbackData.tidePhase;
        }
        
        const now = new Date();
        const nextTideTime = new Date(tideData.nextTideTime || now.getTime() + 2*60*60*1000);
        const timeToNext = Math.round((nextTideTime - now) / (60 * 1000)); // minutes
        
        const isRising = tideData.nextTide === 'High Tide';
        const phase = isRising ? 'Rising' : 'Falling';
        
        const hours = Math.floor(timeToNext / 60);
        const minutes = timeToNext % 60;
        let timeString = '';
        
        if (hours > 0) {
            timeString = `${hours}h ${minutes}m to ${isRising ? 'high' : 'low'}`;
        } else {
            timeString = `${minutes}m to ${isRising ? 'high' : 'low'}`;
        }
        
        return {
            description: phase,
            timeToNext: timeString
        };
    }

    calculateTodayTides(tideData) {
        if (!tideData.allTides) {
            return this.fallbackData.todayTides;
        }
        
        const today = new Date().toDateString();
        const todayTides = tideData.allTides.filter(tide => 
            new Date(tide.time).toDateString() === today
        );
        
        const highTides = todayTides.filter(tide => tide.type === 'H').length;
        const lowTides = todayTides.filter(tide => tide.type === 'L').length;
        
        return {
            description: `${highTides} High / ${lowTides} Low`,
            next: `Next: ${tideData.nextTide} ${tideData.time}`
        };
    }

    async fetchWaterLevel() {
        const params = new URLSearchParams({
            date: 'today',
            station: this.stationId,
            product: 'water_level',
            datum: 'MLLW',
            time_zone: 'lst_ldt',
            units: 'english',
            application: 'BarHarborPD_Website',
            format: 'json'
        });

        const url = `${this.baseUrl}?${params}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch water level data');
        
        const data = await response.json();
        return this.processWaterLevelData(data);
    }

    processTideData(data) {
        if (!data.predictions || data.predictions.length === 0) {
            return { nextTide: 'Data unavailable', time: '', allTides: [] };
        }

        const now = new Date();
        const nextTide = data.predictions.find(prediction => {
            const predictionTime = new Date(prediction.t);
            return predictionTime > now;
        });

        // Process all tide data for calculations
        const allTides = data.predictions.map(prediction => ({
            time: prediction.t,
            height: prediction.v,
            type: prediction.type
        }));

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
                nextTideTime: nextTide.t,
                height: `${height} ft`,
                allTides: allTides
            };
        }

        return { nextTide: 'No data', time: '', height: '', allTides: allTides };
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


    getWaterLevelDescription(level) {
        if (level > 8) return 'Very High';
        if (level > 4) return 'High';
        if (level > -2) return 'Normal';
        if (level > -6) return 'Low';
        return 'Very Low';
    }

    updateConditionsDisplay(data, isLiveData = true) {
        // Update wind
        if (data.wind) {
            this.updateConditionItem('wind', 'Wind', 
                data.wind.description, 
                `${data.wind.speed} ${data.wind.direction}`);
        }

        // Update water level
        if (data.waterLevel) {
            this.updateConditionItem('water-level', 'Water Level', 
                data.waterLevel.description, data.waterLevel.level);
        }

        // Update next tide
        if (data.tide) {
            this.updateConditionItem('next-tide', 'Next Tide', 
                data.tide.nextTide, 
                data.tide.time + (data.tide.height ? ` (${data.tide.height})` : ''));
        }

        // Update tide range
        if (data.tideRange) {
            this.updateConditionItem('tide-range', 'Tide Range', 
                data.tideRange.description, data.tideRange.range);
        }

        // Update tide phase
        if (data.tidePhase) {
            this.updateConditionItem('current-phase', 'Current Phase', 
                data.tidePhase.description, data.tidePhase.timeToNext);
        }

        // Update today's tides
        if (data.todayTides) {
            this.updateConditionItem('today-tides', "Today's Tides", 
                data.todayTides.description, data.todayTides.next);
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