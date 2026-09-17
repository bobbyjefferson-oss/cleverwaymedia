import Link from 'next/link';

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {items.map((item, i) => (
        <span key={i}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          {i < items.length - 1 ? <span className="breadcrumbs__sep">/</span> : null}
        </span>
      ))}
    </nav>
  );
}
