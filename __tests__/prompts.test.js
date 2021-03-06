const path = require("path");

const prompts = require("../config/prompts");

const currentRootDirectory = path.basename(process.cwd());

const { appname, directoriesList, prettierrc, version } = prompts.reduce((result, item) => {
    result[item.name] = item;
    return result;
}, {});

describe("Generator prompts", () => {
    describe("appname", () => {
        test("defaults to the current root directory name", () => {
            expect(appname.default).toBe(currentRootDirectory);
        });

        test("filters regular project names correctly", () => {
            const expectedOutput = "foo-bar-baz";
            expect(appname.filter(" foo bar baz ")).toBe(expectedOutput);
            expect(appname.filter("Foo Bar Baz")).toBe(expectedOutput);
            expect(appname.filter("foo-bar-baz")).toBe(expectedOutput);
            expect(appname.filter("foo_bar_baz")).toBe(expectedOutput);
            expect(appname.filter("@foobar-foo-bar-baz")).toBe(`foobar-${expectedOutput}`);
        });

        test("filters regular @scoped project names correctly", () => {
            const expectedOutput = "foo-bar-baz";
            expect(appname.filter(" @foobar/foo bar baz ")).toBe(`@foobar/${expectedOutput}`);
            expect(appname.filter("@foobar/foo-bar-baz")).toBe(`@foobar/${expectedOutput}`);
            expect(appname.filter("@foo-bar/foo-bar-baz")).toBe(`@foo-bar/${expectedOutput}`);
        });

        test("validates correctly", () => {
            expect(appname.validate("")).toBe(false);
            expect(appname.validate("   ")).toBe(false);
            expect(appname.validate("foobar")).toBe(true);
        });
    });

    describe("version", () => {
        test("defaults to `1.0.0`", () => {
            expect(version.default).toBe("1.0.0");
        });

        test("validates correctly", () => {
            expect(version.validate("")).toBe(false);
            expect(version.validate("A.B.C")).toBe(false);
            expect(version.validate("1.1.2")).toBe(true);
            expect(version.validate("  1.1.2  ")).toBe(true);
            expect(version.validate("100.155.299")).toBe(true);
        });
    });

    describe("directories", () => {
        test("directory input to be stored", () => {
            expect(directoriesList.default).toBe(undefined);
            expect(directoriesList.store).toBe(true);
        });

        test("filtering an empty string returns empty array", () => {
            expect(directoriesList.filter("")).toStrictEqual([]);
            expect(directoriesList.filter("   ")).toStrictEqual([]);
        });

        test("filters both strings & array inputs correctly", () => {
            const expectedResult = ["one", "two/sub", "three"];
            expect(directoriesList.filter("one, two/sub, three")).toStrictEqual(expectedResult);
            expect(directoriesList.filter(expectedResult)).toStrictEqual(expectedResult);
        });
    });
});
