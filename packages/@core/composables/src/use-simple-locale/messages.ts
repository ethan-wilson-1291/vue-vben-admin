export type Locale = 'en-US' | 'vi-VN' | 'zh-CN';

export const messages: Record<Locale, Record<string, string>> = {
  'en-US': {
    cancel: 'Cancel',
    collapse: 'Collapse',
    confirm: 'Confirm',
    expand: 'Expand',
    prompt: 'Prompt',
    reset: 'Reset',
    submit: 'Submit',
  },
  'zh-CN': {
    cancel: '取消',
    collapse: '收起',
    confirm: '确认',
    expand: '展开',
    prompt: '提示',
    reset: '重置',
    submit: '提交',
  },
  'vi-VN': {
    cancel: 'Huy',
    collapse: 'Thu gon',
    confirm: 'Xac nhan',
    expand: 'Mo rong',
    prompt: 'Thong bao',
    reset: 'Dat lai',
    submit: 'Gui',
  },
};

export const getMessages = (locale: Locale) => messages[locale];
