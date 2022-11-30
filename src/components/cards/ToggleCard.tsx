/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Dispatch, Fragment, ReactNode, SetStateAction } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CommonProps from 'common/interfaces/common-props.interface';
import { MdClose } from 'react-icons/md';
import { classNames } from 'common/helpers';

interface Props extends CommonProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  title?: string;
  actionElement?: ReactNode;
  size: 'extraSmall' | 'small' | 'regular' | 'large' | 'extraLarge';
}

export function ToggleCard(props: Props) {
  const getSizeClass = () => {
    if (props.size === 'large') {
      return 'max-w-2xl';
    }
    if (props.size === 'regular') {
      return 'max-w-md';
    }
    if (props.size === 'small') {
      return 'max-w-sm';
    }
    if (props.size === 'extraSmall') {
      return 'max-w-xs';
    }
    return 'max-w-4xl';
  };

  return (
    <Transition.Root show={props.visible} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => props.setVisible(false)}
      >
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className={classNames(
                    `pointer-events-auto w-screen`,
                    getSizeClass()
                  )}
                >
                  <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="py-6 px-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            {props.title}
                          </Dialog.Title>
                          <MdClose
                            fontSize={24}
                            className="cursor-pointer"
                            onClick={() => props.setVisible(false)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between items-center">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          {props.children}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center px-4 py-4">
                      {props.actionElement}
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
