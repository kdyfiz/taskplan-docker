import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { TaskPriority } from 'app/shared/model/enumerations/task-priority.model';

export interface ITask {
  id?: number;
  description?: string;
  dueDate?: dayjs.Dayjs | null;
  priority?: keyof typeof TaskPriority | null;
  completed?: boolean;
  createdDate?: dayjs.Dayjs;
  lastModifiedDate?: dayjs.Dayjs | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<ITask> = {
  completed: false,
};
