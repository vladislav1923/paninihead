import { logger } from "./logger";

describe("logger", () => {
  const infoSpy = jest.spyOn(console, "info").mockImplementation(() => {});
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  afterEach(() => {
    infoSpy.mockClear();
    errorSpy.mockClear();
  });

  afterAll(() => {
    infoSpy.mockRestore();
    errorSpy.mockRestore();
  });

  describe("info", () => {
    it("logs message only", () => {
      logger.info("hello");
      expect(infoSpy).toHaveBeenCalledWith("hello", undefined);
    });

    it("logs message and meta", () => {
      logger.info("hello", { id: 1 });
      expect(infoSpy).toHaveBeenCalledWith("hello", { id: 1 });
    });
  });

  describe("error", () => {
    it("logs message only", () => {
      logger.error("oops");
      expect(errorSpy).toHaveBeenCalledWith("oops", undefined);
    });

    it("logs message and meta", () => {
      logger.error("oops", { code: "E1" });
      expect(errorSpy).toHaveBeenCalledWith("oops", { code: "E1" });
    });
  });
});
