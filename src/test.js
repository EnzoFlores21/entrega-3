class ErrorHandler {
    constructor() {
        this.errorDictionary = {
            MISSING_TITLE: "El campo 'title' es obligatorio.",
            MISSING_PRICE: "El campo 'price' es obligatorio.",
            INVALID_STOCK: "El campo 'stock' debe ser un número válido.",
            MISSING_FIELDS: "Faltan campos requeridos: ",
        };
    }

    customizeError(errorCode, additionalDetails = "") {
        const defaultMessage = this.errorDictionary[errorCode];
        if (!defaultMessage) {
            throw new Error(`Código de error desconocido: ${errorCode}`);
        }

        return `${defaultMessage} ${additionalDetails}`;
    }

    handleValidationError(errors) {
        const formattedErrors = errors.map((error) => this.customizeError(error));
        return new Error(formattedErrors.join("\n"));
    }
}

const errorHandler = new ErrorHandler();

export const generateSingleProduct = (overrides = {}) => {
    const { title, price, stock, ...otherOverrides } = overrides;

    // Validación para campos requeridos
    const missingFields = [];
    if (!title) missingFields.push("MISSING_TITLE");
    if (!price) missingFields.push("MISSING_PRICE");

    if (missingFields.length > 0) {
        throw errorHandler.handleValidationError(missingFields);
    }

    // Validación para stock
    if (stock !== undefined && isNaN(stock)) {
        throw new Error(errorHandler.customizeError("INVALID_STOCK"));
    }

    // Resto de la lógica para generar el producto
    return {
        _id: faker.datatype.uuid(),
        title,
        description: faker.commerce.productDescription(),
        price,
        thumbnail: faker.image.imageUrl(),
        code: faker.datatype.uuid(),
        stock:
            stock !== undefined
                ? parseFloat(stock)
                : faker.datatype.number({ min: 0, max: 50 }),
        status: true,
        category: faker.commerce.department(),
        ...otherOverrides,
    };
};