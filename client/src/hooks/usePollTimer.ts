import { useEffect, useState } from 'react';

export const usePollTimer = (startTime: string | null, duration: number) => {
    const [remainingTime, setRemainingTime] = useState(0);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!startTime) {
            setRemainingTime(0);
            return;
        }

        const start = new Date(startTime).getTime();
        const end = start + duration * 1000;

        const updateTimer = () => {
            const now = new Date().getTime();
            const left = Math.max(0, Math.ceil((end - now) / 1000));
            setRemainingTime(left);

            if (left <= 0) {
                setIsExpired(true);
            } else {
                setIsExpired(false);
            }
        };

        updateTimer(); // Initial call
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [startTime, duration]);

    return { remainingTime, isExpired };
};
