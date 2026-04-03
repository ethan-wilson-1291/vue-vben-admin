import type { VbenFormProps } from '@vben/common-ui';

import { $t } from '@vben/locales';

export const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('page.ad-connections.filter.search'),
      componentProps: {
        placeholder: $t('page.ad-connections.filter.searchPlaceholder'),
      },
    },
    {
      component: 'Checkbox',
      fieldName: 'onlyShowActiveAdAccounts',
      label: '',
      defaultValue: false,
      renderComponentContent: () => {
        return {
          default: () => [
            $t('page.ad-connections.filter.onlyShowValidAdAccounts'),
          ],
        };
      },
    },
  ],
  showCollapseButton: false,
  collapsed: true,
  submitOnChange: true,
  submitOnEnter: true,
  showDefaultActions: true,
  resetButtonOptions: {
    show: false,
  },
  submitButtonOptions: {
    show: false,
  },
  wrapperClass: 'grid-cols-1 sm:grid-cols-2',
};
