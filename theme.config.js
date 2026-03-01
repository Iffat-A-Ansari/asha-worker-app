/** @type {const} */
const themeColors = {
  // Primary: Healthcare teal - professional, trustworthy, calming
  primary: { light: '#0891b2', dark: '#06b6d4' },
  // Background: Clean white/dark slate
  background: { light: '#ffffff', dark: '#0f172a' },
  // Surface: Subtle elevation for cards
  surface: { light: '#f0f9ff', dark: '#1e293b' },
  // Foreground: High contrast text
  foreground: { light: '#0f172a', dark: '#f1f5f9' },
  // Muted: Secondary text
  muted: { light: '#64748b', dark: '#94a3b8' },
  // Border: Subtle dividers
  border: { light: '#e2e8f0', dark: '#334155' },
  // Success: Task completed
  success: { light: '#10b981', dark: '#34d399' },
  // Warning: Pending tasks
  warning: { light: '#f59e0b', dark: '#fbbf24' },
  // Error: Urgent/offline
  error: { light: '#dc2626', dark: '#ef4444' },
  // Additional: Task priority colors
  urgent: { light: '#dc2626', dark: '#ef4444' },
  pending: { light: '#f59e0b', dark: '#fbbf24' },
  ready: { light: '#10b981', dark: '#34d399' },
};

module.exports = { themeColors };
