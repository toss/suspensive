export const EmptyBox = ({ children }: { children: React.ReactNode }) => (
  <div className="h-[58px] border border-gray-900 bg-gray-100">{children}</div>
)
export const LoadingBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-yellow-500">{children}</div>
)
export const ErrorFallbackBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-red-500">{children}</div>
)
export const SkipSSROnErrorFallbackBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-orange-500">{children}</div>
)
