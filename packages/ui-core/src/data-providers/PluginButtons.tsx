import React, { Fragment, ComponentType } from 'react';
import { PluginButtonData, PluginButtonsProps } from '@burner-wallet/types';
import { withBurner, BurnerContext } from '../BurnerProvider';

type ModifiedPluginButtonsProps = Pick<PluginButtonsProps, 'position' | 'component'>;

const PluginButtons: React.FC<ModifiedPluginButtonsProps & BurnerContext> = ({
  position, component, pluginData, burnerComponents, children, ...props
}) => {
  const elements = pluginData.buttons[position];
  if (!elements || elements.length === 0) {
    return null;
  }

  const Component = component || burnerComponents.Button;

  return (
    <Fragment>
      {children}

      {elements.map(({ title, path, options }: PluginButtonData, i: number) => (
        <Component key={path || i} title={title} to={path} {...options} {...props} />
      ))}
    </Fragment>
  );
};

export default withBurner(PluginButtons) as ComponentType<PluginButtonsProps>;
