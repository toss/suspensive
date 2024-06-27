import { ConsoleIcon, RoundedButton } from '@codesandbox/sandpack-react'

interface ConsoleCounterButtonProps {
  onClick: () => void
  counter: number
}

export const ConsoleCounterButton = ({ onClick, counter }: ConsoleCounterButtonProps) => {
  return (
    <RoundedButton className="relative" onClick={onClick}>
      <ConsoleIcon />
      {counter > 0 && (
        <strong className="absolute right-0 top-0 h-[12px] min-w-[12px] rounded-[12px] bg-[#999999] px-[2px] py-0 text-[8px] font-normal leading-[12px] text-[#151515]">
          {counter}
        </strong>
      )}
    </RoundedButton>
  )
}
