'use client';

import { useEffect, useState } from 'react';
import { type Locale, formatUsd, pathFor } from '@smb/i18n';
import { type OrderMode, orderMessage, waLink } from '@smb/ui/whatsapp';
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

export function MenuBrowser({ menu, phone, locale, art }: { menu: Menu; phone: string; locale: Locale; art?: Record<string, React.ReactNode> }) {
  const u = ui[locale].menuPage;
  const [cart, setCart] = useState<Cart>({});
  const [ready, setReady] = useState(false);
  const [asking, setAsking] = useState(false);
  const [active, setActive] = useState(menu.categories[0].id);

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

  // The tab of the category in view is the current one.
  useEffect(() => {
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const first = menu.categories.find((c) => seen.get(`cat-${c.id}`));
        setActive(first ? first.id : menu.categories[0].id);
      },
      { rootMargin: '-96px 0px -55% 0px' },
    );
    menu.categories.forEach((c) => {
      const el = document.getElementById(`cat-${c.id}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [menu.categories]);

  const change = (id: string, delta: number) =>
    setCart((c) => {
      const qty = (c[id] ?? 0) + delta;
      const { [id]: _drop, ...rest } = c;
      void _drop;
      return qty > 0 ? { ...rest, [id]: qty } : rest;
    });

  const lines = menu.items.filter((i) => i.available && cart[i.id] > 0).map((i) => ({ item: i, qty: cart[i.id] }));
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const cents = lines.reduce((s, l) => s + l.qty * Math.round(l.item.price * 100), 0);
  const href = (mode: OrderMode) =>
    waLink(
      phone,
      orderMessage(
        lines.map((l) => ({ qty: l.qty, name: pick(l.item.name, locale), price: l.item.price })),
        locale,
        mode,
      ),
    );

  return (
    <div className="menu">
      <nav className="tabs" aria-label={u.tabs}>
        {menu.categories.map((c) => (
          <a key={c.id} href={`#cat-${c.id}`} aria-current={active === c.id ? 'true' : undefined}>
            {pick(c.name, locale)}
          </a>
        ))}
      </nav>

      <div className="menu-cols">
      <div className="menu-body">
        {menu.categories.map((c) => (
          <section key={c.id} aria-labelledby={`cat-${c.id}`} className="menu-cat">
            <h2 id={`cat-${c.id}`}>{pick(c.name, locale)}</h2>
            {art?.[c.id] && (
              <div className="cat-art" aria-hidden="true">
                {art[c.id]}
              </div>
            )}
            <ul className="dishes">
              {menu.items
                .filter((i) => i.category === c.id)
                .map((i) => {
                  const qty = cart[i.id] ?? 0;
                  return (
                    <li key={i.id} className="dish" data-dish>
                      <h3 className="dish-name">{pick(i.name, locale)}</h3>
                      <p className="dish-price num">{formatUsd(i.price, locale)}</p>
                      <p className="dish-desc">
                        {pick(i.description, locale)}
                        {i.tags.length > 0 && <span className="dish-tags"> {i.tags.map((t) => u.tags[t]).join(', ')}.</span>}
                      </p>
                      {i.available ? (
                        <div className="stepper" data-on={qty > 0 ? '' : undefined}>
                          {qty > 0 && (
                            <>
                              <button type="button" className="step" data-testid={`remove-${i.id}`} onClick={() => change(i.id, -1)} aria-label={`${u.order.remove}: ${pick(i.name, locale)}`}>
                                <span aria-hidden="true">&minus;</span>
                              </button>
                              <span key={qty} className="qty num" aria-label={u.order.qty} data-testid={`qty-${i.id}`}>
                                {qty}
                              </span>
                            </>
                          )}
                          <button type="button" className="step step-add" data-testid={`add-${i.id}`} onClick={() => change(i.id, 1)} aria-label={`${u.add}: ${pick(i.name, locale)}`}>
                            <span aria-hidden="true">+</span>
                          </button>
                        </div>
                      ) : (
                        <p className="dish-out">{u.unavailable}</p>
                      )}
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
        <p className="menu-qr">
          <a className="text-link" href={pathFor('qr', locale)}>
            {u.qrLink}
          </a>
        </p>
      </div>
      </div>

      <div className="orderbar" role="region" aria-label={u.order.title} data-asking={asking && count > 0 ? '' : undefined}>
        {asking && count > 0 ? (
          <div className="ask">
            <p className="ask-q">{u.order.ask}</p>
            <a className="choice" href={href('takeaway')} target="_blank" rel="noopener noreferrer" data-testid="order-link-takeaway" onClick={() => setAsking(false)}>
              {u.order.takeaway}
            </a>
            <a className="choice" href={href('here')} target="_blank" rel="noopener noreferrer" data-testid="order-link-here" onClick={() => setAsking(false)}>
              {u.order.here}
            </a>
            <button type="button" className="text-link" onClick={() => setAsking(false)}>
              {u.order.back}
            </button>
          </div>
        ) : (
          <>
            <p className="ob-sum">
              <span>{count > 0 ? u.order.items.replace('{n}', String(count)) : u.order.empty}</span>
              <span className="ob-total">
                {u.order.total} <strong className="num" data-testid="total">{formatUsd(cents / 100, locale)}</strong>
              </span>
            </p>
            <button type="button" className="btn btn-wa" data-testid="order-open" disabled={count === 0} onClick={() => setAsking(true)}>
              {u.order.cta}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
