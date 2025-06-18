import { errorMessage, successMessage } from "../texts";

describe("texts utility", () => {
  describe("errorMessage", () => {
    it("should generate error message with action", () => {
      const result = errorMessage("ao salvar");
      expect(result).toBe(
        "Ocorreu um erro ao salvar. Por favor, tente novamente ou contate o suporte."
      );
    });

    it("should handle different actions", () => {
      const result = errorMessage("ao carregar dados");
      expect(result).toBe(
        "Ocorreu um erro ao carregar dados. Por favor, tente novamente ou contate o suporte."
      );
    });

    it("should handle empty action", () => {
      const result = errorMessage("");
      expect(result).toBe(
        "Ocorreu um erro . Por favor, tente novamente ou contate o suporte."
      );
    });
  });

  describe("successMessage", () => {
    it("should generate success message with action", () => {
      const result = successMessage("Salvo");
      expect(result).toBe("Salvo com sucesso.");
    });

    it("should handle different actions", () => {
      const result = successMessage("Produto criado");
      expect(result).toBe("Produto criado com sucesso.");
    });

    it("should handle empty action", () => {
      const result = successMessage("");
      expect(result).toBe(" com sucesso.");
    });
  });
});
