import { AppLayout } from '@/components/layout/AppLayout'

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout 
      title="Kalkulator Menu AI (OR-Tools)" 
      headerIcon={<span className="material-symbols-outlined text-[var(--color-brand)]">auto_awesome</span>}
      isWide={true}
    >
      {children}
    </AppLayout>
  )
}
