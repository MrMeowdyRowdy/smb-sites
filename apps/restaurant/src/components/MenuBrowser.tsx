'use client';

import { useEffect, useState } from 'react';
import { type Locale, formatUsd, pathFor } from '@smb/i18n';
import { orderMessage, waLink } from '@smb/ui/whatsapp';
import { ui } from '../copy';
import { type Menu, pick } from '../lib/content';

const KEY = 'neblina-cart';
type Cart = Record<string, number>;

function load(): Cart {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

export function MenuBrowser({ menu, phone, locale }: { menu: Menu; phone: string; locale: Locale }) {
  const u = ui[locale].menuPage;
  const [cart, setCart] = useState<Cart>({});
  const [ready, setReady] = useState(false);

  // The cart is read after hydration so the static HTML and the first client render match.
  useEffect(() => {
    setCart(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch {
      /* private mode or storage full: the cart still works for this visit */
    }
  }, [cart, ready]);

  const change = (id: string, delta: number) =>
    setCart((c) => {
      const qty = (c[id] ?? 0) + delta;
      const { [id]: _drop, ...rest } = c;
      void _drop;
      return qty > 0 ? { ...rest, [id]: qty } : rest;
    });

  const lines = menu.items.filter((i) => i.available && cart[i.id] > 0).map((i) => ({ item: i, qty: cart[i.id] }));
  const cents = lines.reduce((s, l) => s + l.qty * Math.round(l.item.price * 100), 0);
  const href = waLink(
    phone,
    orderMessage(
      lines.map((l) => ({ qty: l.qty, name: pick(l.item.name, locale), price: l.item.price })),
      locale,
    ),
  );

  return (
    <div className="menu-layout">
      <div>
        {menu.categories.map((c) => (
          <section key={c.id} aria-labelledby={`cat-${c.id}`}>
            <h2 id={`cat-${c.id}`}>{pick(c.name, locale)}</h2>
            <ul>
              {menu.items
                .filter((i) => i.category === c.id)
                .map((i) => (
                  <li key={i.id}>
                    <strong>{pick(i.name, locale)}</strong> {formatUsd(i.price, locale)}
                    {i.tags.length > 0 && <small> ({i.tags.map((t) => u.tags[t]).join(', ')})</small>}
                    <br />
                    {pick(i.description, locale)}
                    <br />
                    {i.available ? (
                      <button type="button" data-testid={`add-${i.id}`} onClick={() => change(i.id, 1)} aria-label={`${u.add}: ${pick(i.name, locale)}`}>
                        {u.add}
                      </button>
                    ) : (
                      <em>{u.unavailable}</em>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        ))}
        <p>
          <a href={pathFor('qr', locale)}>{u.qrLink}</a>
        </p>
      </div>

      <aside aria-labelledby="order-title" className="order">
        <h2 id="order-title">{u.order.title}</h2>
        {lines.length === 0 ? (
          <p>{u.order.empty}</p>
        ) : (
          <ul>
            {lines.map(({ item, qty }) => (
              <li key={item.id}>
                {pick(item.name, locale)}
                <br />
                <button type="button" onClick={() => change(item.id, -1)} aria-label={`${u.order.remove}: ${pick(item.name, locale)}`}>
                  -
                </button>{' '}
                <span aria-label={u.order.qty} data-testid={`qty-${item.id}`}>
                  {qty}
                </span>{' '}
                <button type="button" onClick={() => change(item.id, 1)} aria-label={`${u.add}: ${pick(item.name, locale)}`}>
                  +
                </button>
              </li>
            ))}
          </ul>
        )}
        <p>
          {u.order.total}: <strong data-testid="total">{formatUsd(cents / 100, locale)}</strong>
        </p>
        {lines.length > 0 ? (
          <a href={href} target="_blank" rel="noopener noreferrer" data-testid="order-link">
            {u.order.cta}
          </a>
        ) : (
          <span aria-disabled="true">{u.order.cta}</span>
        )}
      </aside>
    </div>
  );
}
