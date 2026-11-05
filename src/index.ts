// Fintech Design System — public API.
import './styles.css';

// Theme
export { ThemeProvider, useTheme } from './theme/ThemeProvider';
export type { ThemeProviderProps, ThemeMode } from './theme/ThemeProvider';
export { themeVars, colorVars, staticVars, resolveAccent } from './theme/cssVars';

// Tokens
export * from './tokens/tokens';

// Utils
export { formatMoney, formatDate, formatPercent, currencySymbol } from './utils/format';
export type { FormatMoneyOptions } from './utils/format';
export { cx } from './utils/cx';

// Components
export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

export { Field } from './components/Field';
export type { FieldProps } from './components/Field';

export { MoneyAmount } from './components/MoneyAmount';
export type { MoneyAmountProps } from './components/MoneyAmount';

export { StatusBadge } from './components/StatusBadge';
export type { StatusBadgeProps, BadgeTone } from './components/StatusBadge';

export { AccountCard } from './components/AccountCard';
export type { AccountCardProps } from './components/AccountCard';

export { TransactionList } from './components/TransactionList';
export type { TransactionListProps, Transaction } from './components/TransactionList';

export { DataTable } from './components/DataTable';
export type { DataTableProps, Column } from './components/DataTable';

export { Sparkline, AreaChart } from './components/Sparkline';
export type { SparklineProps } from './components/Sparkline';

export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';

export { ToastProvider, useToast } from './components/Toast';
export type { ToastOptions, ToastTone } from './components/Toast';

export { StepperForm } from './components/StepperForm';
export type { StepperFormProps, Step } from './components/StepperForm';
