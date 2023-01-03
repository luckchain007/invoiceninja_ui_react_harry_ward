import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { MdArrowDropDown } from 'react-icons/md';
import { BiPlus } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useQuickCreateSections } from 'common/hooks/entities/useQuickCreateSections';
import { useQuickCreateActions } from 'common/hooks/entities/useQuickCreateActions';

export function QuickCreatePopover() {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const sections = useQuickCreateSections();

  const actions = useQuickCreateActions();

  return (
    <Popover className="relative ml-6 mt-2">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              open ? 'text-gray-500' : 'text-gray-900',
              'group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2'
            )}
          >
            <BiPlus className="cursor-pointer text-xl md:text-2xl" />

            <MdArrowDropDown className="cursor-pointer text-xl md:text-2xl" />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-full z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0 lg:max-w-4xl">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-6 bg-white px-5 py-5 lg:pl-8 lg:px-8 grid-cols-2 lg:grid-cols-3">
                  {sections.map(
                    (section) =>
                      section.visible && (
                        <div
                          key={section.name}
                          className="flex flex-col items-start rounded-lg py-4 transition duration-150 ease-in-out"
                        >
                          <div className="flex items-center pl-3">
                            <section.icon className="text-xl lg:text-3xl text-gray-500" />

                            <p className="text-base lg:text-xl font-medium text-gray-500 ml-1 md:ml-3">
                              {t(section.name)}
                            </p>
                          </div>

                          <div className="flex flex-col w-full mt-2">
                            {actions.map(
                              (action) =>
                                action.section === section.name &&
                                action.visible && (
                                  <div
                                    key={action.key}
                                    className="flex items-center pl-4 lg:pl-6 py-1 cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                      !action.externalLink &&
                                        navigate(action.url);

                                      action.externalLink &&
                                        window.open(action.url, '_blank');
                                    }}
                                  >
                                    <BiPlus className="text-sm md:text-base lg:text-base text-gray-800" />

                                    <span className="ml-2 text-xs lg:text-sm text-gray-800">
                                      {t(action.key)}
                                    </span>
                                  </div>
                                )
                            )}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
