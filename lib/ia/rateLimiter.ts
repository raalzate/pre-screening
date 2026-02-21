import { getAIRateLimit, upsertAIRateLimit, incrementAIRateLimit } from '../db';

export interface RateLimitResult {
    allowed: boolean;
    count: number;
    resetTime: Date;
}

export class RateLimiter {
    private readonly limit: number = 5;
    private readonly windowSeconds: number = 60;

    constructor(limit: number = 5, windowSeconds: number = 60) {
        this.limit = limit;
        this.windowSeconds = windowSeconds;
    }

    /**
     * Checks if a user is allowed to make an AI request.
     * Denies if unauthenticated (no userId).
     * @param userId The unique identifier for the user.
     */
    async checkLimit(userId: string | undefined): Promise<RateLimitResult> {
        if (!userId) {
            return {
                allowed: false,
                count: 0,
                resetTime: new Date()
            };
        }

        const now = new Date();
        const windowStartThreshold = new Date(now.getTime() - this.windowSeconds * 1000);

        try {
            // Get current record
            const row = await getAIRateLimit(userId);

            if (!row) {
                // First request
                await upsertAIRateLimit(userId, 1, now.toISOString());
                return { allowed: true, count: 1, resetTime: new Date(now.getTime() + this.windowSeconds * 1000) };
            }

            const currentCount = Number(row.request_count);
            const currentWindowStart = new Date(row.window_start as string);

            if (currentWindowStart < windowStartThreshold) {
                // Window expired, reset
                await upsertAIRateLimit(userId, 1, now.toISOString());
                return { allowed: true, count: 1, resetTime: new Date(now.getTime() + this.windowSeconds * 1000) };
            }

            if (currentCount < this.limit) {
                // Within limit, increment
                await incrementAIRateLimit(userId);
                return {
                    allowed: true,
                    count: currentCount + 1,
                    resetTime: new Date(currentWindowStart.getTime() + this.windowSeconds * 1000)
                };
            }

            // Limit exceeded
            return {
                allowed: false,
                count: currentCount,
                resetTime: new Date(currentWindowStart.getTime() + this.windowSeconds * 1000)
            };
        } catch (error) {
            console.error('Error in RateLimiter:', error);
            // Fail-closed as per specification
            return {
                allowed: false,
                count: 0,
                resetTime: new Date()
            };
        }
    }
}

export const aiRateLimiter = new RateLimiter();
