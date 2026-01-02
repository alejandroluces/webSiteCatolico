import React, { Fragment, useMemo, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

type ISODateString = string; // YYYY-MM-DD

function isIsoDateString(value: string): value is ISODateString {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toISODateStringLocal(date: Date): ISODateString {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfMonth(year: number, monthIndex: number): Date {
  return new Date(year, monthIndex, 1);
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function addMonths(base: Date, months: number): Date {
  const d = new Date(base);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

function isoToDateLocal(iso: ISODateString): Date {
  // Create date in local time at midnight to avoid timezone shifting.
  const [y, m, d] = iso.split('-').map((v) => Number(v));
  return new Date(y, m - 1, d);
}

type CalendarMonthProps = {
  monthBase: Date;
  selectedDate?: ISODateString;
  onSelect: (date: ISODateString) => void;
  isDateEnabled: (iso: ISODateString) => boolean;
  todayIso: ISODateString;
};

const weekDaysEs = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const CalendarMonth: React.FC<CalendarMonthProps> = ({
  monthBase,
  selectedDate,
  onSelect,
  isDateEnabled,
  todayIso,
}) => {
  const year = monthBase.getFullYear();
  const monthIndex = monthBase.getMonth();

  const first = startOfMonth(year, monthIndex);
  const dim = daysInMonth(year, monthIndex);

  // Convert JS (Sun=0) to Mon-based index.
  const offset = (first.getDay() + 6) % 7;
  const totalCells = offset + dim;
  const rows = Math.ceil(totalCells / 7);

  return (
    <div className="w-full">
      <div className="text-center text-sm font-semibold text-marian-blue-900 dark:text-gray-100 capitalize">
        {formatMonthYear(monthBase)}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400">
        {weekDaysEs.map((d) => (
          <div key={d} className="py-1 font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: rows * 7 }).map((_, idx) => {
          const dayNum = idx - offset + 1;
          if (dayNum < 1 || dayNum > dim) {
            return <div key={idx} className="h-9" />;
          }

          const date = new Date(year, monthIndex, dayNum);
          const iso = toISODateStringLocal(date);
          const enabled = isDateEnabled(iso);
          const isSelected = selectedDate === iso;
          const isToday = todayIso === iso;

          return (
            <button
              key={idx}
              type="button"
              disabled={!enabled}
              onClick={() => onSelect(iso)}
              className={
                `h-9 rounded-md text-sm transition-colors relative ` +
                (enabled
                  ? 'hover:bg-marian-blue-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                  : 'text-gray-300 dark:text-gray-600 cursor-not-allowed') +
                (isSelected
                  ? ' bg-marian-blue-100 dark:bg-gray-700 ring-1 ring-marian-blue-300 dark:ring-gray-600 font-semibold'
                  : '')
              }
              aria-label={iso}
            >
              {dayNum}
              {isToday && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-sacred-gold-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export type DateCalendarPopoverProps = {
  selectedDate?: ISODateString;
  onSelectDate: (date?: ISODateString) => void;
  enabledDates?: Set<ISODateString> | null;
  maxDate?: Date;
  label?: string;
  formatSelectedDate: (iso?: ISODateString) => string;
  isLoading?: boolean;
};

/**
 * Date picker with a small calendar popover.
 * If `enabledDates` is provided and has entries, only those dates are clickable.
 */
const DateCalendarPopover: React.FC<DateCalendarPopoverProps> = ({
  selectedDate,
  onSelectDate,
  enabledDates,
  maxDate,
  label = 'Fecha',
  formatSelectedDate,
  isLoading = false,
}) => {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const todayIso = useMemo(() => toISODateStringLocal(today), [today]);
  const max = maxDate ? new Date(maxDate) : today;
  max.setHours(0, 0, 0, 0);

  const [baseMonth, setBaseMonth] = useState<Date>(() => {
    const base = selectedDate && isIsoDateString(selectedDate) ? isoToDateLocal(selectedDate) : today;
    return startOfMonth(base.getFullYear(), base.getMonth());
  });

  const shouldRestrictToEnabledDates = Boolean(enabledDates && enabledDates.size > 0);

  const isDateEnabled = (iso: ISODateString) => {
    if (!isIsoDateString(iso)) return false;
    const date = isoToDateLocal(iso);
    date.setHours(0, 0, 0, 0);
    if (date > max) return false;
    if (shouldRestrictToEnabledDates && enabledDates && !enabledDates.has(iso)) return false;
    return true;
  };

  const handleSelect = (iso: ISODateString) => {
    if (!isDateEnabled(iso)) return;
    onSelectDate(iso);
  };

  const month2 = useMemo(() => addMonths(baseMonth, 1), [baseMonth]);

  return (
    <Popover className="relative">
      <Popover.Button
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-white/70 dark:bg-gray-800/60 border border-gray-200/70 dark:border-gray-700/70 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-colors"
        aria-label={label}
      >
        <Calendar className="h-4 w-4" />
        <span className="capitalize">{formatSelectedDate(selectedDate)}</span>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 -translate-x-1/2 mt-3 w-[92vw] max-w-[720px] z-50">
          <div className="rounded-2xl shadow-xl border border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-900 p-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="text-sm font-semibold text-marian-blue-900 dark:text-gray-100">{label}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBaseMonth((m) => addMonths(m, -1))}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setBaseMonth((m) => addMonths(m, 1))}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  aria-label="Mes siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                Cargando calendario...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <CalendarMonth
                  monthBase={baseMonth}
                  selectedDate={selectedDate}
                  onSelect={handleSelect}
                  isDateEnabled={isDateEnabled}
                  todayIso={todayIso}
                />
                <CalendarMonth
                  monthBase={month2}
                  selectedDate={selectedDate}
                  onSelect={handleSelect}
                  isDateEnabled={isDateEnabled}
                  todayIso={todayIso}
                />
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {shouldRestrictToEnabledDates
                  ? 'Solo se habilitan días con evangelio disponible.'
                  : 'Selecciona una fecha (hasta hoy).'}
              </div>

              {selectedDate && (
                <button
                  type="button"
                  onClick={() => onSelectDate(undefined)}
                  className="text-sm font-medium text-marian-blue-700 dark:text-sacred-gold-300 hover:underline"
                >
                  Ver hoy
                </button>
              )}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default DateCalendarPopover;

