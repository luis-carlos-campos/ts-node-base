import ServerInitializer from "../src/initializer/ServerInitializer";
import Request from "supertest";
import { Application } from "express";
import { getConnection, getRepository } from "typeorm";
import Project from "../src/entity/Project";

describe("Project Route tests", () => {
    let app: Application;

    beforeAll(async () => {
        app = await ServerInitializer.getServer();
    });
    afterAll(async () => {
        await getConnection().close();
    });

    const newProject = {
        name: "NewProject",
        description: "This is my new project",
        // TODO: Improve dates below
        startDate: new Date(Date.UTC(2000, 2, 2, 2, 2, 2)).toISOString(),
        endDate: new Date(Date.UTC(2000, 2, 2, 2, 2, 2)).toISOString(),
        email: "project@project.com",
        teamSize: 100,
    };

    const updatedProject = {
        ...newProject,
        name: "My updated project",
        description: "This is my updated project",
    };

    test("It should create a new Project", async () => {
        // Creating a new project
        const { body, status } = await Request(app)
            .post("/api/ProjectRoute/")
            .send(newProject);
        expect(status).toBe(201);

        const newProjectId = body.data.id;
        expect(body).toStrictEqual({
            links: {
                // TODO improve self validation
                self: `http://127.0.0.1/api/ProjectRoute/`,
            },
            data: {
                type: "project",
                id: newProjectId,
                attributes: newProject,
            },
        });

        // Making sure it was created
        const projectFound = await getRepository(Project).findOne(newProjectId);
        expect(projectFound).toBeDefined();
        if (projectFound) {
            const {
                id,
                name,
                description,
                startDate,
                endDate,
                email,
                teamSize,
            } = projectFound;
            expect(id).toBe(newProjectId);
            expect(name).toBe(newProject.name);
            expect(description).toBe(newProject.description);
            expect(startDate.toISOString()).toBe(newProject.startDate);
            expect(endDate.toISOString()).toBe(newProject.endDate);
            expect(email).toBe(newProject.email);
            expect(teamSize).toBe(newProject.teamSize);
        }
    });

    test("It should not allow the creation of a project without required fields", async () => {
        const emptyProject = {};

        // Creating a new project
        const { body, status } = await Request(app)
            .post("/api/ProjectRoute/")
            .send(emptyProject);
        expect(status).toBe(400);
        expect(body).toStrictEqual([
            {
                status: 400,
                title: "Invalid Attributes: name = undefined",
                detail: "name must be a string",
            },
            {
                status: 400,
                title: "Invalid Attributes: name = undefined",
                detail: "name should not be empty",
            },
            {
                status: 400,
                title: "Invalid Attributes: name = undefined",
                detail: "name must be longer than or equal to 2 characters",
            },
            {
                status: 400,
                title: "Invalid Attributes: description = undefined",
                detail: "description must be a string",
            },
            {
                status: 400,
                title: "Invalid Attributes: startDate = undefined",
                detail: "startDate must be a Date instance",
            },
            {
                status: 400,
                title: "Invalid Attributes: startDate = undefined",
                detail: "startDate should not be empty",
            },
            {
                status: 400,
                title: "Invalid Attributes: endDate = undefined",
                detail: "endDate must be a Date instance",
            },
            {
                status: 400,
                title: "Invalid Attributes: endDate = undefined",
                detail: "endDate should not be empty",
            },
            {
                status: 400,
                title: "Invalid Attributes: email = undefined",
                detail: "email must be an email",
            },
            {
                status: 400,
                title: "Invalid Attributes: email = undefined",
                detail: "email should not be empty",
            },
            {
                status: 400,
                title: "Invalid Attributes: teamSize = undefined",
                detail: "teamSize must be a positive number",
            },
        ]);
    });

    test("It should update a project", async () => {
        // Creating a new project
        const project = await getRepository(Project).save({ ...newProject });

        // Updating project
        const { body, status } = await Request(app)
            .patch(`/api/ProjectRoute/${project.id}`)
            .send(updatedProject);
        expect(status).toBe(200);
        expect(body).toStrictEqual({
            links: {
                self: `http://127.0.0.1/api/ProjectRoute/${project.id}`,
            },
            data: {
                type: "project",
                id: project.id,
                attributes: updatedProject,
            },
        });

        // Making sure it was updated
        const projectFound = await getRepository(Project).findOne(project.id);
        expect(projectFound).toBeDefined();
        if (projectFound) {
            const {
                id,
                name,
                description,
                startDate,
                endDate,
                email,
                teamSize,
            } = projectFound;
            expect(id).toBe(project.id);
            expect(name).toBe(updatedProject.name);
            expect(description).toBe(updatedProject.description);
            expect(startDate.toISOString()).toBe(updatedProject.startDate);
            expect(endDate.toISOString()).toBe(updatedProject.endDate);
            expect(email).toBe(updatedProject.email);
            expect(teamSize).toBe(updatedProject.teamSize);
        }
    });

    test("It should not allow the update of a project with invalid field values", async () => {
        // Creating a new project
        const { id } = await getRepository(Project).save({ ...newProject });

        const emptyProject = {
            name: null,
            description: null,
            startDate: null,
            endDate: null,
            email: null,
            teamSize: null,
        };

        // Updating the previously created project
        const { body, status } = await Request(app)
            .patch(`/api/ProjectRoute/${id}`)
            .send(emptyProject);
        expect(status).toBe(400);
        expect(body).toStrictEqual([
            {
                status: 400,
                title: "Invalid Attributes: name = null",
                detail: "name must be a string",
            },
            {
                status: 400,
                title: "Invalid Attributes: name = null",
                detail: "name should not be empty",
            },
            {
                status: 400,
                title: "Invalid Attributes: name = null",
                detail: "name must be longer than or equal to 2 characters",
            },
            {
                status: 400,
                title: "Invalid Attributes: description = null",
                detail: "description must be a string",
            },
            {
                status: 400,
                title: "Invalid Attributes: startDate = null",
                detail: "startDate must be a Date instance",
            },
            {
                status: 400,
                title: "Invalid Attributes: startDate = null",
                detail: "startDate should not be empty",
            },
            {
                status: 400,
                title: "Invalid Attributes: endDate = null",
                detail: "endDate must be a Date instance",
            },
            {
                status: 400,
                title: "Invalid Attributes: endDate = null",
                detail: "endDate should not be empty",
            },
            {
                status: 400,
                title: "Invalid Attributes: email = null",
                detail: "email must be an email",
            },
            {
                status: 400,
                title: "Invalid Attributes: email = null",
                detail: "email should not be empty",
            },
            {
                status: 400,
                title: "Invalid Attributes: teamSize = null",
                detail: "teamSize must be a positive number",
            },
        ]);
    });

    test("It should remove a project", async () => {
        // Creating a new project
        const { id } = await getRepository(Project).save({ ...newProject });

        // Removing project
        const { body, status } = await Request(app).delete(
            `/api/ProjectRoute/${id}`
        );
        expect(status).toBe(200);
        expect(body).toStrictEqual({
            links: {
                self: `http://127.0.0.1/api/ProjectRoute/${id}`,
            },
            data: {
                type: "project",
                id: id,
                attributes: newProject,
            },
        });

        // Making sure it was removed.
        const removedProject = await getRepository(Project).findOne(id);
        expect(removedProject).toBeUndefined();
    });

    test("It should an return an error whenever trying to update or remove an unknown element", async () => {
        const expectedErrorCode = 404;
        const expectedResponse = {
            status: expectedErrorCode,
            title: "Entity Not Found",
            detail: `Could not find item with id: myUnknownId`,
        };

        const patchResponse = await Request(app).patch(
            `/api/ProjectRoute/myUnknownId`
        );
        let { body, status } = patchResponse;
        expect(status).toBe(expectedErrorCode);
        expect(body).toStrictEqual(expectedResponse);

        const deleteResponse = await Request(app).delete(
            `/api/ProjectRoute/myUnknownId`
        );
        (body = deleteResponse.body), (status = deleteResponse.status);
        expect(status).toBe(expectedErrorCode);
        expect(body).toStrictEqual(expectedResponse);
    });

    test("It should return a list of projects", async () => {
        // Dropping database
        await getRepository(Project).query("DELETE from Project");

        // Creating products
        const { id } = await getRepository(Project).save({ ...newProject });
        const product2 = await getRepository(Project).save({ ...newProject });

        // Making sure both were created
        const { body, status } = await Request(app).get("/api/ProjectRoute/");
        expect(status).toBe(200);
        expect(body).toStrictEqual({
            links: { self: "http://127.0.0.1/api/ProjectRoute/" },
            data: [
                { type: "project", id: id, attributes: newProject },
                { type: "project", id: product2.id, attributes: newProject },
            ],
        });
    });

    // TODO: Add pagination tests
});
