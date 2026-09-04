class FloatingPointCoprocessor {
    constructor() {
        this.lastOperation = null;
        this.lastResult = null;
    }

    calculate(operation, a, b) {
        a = Number(a);
        b = Number(b);

        let result;

        switch (operation) {
            case "ADD":
                result = a + b;
                break;

            case "SUB":
                result = a - b;
                break;

            case "MUL":
                result = a * b;
                break;

            case "DIV":
                if (b === 0) {
                    throw new Error("No se puede dividir entre cero");
                }
                result = a / b;
                break;

            default:
                throw new Error("Operación no válida");
        }

        this.lastOperation = operation;
        this.lastResult = result;

        return result;
    }
}