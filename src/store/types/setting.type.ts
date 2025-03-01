export type Language = 'vi' | 'en';

interface SettingStateType {
  language: Language;
  isDarkMode: boolean;
}

const initialSettingState: SettingStateType = {
  language: 'vi',
  isDarkMode: false,
};

export type { SettingStateType };
export { initialSettingState };
