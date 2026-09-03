const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DDMYYYY_RE = /^\d{8}$/;

export function assertIsoDate(value, label = 'date') {
  if (!ISO_DATE_RE.test(String(value || ''))) {
    throw new Error(`${label} debe tener formato YYYY-MM-DD.`);
  }

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`${label} no es una fecha valida: ${value}`);
  }

  return value;
}

export function isoToDdmmyyyy(value) {
  assertIsoDate(value);
  const [year, month, day] = value.split('-');
  return `${day}${month}${year}`;
}

export function ddmmyyyyToIso(value) {
  if (!DDMYYYY_RE.test(String(value || ''))) {
    throw new Error(`La fecha debe tener formato DDMMYYYY: ${value}`);
  }

  const day = value.slice(0, 2);
  const month = value.slice(2, 4);
  const year = value.slice(4, 8);
  return assertIsoDate(`${year}-${month}-${day}`);
}

export function resolveDateRange(args) {
  if (args.date) {
    return [assertIsoDate(args.date, '--date')];
  }

  const from = args.from || args.start;
  const to = args.to || args.end;

  if (!from || !to) {
    throw new Error('Indica --date=YYYY-MM-DD o --from=YYYY-MM-DD --to=YYYY-MM-DD.');
  }

  assertIsoDate(from, '--from');
  assertIsoDate(to, '--to');

  if (from > to) {
    throw new Error('--from debe ser menor o igual que --to.');
  }

  const out = [];
  const cursor = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);

  while (cursor <= end) {
    out.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return out;
}
