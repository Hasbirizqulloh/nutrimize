import { AppLayout } from '@/components/layout/AppLayout'

export default function WasteAnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout title="Analitik Sisa Pangan (Food Waste)">{children}</AppLayout>
}
