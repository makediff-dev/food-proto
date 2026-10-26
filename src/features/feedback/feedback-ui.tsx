'use client';

import type { ComponentType, ReactNode } from 'react';
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Tab,
  TabList,
  type TabListProps,
  Tabs,
} from 'react-aria-components';

import styles from './feedback-prototype.module.css';

type IconComponent = ComponentType<{ className?: string }>;

type UIButtonProps = Omit<AriaButtonProps, 'children' | 'className'> & {
  children?: ReactNode;
  className?: string;
  iconLeading?: IconComponent;
  iconTrailing?: IconComponent;
  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md';
};

export function UIButton({
  children,
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  color = 'primary',
  size = 'md',
  className = '',
  ...props
}: UIButtonProps) {
  return (
    <AriaButton
      {...props}
      className={`${styles.uiButton} ${styles[`uiButton_${color}`]} ${styles[`uiButton_${size}`]} ${className}`}
    >
      {IconLeading ? <IconLeading className={styles.uiIcon} /> : null}
      <span>{children}</span>
      {IconTrailing ? <IconTrailing className={styles.uiIcon} /> : null}
    </AriaButton>
  );
}

export function UIBadge({
  children,
  tone = 'neutral',
  dot = false,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'error' | 'warning';
  dot?: boolean;
}) {
  return (
    <span className={`${styles.uiBadge} ${styles[`uiBadge_${tone}`]}`}>
      {dot ? <i aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function UINavButton({
  current,
  label,
  icon: Icon,
  onPress,
}: {
  current: boolean;
  label: string;
  icon: IconComponent;
  onPress: () => void;
}) {
  return (
    <AriaButton className={styles.uiNavButton} data-current={current || undefined} onPress={onPress}>
      <Icon className={styles.uiNavIcon} />
      <span>{label}</span>
    </AriaButton>
  );
}

export function UITabs<T extends string>({
  items,
  selectedKey,
  onSelectionChange,
  ariaLabel,
}: {
  items: readonly T[];
  selectedKey: T;
  onSelectionChange: (key: T) => void;
  ariaLabel: string;
}) {
  return (
    <Tabs selectedKey={selectedKey} onSelectionChange={(key) => onSelectionChange(String(key) as T)}>
      <TabList aria-label={ariaLabel} items={items as T[]} className={styles.uiTabs}>
        {(item) => (
          <Tab id={item} className={styles.uiTab}>
            {item}
          </Tab>
        )}
      </TabList>
    </Tabs>
  );
}

export function UIStatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: IconComponent;
}) {
  return (
    <article className={styles.uiStatCard}>
      <div className={styles.uiStatIcon}>
        <Icon />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
  );
}

export type { TabListProps };
