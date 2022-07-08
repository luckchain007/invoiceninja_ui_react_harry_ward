/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosRequestHeaders, AxiosResponse, Method } from 'axios';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { generatePath } from 'react-router';
import entityState from './constants/entity-state';
import { request } from './helpers/request';

export function apiEndpoint(): string {
  return (
    import.meta.env.VITE_API_URL ||
    window.location.origin ||
    'https://invoicing.co'
  );
}

export function endpoint(endpoint: string, params = {}): string {
  return apiEndpoint() + generatePath(endpoint, params);
}

export function isHosted(): boolean {
  return import.meta.env.VITE_IS_HOSTED === 'true';
}

export function isSelfHosted(): boolean {
  return !isHosted();
}

export function fetcher(
  url: string,
  headers?: AxiosRequestHeaders,
  method: Method = 'GET'
): Promise<AxiosResponse> {
  return request(method, url, {}, { headers });
}

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export function date(date: number | string, format: string) {
  if (date === 0 || date === '' || date === undefined) {
    return '';
  }

  if (typeof date === 'number') {
    return dayjs.unix(date).format(format);
  }

  return dayjs(date).format(format);
}

export function getEntityState(entity: any) {
  if (!entity.is_deleted && !entity.archived_at) {
    return entityState.active;
  }

  if (entity.archived_at && !entity.is_deleted) {
    return entityState.archived;
  }

  if (entity.is_deleted) {
    return entityState.deleted;
  }
}

export function trans(key: string, replace: Record<string, unknown>) {
  let translation = t(key);

  for (const placeholder in replace) {
    translation = translation.replace(
      `:${placeholder}`,
      replace[placeholder] as unknown as string
    );
  }

  return translation;
}

export function previewEndpoint(endpoint: string, params = {}): string {
  if (isHosted()) {
    return 'https://preview.invoicing.co' + generatePath(endpoint, params);
  }

  return apiEndpoint() + generatePath(endpoint, params);
}
