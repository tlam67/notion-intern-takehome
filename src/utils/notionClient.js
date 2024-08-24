import { Client } from "@notionhq/client";
import "dotenv/config";

// create notion client singleton
export const notionClient = new Client({ auth: process.env.NOTION_API_KEY });
export const databaseId = process.env.NOTION_DATABASE_ID;
