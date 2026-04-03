type MessageMap = Record<string, string>;

export const messages = {
  'en-US': {
    cancel: 'Cancel',
    collapse: 'Collapse',
    confirm: 'Confirm',
    expand: 'Expand',
    prompt: 'Prompt',
    reset: 'Reset',
    submit: 'Submit',
  },
  'es-ES': {
    cancel: 'Cancelar',
    collapse: 'Contraer',
    confirm: 'Confirmar',
    expand: 'Expandir',
    prompt: 'Aviso',
    reset: 'Restablecer',
    submit: 'Enviar',
  },
  'fr-FR': {
    cancel: 'Annuler',
    collapse: 'Reduire',
    confirm: 'Confirmer',
    expand: 'Developper',
    prompt: 'Invite',
    reset: 'Reinitialiser',
    submit: 'Soumettre',
  },
  'it-IT': {
    cancel: 'Annulla',
    collapse: 'Comprimi',
    confirm: 'Conferma',
    expand: 'Espandi',
    prompt: 'Avviso',
    reset: 'Reimposta',
    submit: 'Invia',
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
    cancel: 'Hủy',
    collapse: 'Thu gọn',
    confirm: 'Xác nhận',
    expand: 'Mở rộng',
    prompt: 'Thông báo',
    reset: 'Đặt lại',
    submit: 'Gửi',
  },
} satisfies Record<string, MessageMap>;

export type Locale = keyof typeof messages;

const DEFAULT_LOCALE: Locale = 'en-US';

export const getMessages = (locale: string): MessageMap => {
  return messages[locale as Locale] ?? messages[DEFAULT_LOCALE];
};
