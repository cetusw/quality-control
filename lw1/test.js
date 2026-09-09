const fs = require("fs");
const { spawnSync } = require("child_process");

const TEST_CASES_FILE = "test-cases.txt";
const PROGRAM = "./triangle.js";

try {
    const content = fs.readFileSync(TEST_CASES_FILE, "utf8");

    const lines = content
        .split(/\r?\n/)
        .filter(line => line.trim() !== "");

    lines.forEach((line, index) => {
        const parts = line.trim().split(/\s+/);

        if (parts.length < 4) {
            console.log(`${index + 1} error`);
            return;
        }

        const [a, b, c] = parts;
        const expected = parts.slice(3).join(" ");

        const result = spawnSync(
            "node",
            [PROGRAM, a, b, c],
            {
                encoding: "utf8"
            }
        );

        if (result.error) {
            console.log(`${index + 1} error`);
            return;
        }

        const actual = result.stdout.trim();

        if (actual === expected) {
            console.log(`${index + 1} success`);
        } else {
            console.log(`${index + 1} error`);
        }
    });
} catch (error) {
    console.error("Ошибка при запуске тестов:", error.message);
}