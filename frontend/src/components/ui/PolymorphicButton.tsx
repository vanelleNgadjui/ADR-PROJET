import React from 'react';

type ButtonProps<C extends React.ElementType> = {
  as?: C;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<C>;

export function PolymorphicButton<C extends React.ElementType = 'button'>({
  as,
  children,
  ...props
}: ButtonProps<C>) {
  const Component = as || 'button';
  return <Component {...props}>{children}</Component>;
} 