/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Link } from '$app/components/forms';
import { EntityState } from '$app/common/enums/entity-state';
import { date, getEntityState } from '$app/common/helpers';
import { route } from '$app/common/helpers/route';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { useCurrentCompanyDateFormats } from '$app/common/hooks/useCurrentCompanyDateFormats';
import { useCurrentUser } from '$app/common/hooks/useCurrentUser';
import { Project } from '$app/common/interfaces/project';
import { Divider } from '$app/components/cards/Divider';
import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { EntityStatus } from '$app/components/EntityStatus';
import { Icon } from '$app/components/icons/Icon';
import { Tooltip } from '$app/components/Tooltip';
import { useUpdateAtom } from 'jotai/utils';
import { DataTableColumnsExtended } from '$app/pages/invoices/common/hooks/useInvoiceColumns';
import { useTranslation } from 'react-i18next';
import {
  MdArchive,
  MdControlPointDuplicate,
  MdDelete,
  MdRestore,
  MdTextSnippet,
} from 'react-icons/md';
import { useQueryClient } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { projectAtom } from './atoms';
import { useBulkAction } from './hooks/useBulkAction';
import { useEntityCustomFields } from '$app/common/hooks/useEntityCustomFields';

export const defaultColumns: string[] = [
  'name',
  'task_rate',
  'due_date',
  'public_notes',
  'private_notes',
  'budgeted_hours',
  'entity_state',
];

export function useAllProjectColumns() {
  const [firstCustom, secondCustom, thirdCustom, fourthCustom] =
    useEntityCustomFields({
      entity: 'project',
    });

  const projectColumns = [
    'name',
    //   'client', @Todo: Need to resolve translation
    'task_rate',
    'due_date',
    'public_notes',
    'private_notes',
    'budgeted_hours',
    'entity_state',
    'archived_at',
    //   'assigned_to', @Todo: Need to resolve translation
    //   'client_id_number', @Todo: Need to resolve translation
    //   'client_number', @Todo: Need to resolve translation
    'created_at',
    //   'created_by', @Todo: Need to resolve translation
    firstCustom,
    secondCustom,
    thirdCustom,
    fourthCustom,
    'documents',
    'is_deleted',
    'number',
    'updated_at',
  ] as const;

  return projectColumns;
}

export function useProjectColumns() {
  const { t } = useTranslation();
  const { dateFormat } = useCurrentCompanyDateFormats();

  const currentUser = useCurrentUser();
  const company = useCurrentCompany();
  const formatMoney = useFormatMoney();

  const projectColumns = useAllProjectColumns();
  type ProjectColumns = (typeof projectColumns)[number];

  const [firstCustom, secondCustom, thirdCustom, fourthCustom] =
    useEntityCustomFields({
      entity: 'project',
    });

  const columns: DataTableColumnsExtended<Project, ProjectColumns> = [
    {
      column: 'name',
      id: 'name',
      label: t('name'),
      format: (value, project) => (
        <Link to={route('/projects/:id/edit', { id: project.id })}>
          {value}
        </Link>
      ),
    },
    {
      column: 'task_rate',
      id: 'task_rate',
      label: t('task_rate'),
      format: (value) =>
        formatMoney(
          value,
          company?.settings.country_id,
          company?.settings.currency_id
        ),
    },
    {
      column: 'due_date',
      id: 'due_date',
      label: t('due_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'public_notes',
      id: 'public_notes',
      label: t('public_notes'),
      format: (value) => (
        <Tooltip size="regular" truncate message={value as string}>
          <span>{value}</span>
        </Tooltip>
      ),
    },
    {
      column: 'private_notes',
      id: 'private_notes',
      label: t('private_notes'),
      format: (value) => (
        <Tooltip size="regular" truncate message={value as string}>
          <span>{value}</span>
        </Tooltip>
      ),
    },
    {
      column: 'budgeted_hours',
      id: 'budgeted_hours',
      label: t('budgeted_hours'),
      format: (value) =>
        formatMoney(
          value,
          company?.settings.country_id,
          company?.settings.currency_id
        ),
    },
    {
      column: 'entity_state',
      id: 'id',
      label: t('entity_state'),
      format: (value, resource) => <EntityStatus entity={resource} />,
    },
    {
      column: 'archived_at',
      id: 'archived_at',
      label: t('archived_at'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'created_at',
      id: 'created_at',
      label: t('created_at'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: firstCustom,
      id: 'custom_value1',
      label: firstCustom,
    },
    {
      column: secondCustom,
      id: 'custom_value2',
      label: secondCustom,
    },
    {
      column: thirdCustom,
      id: 'custom_value3',
      label: thirdCustom,
    },
    {
      column: fourthCustom,
      id: 'custom_value4',
      label: fourthCustom,
    },
    {
      column: 'documents',
      id: 'documents',
      label: t('documents'),
      format: (value, project) => project.documents.length,
    },
    {
      column: 'is_deleted',
      id: 'is_deleted',
      label: t('is_deleted'),
      format: (value, project) => (project.is_deleted ? t('yes') : t('no')),
    },
    {
      column: 'number',
      id: 'number',
      label: t('number'),
    },
    {
      column: 'updated_at',
      id: 'updated_at',
      label: t('updated_at'),
      format: (value) => date(value, dateFormat),
    },
  ];

  const list: string[] =
    currentUser?.company_user?.settings?.react_table_columns?.project ||
    defaultColumns;

  return columns
    .filter((column) => list.includes(column.column))
    .sort((a, b) => list.indexOf(a.column) - list.indexOf(b.column));
}

export function useActions() {
  const [t] = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const bulk = useBulkAction();

  const invoiceProject = useInvoiceProject();

  const isEditPage = location.pathname.endsWith('/edit');

  const setProject = useUpdateAtom(projectAtom);

  const cloneToProject = (project: Project) => {
    setProject({ ...project, id: '', documents: [], number: '' });

    navigate('/projects/create?action=clone');
  };

  const handleInvoiceProject = (project: Project) => {
    toast.processing();

    queryClient.fetchQuery({
      queryKey: route('/api/v1/tasks?project_tasks=:projectId&per_page=100', {
        projectId: project.id,
      }),
      queryFn: () =>
        request(
          'GET',
          endpoint('/api/v1/tasks?project_tasks=:projectId&per_page=100', {
            projectId: project.id,
          })
        )
          .then((response: GenericSingleResourceResponse<Task[]>) => {
            toast.dismiss();

            const unInvoicedTasks = response.data.data.filter(
              (task) => !task.invoice_id
            );

            if (!response.data.data.length) {
              return toast.error('no_assigned_tasks');
            }

            invoiceProject(unInvoicedTasks);
          })
          .catch((error: AxiosError) => {
            toast.error();
            console.error(error);
          }),
    });
  };

  const actions = [
    (project: Project) => (
      <DropdownElement
        onClick={() => handleInvoiceProject(project)}
        icon={<Icon element={MdTextSnippet} />}
      >
        {t('invoice_project')}
      </DropdownElement>
    ),
    (project: Project) => (
      <DropdownElement
        onClick={() => cloneToProject(project)}
        icon={<Icon element={MdControlPointDuplicate} />}
      >
        {t('clone')}
      </DropdownElement>
    ),
    () => isEditPage && <Divider withoutPadding />,
    (project: Project) =>
      getEntityState(project) === EntityState.Active &&
      isEditPage && (
        <DropdownElement
          onClick={() => bulk(project.id, 'archive')}
          icon={<Icon element={MdArchive} />}
        >
          {t('archive')}
        </DropdownElement>
      ),
    (project: Project) =>
      (getEntityState(project) === EntityState.Archived ||
        getEntityState(project) === EntityState.Deleted) &&
      isEditPage && (
        <DropdownElement
          onClick={() => bulk(project.id, 'restore')}
          icon={<Icon element={MdRestore} />}
        >
          {t('restore')}
        </DropdownElement>
      ),
    (project: Project) =>
      (getEntityState(project) === EntityState.Active ||
        getEntityState(project) === EntityState.Archived) &&
      isEditPage && (
        <DropdownElement
          onClick={() => bulk(project.id, 'delete')}
          icon={<Icon element={MdDelete} />}
        >
          {t('delete')}
        </DropdownElement>
      ),
  ];

  return actions;
}
