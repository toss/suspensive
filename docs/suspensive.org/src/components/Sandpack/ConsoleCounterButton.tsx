import { ConsoleIcon, RoundedButton } from '@codesandbox/sandpack-react'

interface ConsoleCounterButtonProps {
  onClick: () => void
  counter: number
}

export const ConsoleCounterButton = ({
  onClick,
  counter,
}: ConsoleCounterButtonProps) => {
  return (
    <RoundedButton className="relative" onClick={onClick}>
      <ConsoleIcon />
      {counter > 0 && (
        <strong className="absolute top-0 right-0 h-[12px] min-w-[12px] rounded-[12px] bg-[#999999] px-[2px] py-0 text-[8px] leading-[12px] font-normal text-[#151515]">
          {counter}
        </strong>
      )}
    </RoundedButton>
  )
}
