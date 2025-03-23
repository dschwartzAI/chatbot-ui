import i18nConfig from "@/i18nConfig"
import { createInstance } from "i18next"
import { initReactI18next } from "react-i18next/initReactI18next"

// Hardcoded translations to avoid dynamic imports
const resources = {
  en: {
    translation: {
      'Ask anything. Type "/" for prompts, "@" for files, and "#" for tools.':
        'Ask anything. Type "/" for prompts, "@" for files, and "#" for tools.'
    }
  }
}

export default async function initTranslations(
  locale?: string,
  namespaces?: string | string[],
  i18nInstance?: any
) {
  // Always use translation as the namespace
  const ns = ["translation"]

  // Create instance if not provided
  const i18n = i18nInstance || createInstance()

  // Initialize with react-i18next
  i18n.use(initReactI18next)

  // Initialize i18n with hardcoded resources
  await i18n.init({
    lng: locale || i18nConfig.defaultLocale,
    resources: resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: "translation",
    fallbackNS: "translation",
    ns
  })

  return {
    i18n,
    resources,
    t: i18n.t
  }
}
