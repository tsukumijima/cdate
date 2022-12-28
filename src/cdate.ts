import type {cdate as cdateNS} from "../index.js";
import {formatPlugin} from "./format/texter.js";
import {calcPlugin} from "./calc/calc.js";
import {tzPlugin} from "./timezone/timezone.js";

class CDateCore {
    /**
     * millisecond since the UNIX epoch
     */
    readonly t: number | cdateNS.DateLike;

    /**
     * read-only version of DateLike
     */
    private d: cdateNS.DateLike;

    /**
     * options container
     */
    readonly x: cdateNS.Options;

    /**
     * the constructor
     */
    constructor(t: number | cdateNS.DateLike, x: cdateNS.Options) {
        this.t = t;
        if ("number" !== typeof t) {
            this.d = t;
        }
        this.x = x || Object.create({cdate: {}});
    }

    /**
     * cdate function factory
     */
    cdateFn(): cdateNS.cdate {
        return cdateFn(this);
    }

    /**
     * returns a read-write version of DateLike for manipulation
     */
    rw(): cdateNS.DateLike {
        const t = +this.t;
        const rw = this.x.rw;
        return rw ? rw(t) : new Date(t);
    }

    /**
     * returns a read-only version of DateLike for displaying
     */
    ro(): cdateNS.DateLike {
        return this.d || (this.d = this.rw());
    }

    /**
     * returns milliseconds since the epoch
     */
    valueOf(): number {
        return +this.ro();
    }

    /**
     * returns a bare Date object
     */
    toDate(): Date {
        return new Date(+this);
    }

    /**
     * returns a JSON representation of Date
     */
    toJSON(): string {
        return this.toDate().toJSON();
    }

    /**
     * returns an instance including the plugin
     */
    plugin<T, X>(fn: cdateNS.Plugin<T, X>) {
        const CDateClass = this.constructor as cdateNS.Class<{}, X>;
        const CDateX = fn(CDateClass) || CDateClass;
        return new CDateX(this.t, this.x as X);
    }

    /**
     * creates another CDate object with the DateLike given
     */
    create(dt: number | cdateNS.DateLike) {
        return new (this.constructor as cdateNS.Class)(dt, this.x);
    }

    /**
     * clones the CDate object
     */
    inherit() {
        const out = this.create(+this);
        // x is readonly
        (out as { x: typeof out.x }).x = Object.create(out.x);
        return out;
    }
}

const cdateFn = (base: CDateCore): cdateNS.cdate => {
    const isUTC = !!base.x.rw;

    return (dt) => {
        if (dt == null) {
            dt = new Date(); // now
        } else if ("string" === typeof dt) {
            // YYYY-MM-DD as is
            // YYYY-MM for YYYY-MM-01
            // YYYY for YYYY-01-01
            const m = dt.match(/^(\d{4})(?:([-/])(\d{2})(?:\2(\d{2})(?:[T\s]((\d{2}):(\d{2})(?::(\d{2})(\.\d+)?)?))?)?)?$/);
            if (m) {
                const year = +m[1];
                const month = +m[3] || 1;
                const date = +m[4] || 1;
                const hour = +m[6] || 0;
                const minute = +m[7] || 0;
                const second = +m[8] || 0;
                const ms = (+m[9]) * 1000 || 0;

                if (isUTC) {
                    // UTC
                    dt = new Date(Date.UTC(year, (month - 1), date, hour, minute, second, ms));
                    if (year < 100) dt.setUTCFullYear(year);
                    const out = base.create(+dt);
                    return out.add(-out.utcOffset(), "m");
                } else {
                    // local time
                    dt = new Date(year, (month - 1), date, hour, minute, second, ms);
                    if (year < 100) dt.setFullYear(year);
                }
            } else {
                dt = new Date(dt); // parse ISO string natively
            }
        } else {
            dt = new Date(+dt); // number or DateLike
        }
        if (isUTC) dt = +dt;
        return base.create(dt);
    };
};

export const cdate: cdateNS.cdate = new CDateCore(0, null)
    .plugin(formatPlugin)
    .plugin(calcPlugin)
    .plugin(tzPlugin)
    .cdateFn();
