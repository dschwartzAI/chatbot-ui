/**
 * @description
 * This migration adds two new conversation management columns
 * to the "chats" table for advanced labeling:
 *  - "starred" (boolean, default false, not null)
 *  - "tool_type" (text, nullable)
 *
 * The "starred" column allows users to mark important or
 * favorite conversations. The "tool_type" column is used to
 * label the kind of specialized tool or context used in that
 * conversation (e.g., "offer-creation", "email-gen").
 *
 * @notes
 * - If the user wants to star a chat, "starred" = true.
 * - If the user uses a specialized tool, we store that
 *   tool type in "tool_type".
 *
 * Migration Steps:
 *  1. Add "starred" boolean column, default to false, not null.
 *  2. Add "tool_type" text column, nullable.
 *
 * No rollback statements are included. If you want to revert,
 * you can remove these columns with an "ALTER TABLE ... DROP COLUMN".
 */

-- 1) Add 'starred' (boolean) column with default value false (not null)
ALTER TABLE chats
ADD COLUMN starred boolean NOT NULL DEFAULT false;

-- 2) Add 'tool_type' (text) column
ALTER TABLE chats
ADD COLUMN tool_type text;

