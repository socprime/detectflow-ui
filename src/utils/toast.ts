import { toast as notify } from 'sonner';

const SUCCESS_DURATION = 4000;
const DEFAULT_CONFIG = { duration: SUCCESS_DURATION };

export const toast = {
  info: (message: string) => notify.info(message, DEFAULT_CONFIG),
  success: (message: string) => notify.success(message, DEFAULT_CONFIG),
  error: (message: string) => notify.error(message),
  warning: (message: string) => notify.warning(message),
};
