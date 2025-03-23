import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core"

export const workspacesTable = pgTable("workspaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  sharing: text("sharing").notNull().default("private"),
  defaultContextLength: integer("default_context_length").notNull(),
  defaultModel: text("default_model").notNull(),
  defaultPrompt: text("default_prompt").notNull(),
  defaultTemperature: text("default_temperature").notNull(),
  description: text("description").notNull(),
  embeddingsProvider: text("embeddings_provider").notNull(),
  includeProfileContext: boolean("include_profile_context").notNull(),
  includeWorkspaceInstructions: boolean(
    "include_workspace_instructions"
  ).notNull(),
  instructions: text("instructions").notNull(),
  isHome: boolean("is_home").notNull().default(false),
  name: text("name").notNull()
})

export type InsertWorkspace = typeof workspacesTable.$inferInsert
export type SelectWorkspace = typeof workspacesTable.$inferSelect
