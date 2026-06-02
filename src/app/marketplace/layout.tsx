import { AppLayout } from '@/components/layout/AppLayout'

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppLayout title="Pasar Logistik & B2B Matchmaking">{children}</AppLayout>
}
