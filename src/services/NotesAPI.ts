import api from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  noteSchema,
  type Note,
  type NoteFormData,
  type Project,
  type Task,
} from "../types";

type NotesAPIType = {
  formData: NoteFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
  noteId: Note["_id"];
};

export async function createNote({
  formData,
  projectId,
  taskId,
}: Pick<NotesAPIType, "formData" | "projectId" | "taskId">) {
  try {
    const url = `/projects/${projectId}/task/${taskId}/notes`;
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getNotesByTask({
  projectId,
  taskId,
}: Pick<NotesAPIType, "projectId" | "taskId">) {
  try {
    const url = `/projects/${projectId}/task/${taskId}/notes`;
    const { data } = await api(url);
    const response = noteSchema.array().safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function deleteNote({
  projectId,
  taskId,
  noteId,
}: Pick<NotesAPIType, "projectId" | "taskId" | "noteId">) {
  try {
    const url = `/projects/${projectId}/task/${taskId}/notes/${noteId}`;
    const { data } = await api.delete<string>(url);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
