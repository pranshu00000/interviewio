
const PING_INTERVAL = 12 * 60 * 1000; 
const SERVER_URL = 'https://interviewio.onrender.com';

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

export const startKeepAlive = () => {
    if (keepAliveInterval) {
        console.log('Keep-alive already running');
        return;
    }

    pingServer();

    keepAliveInterval = setInterval(pingServer, PING_INTERVAL);
    console.log('🚀 Keep-alive started - pinging every 12 minutes');
};

export const stopKeepAlive = () => {
    if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
        keepAliveInterval = null;
        console.log('⏸️ Keep-alive stopped');
    }
};

export const isKeepAliveActive = () => {
    return keepAliveInterval !== null;
};
