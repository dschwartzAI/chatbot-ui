import { FC } from "react"
import { t } from "i18next"

interface FinishStepProps {
  displayName: string
}

export const FinishStep: FC<FinishStepProps> = ({ displayName }) => {
  return (
    <div className="space-y-4">
      <div>
        {t("Welcome to JamesBot")}
        {displayName.length > 0 ? `, ${displayName.split(" ")[0]}` : null}!
      </div>

      <div>Click next to start chatting.</div>
    </div>
  )
}
