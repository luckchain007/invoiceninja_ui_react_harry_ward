/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosError } from 'axios';
import { endpoint, isProduction } from 'common/helpers';
import { request } from 'common/helpers/request';
import { route } from 'common/helpers/route';
import { toast } from 'common/helpers/toast/toast';
import { useTitle } from 'common/hooks/useTitle';
import { Task } from 'common/interfaces/task';
import { ValidationBag } from 'common/interfaces/validation-bag';
import { useTaskStatusesQuery } from 'common/queries/task-statuses';
import { useBlankTaskQuery } from 'common/queries/tasks';
import { Default } from 'components/layouts/Default';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { taskAtom } from '../common/atoms';
import { TaskDetails } from '../common/components/TaskDetails';
import { TaskTable } from '../common/components/TaskTable';
import { isOverlapping } from '../common/helpers/is-overlapping';

export function Create() {
  const [t] = useTranslation();

  const { documentTitle } = useTitle('new_task');

  const [searchParams] = useSearchParams();

  const { data } = useBlankTaskQuery();

  const { data: taskStatuses } = useTaskStatusesQuery();

  const pages = [
    { name: t('tasks'), href: '/tasks' },
    { name: t('new_task'), href: '/tasks/create' },
  ];

  const [task, setTask] = useAtom(taskAtom);

  const [errors, setErrors] = useState<ValidationBag>();

  const navigate = useNavigate();

  useEffect(() => {
    if (data && taskStatuses && !task) {
      setTask({
        ...data,
        status_id: taskStatuses.data.length > 0 ? taskStatuses.data[0].id : '',
      });
    }

    if (data && taskStatuses && task) {
      setTask(
        (prevState) =>
          prevState && {
            ...prevState,
            status_id:
              taskStatuses.data.length > 0 ? taskStatuses.data[0].id : '',
          }
      );
    }

    if (searchParams.has('client')) {
      setTask(
        (prevState) =>
          prevState && {
            ...prevState,
            client_id: searchParams.get('client') as string,
          }
      );
    }

    return () => {
      isProduction() && setTask(undefined);
    };
  }, [data, taskStatuses]);

  const handleChange = (property: keyof Task, value: unknown) => {
    setTask((current) => current && { ...current, [property]: value });
  };

  const handleSave = (task: Task) => {
    toast.processing();

    if (isOverlapping(task)) {
      return toast.error('task_errors');
    }

    request('POST', endpoint('/api/v1/tasks'), task)
      .then((response) => {
        toast.success('created_task');

        navigate(route('/tasks/:id/edit', { id: response.data.data.id }));
      })
      .catch((error: AxiosError<ValidationBag>) => {
        if (error.response?.status === 422) {
          toast.dismiss();
          setErrors(error.response.data);
        } else {
          console.error(error);
          toast.error();
        }
      });
  };

  return (
    <Default
      title={documentTitle}
      onBackClick={route('/tasks')}
      onSaveClick={() => task && handleSave(task)}
      breadcrumbs={pages}
    >
      {task && (
        <TaskDetails task={task} handleChange={handleChange} errors={errors} />
      )}
      {task && <TaskTable task={task} handleChange={handleChange} />}
    </Default>
  );
}
