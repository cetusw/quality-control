try {
    const args = process.argv.slice(2);

    if (args.length !== 3) {
        console.log("Неизвестная ошибка");
        process.exit(1);
    }

    const [a, b, c] = args.map(Number);

    if (
        !Number.isFinite(a) ||
        !Number.isFinite(b) ||
        !Number.isFinite(c) ||
        a <= 0 ||
        b <= 0 ||
        c <= 0
    ) {
        console.log("Не треугольник");
        process.exit(0);
    }

    if (a + b <= c || a + c <= b || b + c <= a) {
        console.log("Не треугольник");
    } else if (a === b && b === c) {
        console.log("Равносторонний");
    } else if (a === b || a === c || b === c) {
        console.log("Равнобедренный");
    } else {
        console.log("Обычный");
    }
} catch {
    console.log("Неизвестная ошибка");
}