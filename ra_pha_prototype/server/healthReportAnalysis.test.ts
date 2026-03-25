import { describe, it, expect, beforeAll } from "vitest";
import { analyzeDocument } from "../server/_core/documentProcessor";

describe("Health Report Analysis - Real Document Processing", () => {
  describe("Document Analysis", () => {
    it("should analyze base64 encoded health documents", async () => {
      // Sample base64 encoded health report
      const base64HealthReport = `data:application/pdf;base64,JVBERi0xLjQKJeLj...`;

      const result = await analyzeDocument(
        base64HealthReport,
        "pdf",
        "blood_work"
      );

      expect(result).toBeDefined();
      expect(result.extractedMetrics).toBeDefined();
      expect(result.documentType).toBe("blood_work");
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it("should extract health metrics from documents", async () => {
      const mockHealthReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        mockHealthReport,
        "pdf",
        "blood_work"
      );

      expect(result.extractedMetrics).toHaveProperty("bloodWork");
      expect(result.extractedMetrics).toHaveProperty("vitalSigns");
      expect(result.extractedMetrics).toHaveProperty("anthropometry");
    });

    it("should calculate health score based on metrics", async () => {
      const mockHealthReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        mockHealthReport,
        "pdf",
        "blood_work"
      );

      expect(result.extractedMetrics.healthScore).toBeGreaterThanOrEqual(0);
      expect(result.extractedMetrics.healthScore).toBeLessThanOrEqual(100);
    });

    it("should identify health risks from metrics", async () => {
      const mockHealthReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        mockHealthReport,
        "pdf",
        "blood_work"
      );

      expect(result.extractedMetrics.risks).toBeDefined();
      expect(Array.isArray(result.extractedMetrics.risks.risks)).toBe(true);
      expect(Array.isArray(result.extractedMetrics.risks.abnormalValues)).toBe(
        true
      );
    });

    it("should generate clinical summary", async () => {
      const mockHealthReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        mockHealthReport,
        "pdf",
        "blood_work"
      );

      expect(result.extractedMetrics.clinicalSummary).toBeDefined();
      expect(typeof result.extractedMetrics.clinicalSummary).toBe("string");
      expect(result.extractedMetrics.clinicalSummary.length).toBeGreaterThan(0);
    });

    it("should handle image documents", async () => {
      const mockImageReport = `data:image/jpeg;base64,/9j/4AAQSkZJRg==`;

      const result = await analyzeDocument(
        mockImageReport,
        "image",
        "imaging"
      );

      expect(result).toBeDefined();
      expect(result.documentType).toBe("imaging");
    });

    it("should handle different report types", async () => {
      const reportTypes: Array<
        "blood_work" | "imaging" | "pathology" | "general_checkup" | "other"
      > = ["blood_work", "imaging", "pathology", "general_checkup", "other"];

      for (const reportType of reportTypes) {
        const mockReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

        const result = await analyzeDocument(mockReport, "pdf", reportType);

        expect(result.documentType).toBe(reportType);
        expect(result.extractedMetrics).toBeDefined();
      }
    });

    it("should provide confidence score for analysis", async () => {
      const mockHealthReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        mockHealthReport,
        "pdf",
        "blood_work"
      );

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it("should handle analysis errors gracefully", async () => {
      const invalidReport = `data:application/pdf;base64,`;

      const result = await analyzeDocument(
        invalidReport,
        "pdf",
        "blood_work"
      );

      // Should return default structure instead of throwing
      expect(result).toBeDefined();
      expect(result.extractedMetrics).toBeDefined();
      expect(result.extractedMetrics.healthScore).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Health Metrics Extraction", () => {
    it("should extract blood work metrics", async () => {
      const mockReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        mockReport,
        "pdf",
        "blood_work"
      );

      const bloodWork = result.extractedMetrics.bloodWork;
      expect(bloodWork).toBeDefined();
      // Check for common blood work metrics
      if (Object.keys(bloodWork).length > 0) {
        expect(
          Object.keys(bloodWork).some((key) =>
            [
              "hemoglobin",
              "glucose",
              "cholesterol",
              "ldl",
              "hdl",
              "triglycerides",
            ].includes(key)
          )
        ).toBe(true);
      }
    });

    it("should extract vital signs", async () => {
      const mockReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        mockReport,
        "pdf",
        "general_checkup"
      );

      const vitalSigns = result.extractedMetrics.vitalSigns;
      expect(vitalSigns).toBeDefined();
    });

    it("should identify abnormal values", async () => {
      const mockReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        mockReport,
        "pdf",
        "blood_work"
      );

      const abnormalValues = result.extractedMetrics.risks.abnormalValues;
      expect(Array.isArray(abnormalValues)).toBe(true);
    });
  });

  describe("Risk Assessment", () => {
    it("should identify health risks", async () => {
      const mockReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        mockReport,
        "pdf",
        "blood_work"
      );

      const risks = result.extractedMetrics.risks.risks;
      expect(Array.isArray(risks)).toBe(true);

      if (risks.length > 0) {
        risks.forEach((risk) => {
          expect(risk).toHaveProperty("condition");
          expect(["low", "medium", "high", "critical"]).toContain(
            risk.severity
          );
        });
      }
    });

    it("should generate urgent alerts for critical conditions", async () => {
      const mockReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        mockReport,
        "pdf",
        "blood_work"
      );

      const urgentAlerts = result.extractedMetrics.risks.urgentAlerts;
      expect(Array.isArray(urgentAlerts)).toBe(true);
    });

    it("should calculate appropriate health score", async () => {
      const mockReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        mockReport,
        "pdf",
        "blood_work"
      );

      const healthScore = result.extractedMetrics.healthScore;
      expect(healthScore).toBeGreaterThanOrEqual(0);
      expect(healthScore).toBeLessThanOrEqual(100);

      // Health score should be reasonable based on risks
      const riskCount = result.extractedMetrics.risks.risks.length;
      if (riskCount > 0) {
        expect(healthScore).toBeLessThan(100);
      }
    });
  });

  describe("Clinical Summary", () => {
    it("should generate meaningful clinical summary", async () => {
      const mockReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        mockReport,
        "pdf",
        "blood_work"
      );

      const summary = result.extractedMetrics.clinicalSummary;
      expect(summary).toBeDefined();
      expect(summary.length).toBeGreaterThan(10);
      expect(typeof summary).toBe("string");
    });

    it("should include key findings in summary", async () => {
      const mockReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        mockReport,
        "pdf",
        "blood_work"
      );

      const summary = result.extractedMetrics.clinicalSummary;
      // Summary should mention analysis or findings
      expect(
        summary.toLowerCase().includes("analysis") ||
          summary.toLowerCase().includes("findings") ||
          summary.toLowerCase().includes("report")
      ).toBe(true);
    });
  });

  describe("Document Type Detection", () => {
    it("should detect PDF documents", async () => {
      const pdfReport = `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`;

      const result = await analyzeDocument(
        pdfReport,
        "pdf",
        "blood_work"
      );

      expect(result).toBeDefined();
    });

    it("should detect image documents", async () => {
      const imageReport = `data:image/jpeg;base64,/9j/4AAQSkZJRg==`;

      const result = await analyzeDocument(
        imageReport,
        "image",
        "imaging"
      );

      expect(result).toBeDefined();
    });

    it("should handle mixed report types", async () => {
      const reports = [
        { data: `data:application/pdf;base64,SGVhbHRoIFJlcG9ydA==`, type: "pdf" as const },
        { data: `data:image/png;base64,iVBORw0KGgo=`, type: "image" as const },
      ];

      for (const report of reports) {
        const result = await analyzeDocument(
          report.data,
          report.type,
          "blood_work"
        );
        expect(result).toBeDefined();
      }
    });
  });
});
