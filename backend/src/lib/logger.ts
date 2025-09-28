import pino from 'pino';

export const customLogger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            ignore: 'hostname',
        },
    },
    formatters: {
        bindings: (bindings) => {
            return {
                ...bindings,
                pid: process.pid,
                host: bindings.hostname,
                name: 'backend-express',
            };
        },
        level: (label) => {
            return { level: label.toUpperCase() };
        }
    },
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
});