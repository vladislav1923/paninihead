export type LoggerMeta = Record<string, unknown> | undefined;

function formatArgs(message: string, meta: LoggerMeta) {
  return [message, meta ?? undefined] as const;
}

export const logger = {
  info(message: string, meta?: LoggerMeta) {
    console.info(...formatArgs(message, meta));
  },
  error(message: string, meta?: LoggerMeta) {
    console.error(...formatArgs(message, meta));
  },
};
