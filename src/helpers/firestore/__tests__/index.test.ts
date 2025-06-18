import { BaseModel } from "../model/baseModel";
import { Collections } from "../collections";
import { FirestoreHelper } from "../index";
import { QueryFieldFilterConstraint } from "firebase/firestore";

// Mock Firebase Firestore
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => "mock-db"),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
}));

// Mock Firebase app
jest.mock("@/firebase-config", () => ({
  app: {},
}));

// Mock console methods
const consoleSpy = {
  error: jest.spyOn(console, "error").mockImplementation(),
  log: jest.spyOn(console, "log").mockImplementation(),
};

describe("FirestoreHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.error.mockRestore();
    consoleSpy.log.mockRestore();
  });

  describe("get", () => {
    it("should fetch documents from collection successfully", async () => {
      const mockDocs = [
        { data: () => ({ id: "1", name: "Test 1" }) },
        { data: () => ({ id: "2", name: "Test 2" }) },
      ];

      const mockGetDocs = require("firebase/firestore").getDocs;
      const mockCollection = require("firebase/firestore").collection;

      mockCollection.mockReturnValue("mock-collection");
      mockGetDocs.mockResolvedValue({ docs: mockDocs });

      const result = await FirestoreHelper.get(Collections.Produtos);

      expect(mockCollection).toHaveBeenCalledWith(
        "mock-db",
        Collections.Produtos
      );
      expect(mockGetDocs).toHaveBeenCalledWith("mock-collection");
      expect(result).toEqual([
        { id: "1", name: "Test 1" },
        { id: "2", name: "Test 2" },
      ]);
    });

    it("should handle errors when fetching documents", async () => {
      const mockGetDocs = require("firebase/firestore").getDocs;
      const mockCollection = require("firebase/firestore").collection;

      const error = new Error("Firestore error");
      mockCollection.mockReturnValue("mock-collection");
      mockGetDocs.mockRejectedValue(error);

      await expect(FirestoreHelper.get(Collections.Produtos)).rejects.toThrow(
        "Firestore error"
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getBy", () => {
    it("should fetch a single document by id successfully", async () => {
      const mockDoc = { data: () => ({ id: "1", name: "Test Product" }) };
      const mockGetDoc = require("firebase/firestore").getDoc;
      const mockDocRef = require("firebase/firestore").doc;

      mockDocRef.mockReturnValue("mock-doc-ref");
      mockGetDoc.mockResolvedValue(mockDoc);

      const result = await FirestoreHelper.getBy("1", Collections.Produtos);

      expect(mockDocRef).toHaveBeenCalledWith(
        "mock-db",
        Collections.Produtos,
        "1"
      );
      expect(mockGetDoc).toHaveBeenCalledWith("mock-doc-ref");
      expect(result).toEqual({ id: "1", name: "Test Product" });
    });

    it("should handle errors when fetching document by id", async () => {
      const mockGetDoc = require("firebase/firestore").getDoc;
      const mockDocRef = require("firebase/firestore").doc;

      const error = new Error("Document not found");
      mockDocRef.mockReturnValue("mock-doc-ref");
      mockGetDoc.mockRejectedValue(error);

      await expect(
        FirestoreHelper.getBy("1", Collections.Produtos)
      ).rejects.toThrow("Document not found");
      expect(consoleSpy.log).toHaveBeenCalledWith(error);
    });
  });

  describe("set", () => {
    it("should set document successfully", async () => {
      const mockSetDoc = require("firebase/firestore").setDoc;
      const mockDocRef = require("firebase/firestore").doc;

      const mockData: BaseModel = {
        id: "1",
        toJson: () => ({ id: "1", name: "Test" }),
      };

      mockDocRef.mockReturnValue("mock-doc-ref");
      mockSetDoc.mockResolvedValue(undefined);

      const result = await FirestoreHelper.set(Collections.Produtos, mockData);

      expect(mockDocRef).toHaveBeenCalledWith(
        "mock-db",
        Collections.Produtos,
        "1"
      );
      expect(mockSetDoc).toHaveBeenCalledWith("mock-doc-ref", {
        id: "1",
        name: "Test",
      });
      expect(result).toBe(true);
    });

    it("should handle errors when setting document", async () => {
      const mockSetDoc = require("firebase/firestore").setDoc;
      const mockDocRef = require("firebase/firestore").doc;

      const error = new Error("Set document failed");
      const mockData: BaseModel = {
        id: "1",
        toJson: () => ({ id: "1", name: "Test" }),
      };

      mockDocRef.mockReturnValue("mock-doc-ref");
      mockSetDoc.mockRejectedValue(error);

      const result = await FirestoreHelper.set(Collections.Produtos, mockData);

      expect(result).toBe(false);
      expect(consoleSpy.error).toHaveBeenCalledWith(error);
    });
  });

  describe("remove", () => {
    it("should remove document successfully", async () => {
      const mockDeleteDoc = require("firebase/firestore").deleteDoc;
      const mockDocRef = require("firebase/firestore").doc;

      mockDocRef.mockReturnValue("mock-doc-ref");
      mockDeleteDoc.mockResolvedValue(undefined);

      const result = await FirestoreHelper.remove("1", Collections.Produtos);

      expect(mockDocRef).toHaveBeenCalledWith(
        "mock-db",
        Collections.Produtos,
        "1"
      );
      expect(mockDeleteDoc).toHaveBeenCalledWith("mock-doc-ref");
      expect(result).toBe(true);
    });

    it("should handle errors when removing document", async () => {
      const mockDeleteDoc = require("firebase/firestore").deleteDoc;
      const mockDocRef = require("firebase/firestore").doc;

      const error = new Error("Delete failed");
      mockDocRef.mockReturnValue("mock-doc-ref");
      mockDeleteDoc.mockRejectedValue(error);

      const result = await FirestoreHelper.remove("1", Collections.Produtos);

      expect(result).toBe(false);
      expect(consoleSpy.error).toHaveBeenCalledWith(error);
    });
  });

  describe("getRealtime", () => {
    it("should set up real-time listener successfully", async () => {
      const mockOnSnapshot = require("firebase/firestore").onSnapshot;
      const mockCollection = require("firebase/firestore").collection;

      const mockCallback = jest.fn();
      mockCollection.mockReturnValue("mock-collection");
      mockOnSnapshot.mockImplementation((collection: any, callback: any) => {
        callback({ docs: [{ data: () => ({ id: "1" }) }] });
      });

      await FirestoreHelper.getRealtime(Collections.Produtos, mockCallback);

      expect(mockCollection).toHaveBeenCalledWith(
        "mock-db",
        Collections.Produtos
      );
      expect(mockOnSnapshot).toHaveBeenCalledWith(
        "mock-collection",
        expect.any(Function)
      );
      expect(mockCallback).toHaveBeenCalledWith([{ id: "1" }]);
    });

    it("should handle errors in real-time listener", async () => {
      const mockOnSnapshot = require("firebase/firestore").onSnapshot;
      const mockCollection = require("firebase/firestore").collection;

      const error = new Error("Realtime error");
      const mockCallback = jest.fn();
      mockCollection.mockReturnValue("mock-collection");
      mockOnSnapshot.mockImplementation(() => {
        throw error;
      });

      await expect(
        FirestoreHelper.getRealtime(Collections.Produtos, mockCallback)
      ).rejects.toThrow("Realtime error");
      expect(consoleSpy.error).toHaveBeenCalledWith(error);
    });
  });

  describe("rawQuery", () => {
    it("should execute raw query successfully", async () => {
      const mockOnSnapshot = require("firebase/firestore").onSnapshot;
      const mockQuery = require("firebase/firestore").query;
      const mockCollection = require("firebase/firestore").collection;

      const mockFilters: QueryFieldFilterConstraint[] = [
        {
          type: "where",
          field: "category",
          op: "==",
          value: "test",
        } as QueryFieldFilterConstraint,
      ];
      const mockCallback = jest.fn();

      mockCollection.mockReturnValue("mock-collection");
      mockQuery.mockReturnValue("mock-query");
      mockOnSnapshot.mockImplementation((query: any, callback: any) => {
        callback({ docs: [{ data: () => ({ id: "1" }) }] });
      });

      await FirestoreHelper.rawQuery(
        Collections.Produtos,
        mockFilters,
        mockCallback
      );

      expect(mockCollection).toHaveBeenCalledWith(
        "mock-db",
        Collections.Produtos
      );
      expect(mockQuery).toHaveBeenCalledWith("mock-collection", ...mockFilters);
      expect(mockOnSnapshot).toHaveBeenCalledWith(
        "mock-query",
        expect.any(Function)
      );
      expect(mockCallback).toHaveBeenCalledWith([{ id: "1" }]);
    });

    it("should handle errors in raw query", async () => {
      const mockOnSnapshot = require("firebase/firestore").onSnapshot;
      const mockQuery = require("firebase/firestore").query;
      const mockCollection = require("firebase/firestore").collection;

      const error = new Error("Query error");
      const mockFilters: QueryFieldFilterConstraint[] = [
        {
          type: "where",
          field: "category",
          op: "==",
          value: "test",
        } as QueryFieldFilterConstraint,
      ];
      const mockCallback = jest.fn();

      mockCollection.mockReturnValue("mock-collection");
      mockQuery.mockReturnValue("mock-query");
      mockOnSnapshot.mockImplementation(() => {
        throw error;
      });

      await expect(
        FirestoreHelper.rawQuery(
          Collections.Produtos,
          mockFilters,
          mockCallback
        )
      ).rejects.toThrow("Query error");
      expect(consoleSpy.error).toHaveBeenCalledWith(error);
    });
  });
});
