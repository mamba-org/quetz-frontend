export enum API_STATUSES {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

const _BACKEND_HOST = BACKEND_HOST;
const _REPO_HOST = REPO_HOST;

export const KB_SIZE = 1024;
export const MB_SIZE = 1024 * KB_SIZE;
export const GB_SIZE = 1024 * MB_SIZE;

export { _BACKEND_HOST as BACKEND_HOST };
export { _REPO_HOST as REPO_HOST };
