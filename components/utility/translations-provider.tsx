"use client"

import initTranslations from "@/lib/i18n"
import { createInstance } from "i18next"
import { I18nextProvider } from "react-i18next"
import { useEffect, useState, useRef } from "react"

interface TranslationsProviderProps {
  children: React.ReactNode
  locale: string
  namespaces?: string[]
  resources?: any
}

export default function TranslationsProvider({
  children,
  locale,
  namespaces = ["translation"],
  resources
}: TranslationsProviderProps) {
  const [instance, setInstance] = useState<any>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isInitialized.current) return

    const initialize = async () => {
      try {
        const i18nInstance = createInstance()
        const result = await initTranslations(locale, namespaces, i18nInstance)
        setInstance(i18nInstance)
        isInitialized.current = true
      } catch (error) {
        console.error("Translation initialization failed:", error)
      }
    }

    initialize()
  }, [])

  if (!instance) return null

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>
}
