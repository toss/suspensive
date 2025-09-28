import * as React from 'react';

export function genericForwardRef<TProps = {}, TRef = any>(
  render: <TGenericProps extends TProps = TProps>(
    props: TGenericProps,
    ref: React.ForwardedRef<TRef>
  ) => React.ReactElement | null
) {
  const WrappedComponent = React.forwardRef<TRef, TProps>(
    (props, ref) => render(props as any, ref)
  );

  return WrappedComponent as <TGenericProps extends TProps = TProps>(
    props: TGenericProps & React.RefAttributes<TRef>
  ) => React.ReactElement | null;
}