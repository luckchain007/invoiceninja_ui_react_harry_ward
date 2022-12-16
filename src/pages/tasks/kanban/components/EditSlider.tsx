/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ClickableElement } from '@invoiceninja/cards';
import { Button, InputField } from '@invoiceninja/forms';
import { Task } from 'common/interfaces/task';
import { TaskStatus } from 'common/interfaces/task-status';
import { ClientSelector } from 'components/clients/ClientSelector';
import { DebouncedCombobox, Record } from 'components/forms/DebouncedCombobox';
import { Modal } from 'components/Modal';
import { ProjectSelector } from 'components/projects/ProjectSelector';
import { TabGroup } from 'components/TabGroup';
import { UserSelector } from 'components/users/UserSelector';
import { useAtom } from 'jotai';
import { parseTimeLog } from 'pages/tasks/common/helpers/calculate-time';
import { useSave } from 'pages/tasks/common/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { currentTaskAtom } from '../common/atoms';
import { useFormatTimeLog } from '../common/hooks';

export function EditSlider() {
  const [t] = useTranslation();
  const [task, setTask] = useAtom(currentTaskAtom);

  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [timeLog, setTimeLog] = useState<number[]>([]);

  const handleChange = (property: keyof Task, value: Task[typeof property]) => {
    setTask((current) => current && { ...current, [property]: value });
  };

  const save = useSave();
  const formatTimeLog = useFormatTimeLog();

  return (
    <>
      <Modal
        title={t('time_log')}
        visible={isTimeModalVisible && timeLog.length > 0}
        onClose={() => {
          setIsTimeModalVisible(false);
          setTimeLog([]);
        }}
      >
        <InputField
          label={t('date')}
          type="date"
          // value={parseTimeToDate(timeLog[0])}
          onValueChange={(value) => console.log(value)}
        />

        <InputField label={t('start_time')} />
        <InputField label={t('end_time')} />
        <InputField label={t('duration')} />
      </Modal>

      <TabGroup tabs={[t('details'), t('times')]} width="full">
        <div className="p-4 space-y-4">
          <ClientSelector
            inputLabel={t('client')}
            value={task?.client_id}
            onChange={(client) => handleChange('client_id', client.id)}
          />

          <ProjectSelector
            inputLabel={t('project')}
            value={task?.project_id}
            onChange={(project) => handleChange('project_id', project.id)}
          />

          <UserSelector
            inputLabel={t('user')}
            value={task?.assigned_user_id}
            onChange={(user) => handleChange('assigned_user_id', user.id)}
          />

          <InputField
            label={t('task_number')}
            value={task?.number}
            onValueChange={(number) => handleChange('number', number)}
          />

          <InputField
            label={t('rate')}
            value={task?.rate}
            onValueChange={(rate) => handleChange('rate', rate)}
          />

          <DebouncedCombobox
            inputLabel={t('status')}
            endpoint="/api/v1/task_statuses"
            label="name"
            onChange={(value: Record<TaskStatus>) =>
              value.resource && handleChange('status_id', value.resource.id)
            }
            defaultValue={task?.status_id}
            queryAdditional
          />

          <InputField
            element="textarea"
            value={task?.description}
            onValueChange={(value) => handleChange('description', value)}
          />

          <div className="flex justify-end">
            <Button onClick={() => task && save(task)}>{t('save')}</Button>
          </div>
        </div>

        <div>
          {task &&
            formatTimeLog(task.time_log).map(([date, start, end], i) => (
              <ClickableElement
                key={i}
                onClick={() => {
                  setIsTimeModalVisible(true);
                  setTimeLog(parseTimeLog(task.time_log)[i]);
                }}
              >
                <div>
                  <p>{date}</p>

                  <small>
                    {start} - {end}
                  </small>
                </div>
              </ClickableElement>
            ))}
        </div>
      </TabGroup>
    </>
  );
}
