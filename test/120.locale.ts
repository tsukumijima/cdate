#!/usr/bin/env mocha -R spec

import {strict as assert} from "assert";
import * as samsonjs_strftime from "strftime";

import {strftime as cdate_strftime} from "../src/strftime";
import {en_US} from "../locale/en_US";
import {fr_FR} from "../locale/fr_FR";

const TITLE = __filename.split("/").pop()!;

const samsonjs = {strftime: samsonjs_strftime as any as { localizeByIdentifier: (locale: string) => typeof samsonjs_strftime }};
const cdate = {strftime: cdate_strftime};
const locales = {en_US, fr_FR};

describe(TITLE, () => {
    describe("samsonjs/strftime", () => {
        /**
         * localizeByIdentifier function is missing at DefinitelyTyped
         * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/strftime/index.d.ts
         * @see https://github.com/samsonjs/strftime/blob/master/strftime.js
         */
        runTests(locale => samsonjs.strftime.localizeByIdentifier(locale));
    });

    describe("kawanet/cdate", () => {
        runTests(locale => cdate.strftime.locale(locales[locale]));
    });
});

function runTests(fn: (locale: keyof typeof locales) => (fmt: string, dt: Date) => string) {
    const dt = new Date("2023-04-05 06:07:08.090");
    const fmt = "%Y/%m/%d %H:%M:%S.%L";

    it("en_US", () => {
        const strftime = fn("en_US");

        assert.equal(strftime(fmt, dt), "2023/04/05 06:07:08.090");
        assert.equal(strftime(`"%A"`, dt), `"Wednesday"`, `"%A"`);
        assert.equal(strftime(`"%a"`, dt), `"Wed"`, `"%a"`);
        assert.equal(strftime(`"%B"`, dt), `"April"`, `"%B"`);
        assert.equal(strftime(`"%b"`, dt), `"Apr"`, `"%b"`);
        assert.equal(strftime(`"%D"`, dt), `"04/05/23"`, `"%D"`);
    });

    it("fr_FR", () => {
        const strftime = fn("fr_FR");

        assert.equal(strftime(fmt, dt), "2023/04/05 06:07:08.090");
        assert.equal(strftime(`"%A"`, dt), `"mercredi"`, `"%A"`);
        assert.equal(strftime(`"%a"`, dt), `"mer."`, `"%a"`);
        assert.equal(strftime(`"%B"`, dt), `"avril"`, `"%B"`);
        assert.equal(strftime(`"%b"`, dt), `"avril"`, `"%b"`);
        assert.equal(strftime(`"%D"`, dt), `"05/04/2023"`, `"%D"`);
    });
}
