import { z } from "zod";

// Base schemas (used by others)
export const TreatmentItemSchema = z.object({
  name: z.string(),
  dosage: z.string().optional(),
  frequency: z.string(),
  type: z.enum(["medication", "lifestyle", "therapy"]),
  icon: z.string().optional(),
});

export const PhysicianNoteSchema = z.object({
  doctorName: z.string(),
  specialty: z.string(),
  date: z.string(),
  note: z.string(),
});

export const DocumentSchema = z.object({
  name: z.string(),
  date: z.string(),
  size: z.string(),
  type: z.enum(["pdf", "image"]),
});

export const RelatedVisitSchema = z.object({
  date: z.string(),
  title: z.string(),
  doctor: z.string().optional(),
});

// Health conditions schema
export const HealthConditionSchema = z.object({
  name: z.string(),
  status: z.enum(["ongoing", "resolved"]),
  diagnosedDate: z.string(),
  diagnosingDoctor: z.string().optional(),
});

export const HealthConditionsSchema = z.object({
  conditions: z.array(HealthConditionSchema),
});

// Vitals schema
export const VitalsSchema = z.object({
  patientName: z.string(),
  heartRate: z.number(),
  weight: z.number(),
  visitDate: z.string(),
});

// Timeline event schema
export const TimelineEventSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(["cardiology", "lab", "therapy", "neurology", "medication", "consultation"]),
  attachments: z.array(z.object({
    name: z.string(),
    type: z.enum(["pdf", "image"]),
  })).optional(),
  imageUrl: z.string().optional(),
});

export const MedicalHistorySchema = z.object({
  events: z.array(TimelineEventSchema),
});

// SSE message types
export type SSEMessage =
  | { type: "thinking"; content: string }
  | { type: "tool_use"; tool: string; input: unknown }
  | { type: "tool_result"; result: unknown }
  | { type: "text"; content: string }
  | { type: "result"; data: unknown }
  | { type: "error"; message: string }
  | { type: "done" };

// Inferred types
export type HealthCondition = z.infer<typeof HealthConditionSchema>;
export type HealthConditions = z.infer<typeof HealthConditionsSchema>;
export type Vitals = z.infer<typeof VitalsSchema>;
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;
export type MedicalHistory = z.infer<typeof MedicalHistorySchema>;
export type TreatmentItem = z.infer<typeof TreatmentItemSchema>;
export type PhysicianNote = z.infer<typeof PhysicianNoteSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type RelatedVisit = z.infer<typeof RelatedVisitSchema>;
