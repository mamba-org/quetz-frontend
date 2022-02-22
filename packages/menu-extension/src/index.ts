import type { QuetzFrontEndPlugin } from '@quetz-frontend/application';
import { menu } from './menu';
import { title } from './title';

const plugins: QuetzFrontEndPlugin<any>[] = [title, menu];

export default plugins;
