import { z } from "zod";

// Auth
export const authSchema = z.object({
  name: z.string(),
  email: z.email(),
  currentPassword: z.string().optional(),
  password: z.string(),
  password_confirmation: z.string(),
  token: z.string(),
});

export type Auth = z.infer<typeof authSchema>;
export type UserLoginForm = Pick<Auth, "email" | "password">;
export type UserRegistrationForm = Pick<
  Auth,
  "name" | "email" | "password" | "password_confirmation"
>;
export type RequestConfirmationCodeForm = Pick<Auth, "email">;
export type ConfirmToken = Pick<Auth, "token">;
export type NewPasswordForm = Pick<Auth, "password" | "password_confirmation">;
export type UpdateCurrentPasswordForm = Pick<
  Auth,
  "currentPassword" | "password" | "password_confirmation"
>;
export type CheckPasswordForm = Pick<Auth, "password">;

// Users
export const userSchema = authSchema
  .pick({
    name: true,
    email: true,
  })
  .extend({
    _id: z.string(),
  });
export type User = z.infer<typeof userSchema>;
export type UserProfileForm = Pick<User, "name" | "email">;

// Notes
export const noteSchema = z.object({
  _id: z.string(),
  content: z.string(),
  createBy: userSchema,
  task: z.string(),
  createdAt: z.string(),
});

export type Note = z.infer<typeof noteSchema>;
export type NoteFormData = Pick<Note, "content">;

// Tasks
export const TaskStatusSchema = z.enum([
  "pending",
  "onHold",
  "inProgress",
  "underReview",
  "completed",
]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const taskSchema = z.object({
  _id: z.string(),
  taskName: z.string(),
  description: z.string(),
  project: z.string(),
  status: TaskStatusSchema,
  statusChangeBy: z.array(
    z.object({
      _id: z.string(),
      user: userSchema,
      status: TaskStatusSchema,
    }),
  ),
  notes: z.array(noteSchema.extend({ createBy: userSchema })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const taskProjectSchema = taskSchema.pick({
  _id: true,
  taskName: true,
  description: true,
  status: true,
});

export type Task = z.infer<typeof taskSchema>;
export type TaskFormData = Pick<Task, "taskName" | "description">;
export type TaskProject = z.infer<typeof taskProjectSchema>;

// Projects
export const projectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
  manager: z.string(),
  tasks: z.array(taskProjectSchema),
  team: z.array(z.string()),
});

export const dashboardProjectSchema = z.array(
  projectSchema.pick({
    _id: true,
    projectName: true,
    clientName: true,
    description: true,
    manager: true,
  }),
);

export const editProjectSchema = projectSchema.pick({
  projectName: true,
  clientName: true,
  description: true,
});
export type Project = z.infer<typeof projectSchema>;
export type ProjectFormData = Pick<
  Project,
  "clientName" | "projectName" | "description"
>;

// Teams
export const teamMemberSchema = userSchema.pick({
  name: true,
  email: true,
  _id: true,
});
export const teamMembersSchema = z.array(teamMemberSchema);
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamMemberForm = Pick<TeamMember, "email">;
