import type { Tag } from './Tag';
export interface Task {
  id: number;
  isPinned: boolean;
  isDone: boolean;
  name: string;
  datetimeToComplete?: string;
  description?: string;
  supertaskId: number;
  userEmail: string;
  tags?: Tag[];
  dueDate?: string;
  subtasks?: Task[];
}
