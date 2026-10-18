const { test } = require('node:test');
const assert = require('node:assert/strict');
const { dateInZone, validateDate, splitText, buildMessages, createTelegram, createStore, publish, main } = require('./telegramSender.js');

const content = { date: '2026-10-05', content: 'Evangelio', prayer: 'Oración', reference: 'Lucas' };
const messages = buildMessages(content, content.date, { image: false });
const noWait = async () => {};
const { extractPdfUrl, downloadPdf, preparePdfMessage, extractReadings } = require('./dominicosPdf');
const pdfUrl = 'https://www.dominicos.org/predicacion/pdf-evangelio-del-dia/16-10-2026.pdf';
const fakePdf = Buffer.from('%PDF-1.4\nfixture\n%%EOF');
function readingFixture(url, sunday = false) {
  return `<a href="${url}">PDF</a><div class="${sunday ? 'contenido-homilia' : 'contenido-dia'}">` +
    ['Primera lectura', 'Salmo', ...(sunday ? ['Segunda lectura'] : []), 'Evangelio del día'].map(title =>
      `<h2>${title}</h2><h3>Referencia de ${title}</h3><p>Texto con acentos: oración &amp; fe.<br>Segunda línea.</p>`).join('') +
    '<div><p>Publicidad excluida</p></div><h2>Reflexión del Evangelio de hoy</h2><h3>Comentario</h3><p>Reflexión excluida</p></div>';
}

test('extracts only readings, preserves line breaks, and refuses incomplete or wrong-day content', () => {
  const html = readingFixture(pdfUrl);
  const readings = extractReadings(html, '2026-10-16', 'https://www.dominicos.org/');
  assert.equal(readings.sections.length, 3);
  assert.equal(readings.sections[0].paragraphs[0], 'Texto con acentos: oración & fe.\nSegunda línea.');
  assert.doesNotMatch(JSON.stringify(readings), /excluida/);
  assert.throws(() => extractReadings(html.replace('<h2>Salmo</h2>', '<h2>Otra cosa</h2>'), '2026-10-16'));
  assert.throws(() => extractReadings(html, '2026-10-17'));
});

test('discovers only official PDFs for the requested day, including Sunday readings', () => {
  assert.equal(extractPdfUrl(`<a href="${pdfUrl}">PDF</a>`, '2026-10-16'), pdfUrl);
  const sunday = '/predicacion/pdf-homilia/18-10-2026/lecturas.pdf';
  assert.equal(extractPdfUrl(`<a href='/predicacion/pdf-homilia/18-10-2026/completa.pdf'>Todo</a><a href='${sunday}'>PDF</a>`, '2026-10-18'), `https://www.dominicos.org${sunday}`);
  for (const url of [pdfUrl.replace('16-10', '15-10'), pdfUrl.replace('www.dominicos.org', 'evil.example'), '/missing.pdf']) {
    assert.throws(() => extractPdfUrl(`<a href="${url}">PDF</a>`, '2026-10-16'));
  }
});

test('rejects HTML, truncated PDFs, failed downloads and oversized documents', async () => {
  for (const data of ['<html>Error</html>', '%PDF-1.4 truncated', Buffer.alloc(10 * 1024 * 1024 + 1)]) {
    await assert.rejects(downloadPdf(pdfUrl, async () => new Response(data)));
  }
  await assert.rejects(downloadPdf(pdfUrl, async () => new Response('', { status: 503 })));
  await assert.rejects(downloadPdf('https://evil.example/a.pdf'));
});

test('prepares branded Sunday PDF with all four readings via redirected homily', async () => {
  const calls = [];
  const url = 'https://www.dominicos.org/predicacion/pdf-homilia/18-10-2026/lecturas.pdf';
  const result = await preparePdfMessage('2026-10-18', async (requested) => {
    calls.push(requested);
    if (calls.length === 1) return { ok: true, url: 'https://www.dominicos.org/predicacion/homilia/18-10-2026/', text: async () => '' };
    return new Response(readingFixture(url, true));
  });
  assert.equal(calls.length, 2);
  assert.equal(result.payload.document, 'attach://lecturas');
  assert.equal(result.payload.readings.sections.length, 4);
  assert.equal(result.method, 'sendDocument');
});

test('follows dated homily links when Sunday redirects to hoy instead of homilia', async () => {
  const calls = [];
  const result = await preparePdfMessage('2026-10-18', async requested => {
    calls.push(requested);
    if (calls.length === 1) return {
      ok: true, url: 'https://www.dominicos.org/predicacion/evangelio-del-dia/hoy/',
      text: async () => '<a href="/predicacion/pdf-homilia/18-10-2026/introduccion.pdf">PDF</a>',
    };
    assert.equal(requested, 'https://www.dominicos.org/predicacion/homilia/18-10-2026/lecturas/');
    return new Response(readingFixture('/predicacion/pdf-homilia/18-10-2026/lecturas.pdf', true));
  });
  assert.equal(calls.length, 2);
  assert.equal(result.payload.readings.sections.length, 4);
  assert.equal(result.payload.readings.sourceUrl, calls[1]);
});

test('rejects wrong-day and external homily links on hoy fallback pages', async () => {
  for (const href of ['/predicacion/pdf-homilia/11-10-2026/introduccion.pdf',
    'https://evil.example/predicacion/pdf-homilia/18-10-2026/introduccion.pdf']) {
    let calls = 0;
    await assert.rejects(preparePdfMessage('2026-10-18', async () => {
      calls++;
      return new Response(`<a href="${href}">PDF</a>`);
    }), /No se encontró un enlace/);
    assert.equal(calls, 1);
  }
});

test('uploads customized PDF from saved readings without network access to Dominicos', async () => {
  const readings = extractReadings(readingFixture(pdfUrl), '2026-10-16', 'https://www.dominicos.org/');
  const telegram = createTelegram('123:fake', async (url, options) => {
    assert.ok(url.startsWith('https://api.telegram.org/'));
    assert.equal(options.body.get('readings'), null);
    const bytes = Buffer.from(await options.body.get('lecturas').arrayBuffer());
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
    assert.ok(bytes.length > 1000);
    return new Response(JSON.stringify({ ok: true, result: { message_id: 60 } }));
  });
  assert.equal((await telegram('sendDocument', { document: 'attach://lecturas', readings, chat_id: '-1001' })).message_id, 60);
});

test('uploads PDF as a named attachment and retains it on rate-limit retry', async () => {
  let sends = 0, downloads = 0;
  const telegram = createTelegram('123:fake', async (url, options) => {
    if (url === pdfUrl) { downloads++; return new Response(fakePdf); }
    assert.ok(url.endsWith('/sendDocument'));
    assert.equal(options.body.get('document'), 'attach://lecturas');
    assert.equal(options.body.get('chat_id'), '-1001');
    assert.equal(options.body.get('allow_paid_broadcast'), 'false');
    const attachment = options.body.get('lecturas');
    assert.equal(attachment.name, 'evangelio-y-lecturas-16-10-2026.pdf');
    assert.deepEqual(Buffer.from(await attachment.arrayBuffer()), fakePdf);
    return ++sends === 1
      ? new Response(JSON.stringify({ ok: false, error_code: 429, parameters: { retry_after: 1 } }), { status: 429 })
      : new Response(JSON.stringify({ ok: true, result: { message_id: 55 } }));
  }, noWait);
  assert.equal((await telegram('sendDocument', { document: pdfUrl, chat_id: '-1001' })).message_id, 55);
  assert.equal(downloads, 1);
  assert.equal(sends, 2);
});

test('a PDF download failure is safe to retry because Telegram was not called', async () => {
  const telegram = createTelegram('123:fake', async (url) => {
    assert.equal(url, pdfUrl);
    throw new Error('offline');
  });
  await assert.rejects(telegram('sendDocument', { document: pdfUrl }), (e) => e.definiteRejection === true);
});
function memoryStore() {
  let row;
  return {
    get row() { return row; },
    async claim(chatId, date, plan) {
      if (row?.status === 'sent') return null;
      if (row && row.status !== 'failed') throw new Error('incierto');
      row ||= { messages: structuredClone(plan), message_ids: [], next_index: 0 };
      row.status = 'sending';
      return structuredClone(row);
    },
    async update(chatId, date, changes) { Object.assign(row, structuredClone(changes)); },
  };
}

test('uses Santiago calendar date across UTC midnight and DST seasons', () => {
  assert.equal(dateInZone(new Date('2026-10-05T01:00:00Z')), '2026-10-04');
  assert.equal(dateInZone(new Date('2026-07-05T03:30:00Z')), '2026-07-04');
  assert.equal(dateInZone(new Date('2026-10-05T03:30:00Z')), '2026-10-05');
  assert.throws(() => validateDate('2026-02-30'));
});

test('splits long Unicode text without truncation or broken emoji', () => {
  const source = 'a'.repeat(3999) + '🙏'.repeat(3000);
  const chunks = splitText(source);
  assert.equal(chunks.join(''), source);
  assert.ok(chunks.every((s) => s.length <= 4000));
  assert.ok(chunks.every((s) => !/[\uD800-\uDBFF]$/.test(s)));
});

test('requires both texts and matching date; reuses existing media', () => {
  assert.throws(() => buildMessages({ ...content, prayer: '' }, content.date));
  assert.throws(() => buildMessages(content, '2026-10-06'));
  const plan = buildMessages({ ...content, image_url: '/image.png', gospel_audio_url: 'https://example.com/a.mp3' }, content.date, { siteUrl: 'https://example.com' });
  assert.deepEqual(plan.map((p) => p.method), ['sendPhoto', 'sendMessage', 'sendMessage', 'sendAudio']);
  assert.equal(plan[0].payload.photo, 'attach://santisimo');
  assert.throws(() => buildMessages({ ...content, gospel_audio_url: 'file:///secret' }, content.date));
});

test('daily photo is always Santisimo even when content has no image or a different image', () => {
  for (const image_url of [null, 'https://example.com/other.png']) {
    const plan = buildMessages({ ...content, image_url }, content.date);
    assert.equal(plan[0].method, 'sendPhoto');
    assert.equal(plan[0].payload.photo, 'attach://santisimo');
    assert.match(plan[1].payload.text, /Evangelio/);
    assert.equal(plan.filter((m) => m.method === 'sendPhoto').length, 1);
  }
  assert.equal(buildMessages(content, content.date, { image: false })[0].method, 'sendMessage');
});

test('uploads the exact bundled PNG with multipart and retries 429 without losing the image', async () => {
  const fs = require('node:fs/promises');
  const path = require('node:path');
  const bundled = await fs.readFile(path.join(__dirname, '../assets/Santisimo.png'));
  assert.equal(bundled.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  let calls = 0;
  const telegram = createTelegram('123:fake', async (url, options) => {
    assert.equal(options.headers['Content-Type'], undefined);
    assert.ok(options.body instanceof FormData);
    assert.equal(options.body.get('photo'), 'attach://santisimo');
    assert.equal(options.body.get('chat_id'), '-1001');
    assert.equal(options.body.get('allow_paid_broadcast'), 'false');
    const photo = options.body.get('santisimo');
    assert.equal(photo.name, 'Santisimo.png');
    assert.deepEqual(Buffer.from(await photo.arrayBuffer()), bundled);
    return ++calls === 1
      ? { ok: false, status: 429, json: async () => ({ ok: false, error_code: 429, parameters: { retry_after: 1 } }) }
      : { ok: true, json: async () => ({ ok: true, result: { message_id: 99 } }) };
  }, noWait);
  const photo = buildMessages(content, content.date)[0];
  assert.equal((await telegram(photo.method, { ...photo.payload, chat_id: '-1001' })).message_id, 99);
  assert.equal(calls, 2);
});

test('rerunning a completed publication sends nothing', async () => {
  const store = memoryStore();
  let calls = 0;
  const options = { store, telegram: async () => ({ message_id: ++calls }), chatId: '-1001', date: content.date, messages, wait: noWait };
  assert.equal((await publish(options)).status, 'sent');
  assert.equal((await publish(options)).status, 'already_sent');
  assert.equal(calls, 2);
});

test('definite rejection resumes only unsent parts using original saved content', async () => {
  const store = memoryStore();
  let calls = 0;
  const options = { store, chatId: '-1001', date: content.date, messages, wait: noWait };
  await assert.rejects(publish({ ...options, telegram: async () => {
    if (++calls === 2) throw Object.assign(new Error('rejected'), { definiteRejection: true });
    return { message_id: 10 };
  } }));
  assert.equal(store.row.next_index, 1);
  const sent = [];
  await publish({ ...options, messages: [], telegram: async (method, payload) => { sent.push(payload.text); return { message_id: 11 }; } });
  assert.deepEqual(sent, [messages[1].payload.text]);
});

test('uncertain transport result blocks subsequent retries', async () => {
  const store = memoryStore();
  let calls = 0;
  const options = { store, chatId: '-1001', date: content.date, messages, wait: noWait, telegram: async () => { calls++; throw new Error('timeout'); } };
  await assert.rejects(publish(options));
  assert.equal(store.row.status, 'uncertain');
  await assert.rejects(publish(options));
  assert.equal(calls, 1);
});

test('failed checkpoint after successful send does not resend on next run', async () => {
  const store = memoryStore();
  store.update = async () => { throw new Error('database unavailable'); };
  let calls = 0;
  const options = { store, chatId: '-1001', date: content.date, messages, wait: noWait, telegram: async () => ({ message_id: ++calls }) };
  await assert.rejects(publish(options));
  await assert.rejects(publish(options));
  assert.equal(calls, 1);
});

test('Telegram obeys retry_after and disables paid broadcasts', async () => {
  let calls = 0;
  const waits = [];
  const telegram = createTelegram('123:fake', async (url, options) => {
    assert.equal(JSON.parse(options.body).allow_paid_broadcast, false);
    return ++calls === 1
      ? { ok: false, status: 429, json: async () => ({ ok: false, error_code: 429, parameters: { retry_after: 3 } }) }
      : { ok: true, json: async () => ({ ok: true, result: { message_id: 1 } }) };
  }, async (ms) => waits.push(ms));
  assert.equal((await telegram('sendMessage', { text: 'test' })).message_id, 1);
  assert.deepEqual(waits, [3000]);
});

test('network errors never expose bot token and 5xx is ambiguous', async () => {
  const telegram = createTelegram('123:secret', async () => { throw new Error('https://api.telegram.org/bot123:secret'); });
  await assert.rejects(telegram('sendMessage', {}), (error) => !error.message.includes('secret') && !error.definiteRejection);
  const unavailable = createTelegram('123:secret', async () => ({ ok: false, status: 500, json: async () => ({ ok: false, error_code: 500 }) }));
  await assert.rejects(unavailable('sendMessage', {}), (error) => !error.definiteRejection);
});

test('atomic DB resume refuses concurrent claimant', async () => {
  const responses = [
    { ok: false, status: 409, data: { code: '23505' } },
    { ok: true, data: [{ status: 'failed' }] },
    { ok: true, data: [] },
  ];
  const store = createStore({ SUPABASE_URL: 'https://example.com', SUPABASE_SERVICE_ROLE_KEY: 'test' }, async (url, options) => {
    if (options.method === 'PATCH') assert.equal(url.searchParams.get('status'), 'eq.failed');
    const response = responses.shift();
    return { ...response, json: async () => response.data };
  });
  await assert.rejects(store.claim('-1001', content.date, messages), /Otro proceso/);
});

test('CLI fails closed before network when disabled or modes are contradictory', async () => {
  await assert.rejects(main(['--execute'], {}), /desactivado/);
  await assert.rejects(main(['--execute', '--dry-run'], {}), /exactamente/);
  await assert.rejects(main(['--execute', '--file=foo'], {}), /solo se permite/);
});
