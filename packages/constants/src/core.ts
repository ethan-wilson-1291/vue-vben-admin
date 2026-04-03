/**
 * @zh_CN 登录页面 url 地址
 */
export const LOGIN_PATH = '/auth/login';

export interface LanguageOption {
  label: string;
  value: 'en-US' | 'es-ES' | 'fr-FR' | 'it-IT' | 'vi-VN' | 'zh-CN';
}

/**
 * Supported languages
 */
export const SUPPORT_LANGUAGES: LanguageOption[] = [
  {
    label: 'English',
    value: 'en-US',
  },
  {
    label: 'Español',
    value: 'es-ES',
  },
  {
    label: 'Français',
    value: 'fr-FR',
  },
  {
    label: 'Italiano',
    value: 'it-IT',
  },
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: 'Tiếng Việt',
    value: 'vi-VN',
  },
];
