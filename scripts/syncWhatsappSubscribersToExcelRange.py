"""Sync WhatsApp subscribers from Supabase to daily Excel files for a date range.

This is a wrapper around `scripts/syncWhatsappSubscribersToExcel.py` that loops
from --from-date to --to-date (inclusive) and runs the single-day sync.

Example:
  python scripts/syncWhatsappSubscribersToExcelRange.py --from-date 01082025 --to-date 07082025
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from datetime import datetime, timedelta


def parse_ddmmyyyy(value: str) -> datetime:
    v = (value or "").strip()
    try:
        return datetime.strptime(v, "%d%m%Y")
    except ValueError:
        raise argparse.ArgumentTypeError("Formato inválido, se espera DDMMYYYY")


def format_ddmmyyyy(d: datetime) -> str:
    return d.strftime("%d%m%Y")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Sincroniza suscriptores WhatsApp (Supabase) -> Excel diario (rango de fechas)"
    )

    parser.add_argument(
        "--from-date",
        required=True,
        type=parse_ddmmyyyy,
        help="Fecha inicio en formato DDMMYYYY (inclusive)",
    )
    parser.add_argument(
        "--to-date",
        required=True,
        type=parse_ddmmyyyy,
        help="Fecha fin en formato DDMMYYYY (inclusive)",
    )

    # Passthrough options to the single-day script
    parser.add_argument(
        "--excel-folder",
        default=None,
        help="(Passthrough) Carpeta donde están los Excel diarios",
    )
    parser.add_argument(
        "--template-row",
        type=int,
        default=None,
        help="(Passthrough) Fila usada como plantilla",
    )
    parser.add_argument(
        "--default-sms",
        type=int,
        default=None,
        help="(Passthrough) Valor SMS para filas nuevas (0=pending, 1=sent)",
    )
    parser.add_argument(
        "--message",
        default=None,
        help="(Passthrough) Texto del mensaje a colocar en TEXTO_MENSAJE",
    )
    parser.add_argument(
        "--only-whatsapp",
        action="store_true",
        help="(Passthrough) Solo sincroniza si la plantilla indica WHATSAPP=SI",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="No escribe ningún Excel, solo muestra ejecución por fecha",
    )

    args = parser.parse_args()

    start = args.from_date
    end = args.to_date
    if end < start:
        print("--to-date debe ser mayor o igual a --from-date", file=sys.stderr)
        return 2

    # base command
    script = "scripts/syncWhatsappSubscribersToExcel.py"

    day = start
    exit_code = 0
    while day <= end:
        date_str = format_ddmmyyyy(day)

        cmd = [sys.executable, script, "--date", date_str]

        if args.excel_folder:
            cmd += ["--excel-folder", args.excel_folder]
        if args.template_row is not None:
            cmd += ["--template-row", str(args.template_row)]
        if args.default_sms is not None:
            cmd += ["--default-sms", str(args.default_sms)]
        if args.message is not None:
            cmd += ["--message", args.message]
        if args.only_whatsapp:
            cmd += ["--only-whatsapp"]
        if args.dry_run:
            cmd += ["--dry-run"]

        print(f"\n=== Sync {date_str} ===")
        try:
            proc = subprocess.run(cmd, check=False)
        except KeyboardInterrupt:
            return 130

        if proc.returncode != 0:
            # keep going, but report failure at the end
            exit_code = proc.returncode

        day += timedelta(days=1)

    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())

