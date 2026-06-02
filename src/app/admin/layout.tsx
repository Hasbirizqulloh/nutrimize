import { AppLayout } from '@/components/layout/AppLayout'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout title="Dashboard Pemerintah (BGN)">{children}</AppLayout>
}
