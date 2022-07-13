/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { endpoint } from 'common/helpers';
import { request } from 'common/helpers/request';
import { toast } from 'common/helpers/toast/toast';
import { useTitle } from 'common/hooks/useTitle';
import { Task } from 'common/interfaces/task';
import { useBlankTaskQuery } from 'common/queries/tasks';
import { Default } from 'components/layouts/Default';
import { useEffect, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { TaskDetails } from '../common/components/TaskDetails';
import { TaskTable } from '../common/components/TaskTable';
import { isOverlapping } from '../common/helpers/is-overlapping';

export function Create() {
  const { documentTitle } = useTitle('edit_task');
  const { data } = useBlankTaskQuery();

  const [task, setTask] = useState<Task>();

  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setTask(data);
    }
  }, [data]);

  const handleChange = (property: keyof Task, value: unknown) => {
    setTask((current) => current && { ...current, [property]: value });
  };

  const handleSave = (task: Task) => {
    if (isOverlapping(task)) {
      return toast.error('task_errors');
    }

    toast.processing();

    request('POST', endpoint('/api/v1/tasks'), task)
      .then((response) => {
        toast.success('created_task');

        navigate(
          generatePath('/tasks/:id/edit', { id: response.data.data.id })
        );
      })
      .catch((error) => {
        console.error(error);

        toast.error();
      });
  };

  return (
    <Default
      title={documentTitle}
      onBackClick={generatePath('/tasks')}
      onSaveClick={() => task && handleSave(task)}
    >
      {task && <TaskDetails task={task} handleChange={handleChange} />}
      {task && <TaskTable task={task} handleChange={handleChange} />}
    </Default>
  );
}
