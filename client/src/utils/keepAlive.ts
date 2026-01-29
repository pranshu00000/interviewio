/**
 * Keep-Alive utility for Render free tier
 * Pings the server every 12 minutes to prevent it from spinning down
 */

const PING_INTERVAL = 12 * 60 * 1000; // 12 minutes in milliseconds
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

let keepAliveInterval: number | null = null;

const pingServer = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('✅ Keep-alive ping successful');
        } else {
            console.warn('⚠️ Keep-alive ping failed with status:', response.status);
        }
    } catch (error) {
        console.error('❌ Keep-alive ping error:', error);
    }
};

/**
 * Start the keep-alive mechanism
 */
export const startKeepAlive = () => {
    if (keepAliveInterval) {
        console.log('Keep-alive already running');
        return;
    }

    // Initial ping
    pingServer();

    // Set up interval
    keepAliveInterval = setInterval(pingServer, PING_INTERVAL);
    console.log('🚀 Keep-alive started - pinging every 12 minutes');
};

/**
 * Stop the keep-alive mechanism
 */
export const stopKeepAlive = () => {
    if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
        console.log('⏸️ Keep-alive stopped');
    }
};

/**
 * Check if keep-alive is running
 */
export const isKeepAliveActive = () => {
    return keepAliveInterval !== null;
};
