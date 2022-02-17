import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { DropdownOptions } from '../types'
import { LANGUAGES } from '../constants'

export const initI18n = () => {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      debug: false,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    })
}

export const getLanguageOptions: () => DropdownOptions = () => {
  return Object.keys(LANGUAGES).map((key) => [
    LANGUAGES[key as unknown as keyof typeof LANGUAGES].nativeName,
    key,
  ])
}
