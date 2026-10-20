import { describe, expect, it } from 'vitest';
import { contactMessage, orderMessage, waLink } from './whatsapp';

describe('waLink', () => {
  it('keeps digits only in the phone', () => {
    expect(waLink('+593 99 123-4567', 'hola')).toBe('https://wa.me/593991234567?text=hola');
  });

  it('encodes ñ, accents and line breaks', () => {
    const url = waLink('593900000000', 'Café piña\nsegunda línea');
    expect(url).toContain('Caf%C3%A9%20pi%C3%B1a%0Asegunda%20l%C3%ADnea');
    expect(decodeURIComponent(url.split('text=')[1])).toBe('Café piña\nsegunda línea');
  });
});

describe('orderMessage', () => {
  const lines = [
    { qty: 2, name: 'Café pasado', price: 2.5 },
    { qty: 1, name: 'Pan de yuca (porción)', price: 3.25 },
  ];

  it('lists lines and sums the total in Spanish', () => {
    expect(orderMessage(lines, 'es')).toBe(
      'Hola, quisiera hacer este pedido:\n- 2 x Café pasado ($2,50)\n- 1 x Pan de yuca (porción) ($3,25)\nTotal: $8,25',
    );
  });

  it('uses English wording and a decimal point', () => {
    expect(orderMessage(lines, 'en')).toBe(
      'Hello, I would like to place this order:\n- 2 x Café pasado ($2.50)\n- 1 x Pan de yuca (porción) ($3.25)\nTotal: $8.25',
    );
  });

  it('does not drift on float sums', () => {
    expect(orderMessage([{ qty: 3, name: 'x', price: 0.1 }], 'en')).toContain('Total: $0.30');
  });
});

describe('contactMessage', () => {
  it('trims fields and keeps line breaks', () => {
    expect(contactMessage({ name: ' Ñusta ', message: 'Mesa para 4\nmañana ' }, 'es')).toBe(
      'Hola, les escribo desde el sitio web.\nNombre: Ñusta\nMensaje: Mesa para 4\nmañana',
    );
  });
});
