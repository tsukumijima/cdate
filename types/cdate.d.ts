/**
 * cdate.d.ts
 */

declare namespace cdateNS {
    type UnitLong = "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
    type UnitLongS = "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
    type UnitShort = "s" | "m" | "h" | "d" | "w" | "M" | "y";
    type UnitForNext = UnitLong | UnitShort | "millisecond" | "ms";
    type UnitForAdd = UnitForNext | UnitLongS | "milliseconds";
    type UnitForStart = UnitLong | UnitShort | "date";

    interface CDate {
        cdate(dt: Date): CDate;

        format(format: string): string;

        text(format: string): string;

        toDate(): Date;

        toJSON(): string;

        add(diff: number, unit?: UnitForAdd): CDate;

        startOf(unit: UnitForStart): CDate;

        endOf(unit: UnitForStart): CDate;

        next(unit: UnitForNext): CDate;

        prev(unit: UnitForNext): CDate;

        utc(): CDate;

        tz(timezone: string): CDate;

        locale(locale: cdateNS.Locale): CDate;
    }

    interface strftime {
        (fmt: string, dt?: Date): string;
    }

    type Locale = { [specifier: string]: string | ((dt: Date) => string | number) };
}

export const cdate: (dt?: string | number | Date) => cdateNS.CDate;

export const strftime: (fmt: string, dt?: Date) => string;
