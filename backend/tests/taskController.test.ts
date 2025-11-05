import request from "supertest";
import app from "../src/app";
import prisma from "../src/prismaClient";

let token: string;

// Before all tests, register a test user and get token
beforeAll(async () => {
  await prisma.user.deleteMany(); // Clean database
  await prisma.task.deleteMany();

  await request(app).post("/api/auth/register").send({
    firstName: "Test",
    lastName: "user",
    email: "test@example.com",
    password: "Password1!"
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "test@example.com",
    password: "Password1!"
  });

  token = res.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Task CRUD", () => {
  let taskId: number;

  it("should create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Task", description: "Test Desc" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Task");
    taskId = res.body.id;
  });

  it("should fetch all tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update the task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Task" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Task");
  });

  it("should toggle task completion", async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}/complete`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it("should delete the task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
