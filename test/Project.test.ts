import ServerInitializer from "../src/initializer/ServerInitializer";
import Request from "supertest";
import { Application } from "express";
import { getConnection } from "typeorm";

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
        const postResponse = await Request(app)
            .post("/api/ProjectRoute/")
            .send(newProject);
        let { body, status } = postResponse;
        expect(status).toBe(201);

        const brandNewProjectId = body.data.id;
        expect(body).toStrictEqual({
            links: {
                // TODO improve self validation
                self: `http://127.0.0.1/api/ProjectRoute/`,
            },
            data: {
                type: "project",
                id: brandNewProjectId,
                attributes: newProject,
            },
        });

        // Making sure it was created
        const getResponse = await Request(app).get(
            `/api/ProjectRoute/${brandNewProjectId}`
        );
        (body = getResponse.body), (status = getResponse.status);

        expect(status).toBe(200);
        expect(body).toStrictEqual({
            links: {
                self: `http://127.0.0.1/api/ProjectRoute/${brandNewProjectId}`,
            },
            data: {
                type: "project",
                id: brandNewProjectId,
                attributes: newProject,
            },
        });
    });

    test("It should not allow the creation of a project without required fields", async () => {
        const emptyProject = {};

        // Creating a new project
        const postResponse = await Request(app)
            .post("/api/ProjectRoute/")
            .send(emptyProject);
        const { body, status } = postResponse;
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
        const postResponse = await Request(app)
            .post("/api/ProjectRoute/")
            .send(newProject);
        let { body, status } = postResponse;
        expect(status).toBe(201);

        const brandNewProjectId = body.data.id;

        // Updating project
        const patchResponse = await Request(app)
            .patch(`/api/ProjectRoute/${brandNewProjectId}`)
            .send(updatedProject);
        (body = patchResponse.body), (status = patchResponse.status);
        expect(status).toBe(200);
        expect(body).toStrictEqual({
            links: {
                self: `http://127.0.0.1/api/ProjectRoute/${brandNewProjectId}`,
            },
            data: {
                type: "project",
                id: brandNewProjectId,
                attributes: updatedProject,
            },
        });

        // Making sure it was updated
        const getResponse = await Request(app).get(
            `/api/ProjectRoute/${brandNewProjectId}`
        );
        (body = getResponse.body), (status = getResponse.status);

        expect(status).toBe(200);
        expect(body).toStrictEqual({
            links: {
                self: `http://127.0.0.1/api/ProjectRoute/${brandNewProjectId}`,
            },
            data: {
                type: "project",
                id: brandNewProjectId,
                attributes: updatedProject,
            },
        });
    });

    test("It should not allow the update of a project with invalid field values", async () => {
        // Creating a new project
        const postResponse = await Request(app)
            .post("/api/ProjectRoute/")
            .send(newProject);
        let { body, status } = postResponse;
        expect(status).toBe(201);
        const brandNewProjectId = body.data.id;

        const emptyProject = {
            name: null,
            description: null,
            startDate: null,
            endDate: null,
            email: null,
            teamSize: null,
        };

        // Updating the previously created project
        const patchResponse = await Request(app)
            .patch(`/api/ProjectRoute/${brandNewProjectId}`)
            .send(emptyProject);
        (body = patchResponse.body), (status = patchResponse.status);
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
        const postResponse = await Request(app)
            .post("/api/ProjectRoute/")
            .send(newProject);
        let { body, status } = postResponse;
        expect(status).toBe(201);
        const brandNewProjectId = body.data.id;

        // Removing project
        const deleteResponse = await Request(app).delete(
            `/api/ProjectRoute/${brandNewProjectId}`
        );
        (body = deleteResponse.body), (status = deleteResponse.status);
        expect(status).toBe(200);
        expect(body).toStrictEqual({
            links: {
                self: `http://127.0.0.1/api/ProjectRoute/${brandNewProjectId}`,
            },
            data: {
                type: "project",
                id: brandNewProjectId,
                attributes: newProject,
            },
        });

        // Making sure it was removed.
        const getResponse = await Request(app).get(
            `/api/ProjectRoute/${brandNewProjectId}`
        );
        (body = getResponse.body), (status = getResponse.status);

        const expectedErrorCode = 404;
        expect(status).toBe(expectedErrorCode);
        expect(body).toStrictEqual({
            status: expectedErrorCode,
            title: "Entity Not Found",
            detail: `Could not find item with id: ${brandNewProjectId}`,
        });
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
        await getConnection().synchronize(true);

        // Creating project 1
        let postResponse = await Request(app)
            .post("/api/ProjectRoute/")
            .send(newProject);
        let { body, status } = postResponse;
        expect(status).toBe(201);

        const project1Id = body.data.id;

        // Creating project 2
        postResponse = await Request(app)
            .post("/api/ProjectRoute/")
            .send(newProject);
        (body = postResponse.body), (status = postResponse.status);
        expect(status).toBe(201);

        const project2Id = body.data.id;

        // Making sure both were created
        const getResponse = await Request(app).get("/api/ProjectRoute/");
        (body = getResponse.body), (status = getResponse.status);
        expect(status).toBe(200);
        expect(body).toStrictEqual({
            links: { self: "http://127.0.0.1/api/ProjectRoute/" },
            data: [
                { type: "project", id: project1Id, attributes: newProject },
                { type: "project", id: project2Id, attributes: newProject },
            ],
        });
    });
});
