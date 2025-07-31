
// Backend Connector pour Social Content Masterclass
class BackendConnector {
    constructor() {
        this.baseUrl = window.location.origin;
        this.isConnected = false;
    }

    async initialize() {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            if (response.ok) {
                const data = await response.json();
                this.isConnected = data.status === 'ok';
                console.log('🔌 Backend connecté:', data);
                return true;
            }
        } catch (error) {
            console.log('🔌 Backend non disponible, mode local activé');
            this.isConnected = false;
        }
        return false;
    }

    async getEffects() {
        try {
            const response = await fetch(`${this.baseUrl}/api/effects`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Erreur lors du chargement des effets:', error);
        }
        return null;
    }

    async getScenarios() {
        try {
            const response = await fetch(`${this.baseUrl}/api/scenarios`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Erreur lors du chargement des scénarios:', error);
        }
        return null;
    }

    async generateContent(data) {
        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                return await response.json();
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Erreur serveur');
            }
        } catch (error) {
            console.error('Erreur lors de la génération:', error);
            throw error;
        }
    }

    isBackendConnected() {
        return this.isConnected;
    }
}
