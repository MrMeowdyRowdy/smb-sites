'use client';

import { useEffect, useRef, useState } from 'react';
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
  const tabsRef = useRef<HTMLElement>(null);

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

  // The current category is the last one whose heading has passed the line at 40 % of the viewport height.
  useEffect(() => {
    const heads = menu.categories.map((c) => document.getElementById(`cat-${c.id}`));
    const update = () => {
      const line = window.innerHeight * 0.4;
      let cur = menu.categories[0].id;
      heads.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) cur = menu.categories[i].id;
      });
      setActive(cur);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [menu.categories]);

  // On a phone the tab row scrolls sideways; keep the current tab in view.
  useEffect(() => {
    const row = tabsRef.current;
    const el = row?.querySelector<HTMLElement>('[aria-current="true"]');
    if (row && el && row.scrollWidth > row.clientWidth) row.scrollTo({ left: el.offsetLeft - 24 });
  }, [active]);

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
      <nav className="tabs" aria-label={u.tabs} ref={tabsRef}>
        {menu.categories.map((c) => (
          <a key={c.id} href={`#cat-${c.id}`} aria-current={active === c.id ? 'true' : undefined}>
            {pick(c.name, locale)}
          </a>
        ))}
      </nav>

      <div className="menu-cols">
      <aside className="menu-art" aria-hidden="true">
        <div className="menu-art-stick">
          {menu.categories.map((c) => (
            <div key={c.id} className="art-slide" data-on={active === c.id ? '' : undefined}>
              <span className="art-name">{pick(c.name, locale)}</span>
              {art?.[c.id]}
            </div>
          ))}
        </div>
      </aside>
      <div className="menu-body">
        {menu.categories.map((c) => (
          <section key={c.id} aria-labelledby={`cat-${c.id}`} className="menu-cat">
            <h2 id={`cat-${c.id}`}>{pick(c.name, locale)}</h2>
            {art?.[c.id] && (
              <div className="cat-art-m" aria-hidden="true">
                <span className="art-name">{pick(c.name, locale)}</span>
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
