import type { Metadata } from 'next/types'
import Link from 'next/link'

export default function ShopCanceledPage() {
  return (
    <div className="pt-24 pb-24">
      <div className="container max-w-2xl">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1>Betalningen avbröts</h1>
          <p>Ingen betalning har gjorts. Din varukorg finns kvar om du vill försöka igen.</p>
          <p>
            <Link href="/shop" className="underline">
              Tillbaka till butiken
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Betalningen avbröts',
  }
}
