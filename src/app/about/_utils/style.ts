export const ACTIVE_SECTION_STYLE = {
  active:
    'mb-4 text-2xl font-black text-main-color underline underline-offset-8 sm:text-4xl',
  default:
    'mb-4 text-2xl font-black text-gray-300 underline underline-offset-8 sm:text-4xl',
} as const;

export const H2 = 'mb-2 text-2xl font-bold sm:text-3xl';

export const USER_TYPE_BUTTON_STYLE = {
  active:
    'relative w-48 rounded-full bg-main-color text-xl font-bold text-white shadow-float sm:text-2xl',
  default:
    'relative w-48 rounded-full border-2 border-main-color text-xl font-bold text-main-color hover:bg-main-color-transparent sm:text-2xl',
} as const;
