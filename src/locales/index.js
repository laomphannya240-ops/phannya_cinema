import { en } from './en.js'
import { km } from './km.js'

export const dictionaries = { en, km }
export const languageNames = { en: 'EN', km: 'ខ្មែរ' }

export function translate(language, key) {
  return dictionaries[language]?.[key] ?? dictionaries.en[key] ?? key
}
