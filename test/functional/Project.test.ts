import ServerInitializer from "@initializer/ServerInitializer";
import Request from "supertest";
import { Application } from "express";
import { getRepository } from "typeorm";
import Project from "@entity/Project";
import ProjectResponseType from "@type/response/entity/ProjectResponseType";
import moment from "moment";
import JsonApiSingleResouceResponse from "@type/response/json-api/JsonApiSingleResouceResponse";
import JsonApiMultipleResoucesResponse from "@type/response/json-api/JsonApiMultipleResoucesResponse";
import TypeORMUtil from "@util/TypeORMUtil";

describe("Route: Project", () => {
    let app: Application;

    beforeAll(async () => {
        app = await ServerInitializer.getServer();
    });
    afterAll(async () => {
        await TypeORMUtil.closeConnection();
    });

    const newProject = {
        name: "NewProject",
        description: "This is my new project",
        startDate: moment().milliseconds(0).toISOString(),
        endDate: moment().milliseconds(0).toISOString(),
        email: "project@project.com",
        teamSize: 100,
    };

    const updatedProject = {
        ...newProject,
        name: "My updated project",
        description: "This is my updated project",
    };

    describe("CRUD Operations", () => {
        test("[GET]    /api/ProjectRoute/:id   ->   It should return a Project", async () => {
            // Creating a new project
            const project = await getRepository(Project).save({
                ...newProject,
            });

            // Updating project
            const response = await Request(app).get(
                `/api/ProjectRoute/${project.id}`
            );
            const body = response.body as JsonApiSingleResouceResponse<
                ProjectResponseType
            >;
            const status = response.status;
            expect(status).toBe(200);
            expect(body).toStrictEqual({
                links: {
                    self: `http://127.0.0.1/api/ProjectRoute/${project.id}`,
                },
                data: {
                    type: "project",
                    id: project.id,
                    attributes: newProject,
                },
            });
        });

        test("[POST]   /api/ProjectRoute/      ->   It should create a new Project", async () => {
            // Creating a new project
            const response = await Request(app)
                .post("/api/ProjectRoute/")
                .send(newProject);
            const body = response.body as JsonApiSingleResouceResponse<
                ProjectResponseType
            >;
            const status = response.status;

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
            const projectFound = await getRepository(Project).findOne(
                newProjectId
            );
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

        test("[PATCH]  /api/ProjectRoute/:id   ->   It should update a project", async () => {
            // Creating a new project
            const project = await getRepository(Project).save({
                ...newProject,
            });

            // Updating project
            const response = await Request(app)
                .patch(`/api/ProjectRoute/${project.id}`)
                .send(updatedProject);
            const body = response.body as JsonApiSingleResouceResponse<
                ProjectResponseType
            >;
            const status = response.status;

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
            const projectFound = await getRepository(Project).findOne(
                project.id
            );
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

        test("[DELETE] /api/ProjectRoute/:id   ->   It should remove a project", async () => {
            // Creating a new project
            const { id } = await getRepository(Project).save({ ...newProject });

            // Removing project
            const response = await Request(app).delete(
                `/api/ProjectRoute/${id}`
            );
            const body = response.body as JsonApiSingleResouceResponse<
                ProjectResponseType
            >;
            const status = response.status;
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

        test("[GET]    /api/ProjectRoute/      ->   It should return a list of projects", async () => {
            // Dropping database
            await getRepository(Project).clear();

            // Creating products
            const product1 = await getRepository(Project).save({
                ...newProject,
            });
            const product2 = await getRepository(Project).save({
                ...newProject,
            });

            // Making sure both were created
            const response = await Request(app).get("/api/ProjectRoute/");
            const body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            const status = response.status;
            expect(status).toBe(200);
            expect(body).toStrictEqual({
                links: { self: "http://127.0.0.1/api/ProjectRoute/" },
                data: [
                    {
                        type: "project",
                        id: product1.id,
                        attributes: newProject,
                    },
                    {
                        type: "project",
                        id: product2.id,
                        attributes: newProject,
                    },
                ],
            });
        });
    });

    describe("Validation", () => {
        test("[PATCH]  /api/ProjectRoute/:id   ->   It should an return an error whenever trying to update or remove an unknown element", async () => {
            const expectedErrorCode = 404;
            const expectedResponse = {
                status: expectedErrorCode,
                title: "Entity Not Found",
                detail: `Could not find item with id: myUnknownId`,
            };

            const patchResponse = await Request(app).patch(
                `/api/ProjectRoute/myUnknownId`
            );
            let body = patchResponse.body as JsonApiSingleResouceResponse<
                ProjectResponseType
            >;
            let status = patchResponse.status;
            expect(status).toBe(expectedErrorCode);
            expect(body).toStrictEqual(expectedResponse);

            const deleteResponse = await Request(app).delete(
                `/api/ProjectRoute/myUnknownId`
            );
            (body = deleteResponse.body as JsonApiSingleResouceResponse<
                ProjectResponseType
            >),
                (status = deleteResponse.status);
            expect(status).toBe(expectedErrorCode);
            expect(body).toStrictEqual(expectedResponse);
        });

        test("[POST]   /api/ProjectRoute/:id   ->   It should not allow the creation of a project without required fields", async () => {
            const emptyProject = {};

            // Creating a new project
            const response = await Request(app)
                .post("/api/ProjectRoute/")
                .send(emptyProject);
            expect(response.status).toBe(400);
            expect(response.body).toStrictEqual([
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

        test("[PATCH]  /api/ProjectRoute/:id   ->   It should not allow the update of a project with invalid field values", async () => {
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
            const response = await Request(app)
                .patch(`/api/ProjectRoute/${id}`)
                .send(emptyProject);
            expect(response.status).toBe(400);
            expect(response.body).toStrictEqual([
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

        test("[GET]    /api/ProjectRoute/      ->   It should not allow sorting for an unkwon field", async () => {
            const response = await Request(app).get(
                "/api/ProjectRoute?sort=myUnknownField"
            );
            expect(response.status).toBe(500);
            expect(response.body).toStrictEqual({
                status: 500,
                title: "Error",
                detail:
                    "myUnknownField column was not found in the Project entity.",
            });
        });
    });

    describe("Pagination", () => {
        let product1: Project;
        let product2: Project;
        let product3: Project;
        beforeAll(async () => {
            // Dropping database
            await getRepository(Project).clear();

            // Creating products
            product1 = await getRepository(Project).save({ ...newProject });
            product2 = await getRepository(Project).save({ ...newProject });
            product3 = await getRepository(Project).save({ ...newProject });
        });

        test("[GET]    /api/ProjectRoute/      ->   It should return results according to pageSize/page", async () => {
            const response = await Request(app).get(
                "/api/ProjectRoute?pageSize=1&page=1"
            );
            expect(response.status).toBe(response.status);
            expect(response.body).toStrictEqual({
                links: {
                    self: "http://127.0.0.1/api/ProjectRoute?pageSize=1&page=1",
                },
                data: [
                    {
                        type: "project",
                        id: product2.id,
                        attributes: newProject,
                    },
                ],
            });
        });

        test("[GET]    /api/ProjectRoute/      ->   It should return everything whenever pageSize or page was not provided", async () => {
            let getResponse = await Request(app).get(
                "/api/ProjectRoute?pageSize=1"
            );
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toStrictEqual({
                links: { self: "http://127.0.0.1/api/ProjectRoute?pageSize=1" },
                data: [
                    {
                        type: "project",
                        id: product1.id,
                        attributes: newProject,
                    },
                    {
                        type: "project",
                        id: product2.id,
                        attributes: newProject,
                    },
                    {
                        type: "project",
                        id: product3.id,
                        attributes: newProject,
                    },
                ],
            });
            getResponse = await Request(app).get("/api/ProjectRoute?page=1");
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toStrictEqual({
                links: { self: "http://127.0.0.1/api/ProjectRoute?page=1" },
                data: [
                    {
                        type: "project",
                        id: product1.id,
                        attributes: newProject,
                    },
                    {
                        type: "project",
                        id: product2.id,
                        attributes: newProject,
                    },
                    {
                        type: "project",
                        id: product3.id,
                        attributes: newProject,
                    },
                ],
            });
        });

        test("[GET]    /api/ProjectRoute/      ->   It should return everything whenever pageSize or page is not a numeric value", async () => {
            let getResponse = await Request(app).get(
                "/api/ProjectRoute?pageSize=ABC&page=1"
            );
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toStrictEqual({
                links: {
                    self:
                        "http://127.0.0.1/api/ProjectRoute?pageSize=ABC&page=1",
                },
                data: [
                    {
                        type: "project",
                        id: product1.id,
                        attributes: newProject,
                    },
                    {
                        type: "project",
                        id: product2.id,
                        attributes: newProject,
                    },
                    {
                        type: "project",
                        id: product3.id,
                        attributes: newProject,
                    },
                ],
            });
            getResponse = await Request(app).get(
                "/api/ProjectRoute?pageSize=1&page=ABC"
            );
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toStrictEqual({
                links: {
                    self:
                        "http://127.0.0.1/api/ProjectRoute?pageSize=1&page=ABC",
                },
                data: [
                    {
                        type: "project",
                        id: product1.id,
                        attributes: newProject,
                    },
                    {
                        type: "project",
                        id: product2.id,
                        attributes: newProject,
                    },
                    {
                        type: "project",
                        id: product3.id,
                        attributes: newProject,
                    },
                ],
            });
        });

        test("[GET]    /api/ProjectRoute/      ->   It should return everything whenever pageSize lower than 1", async () => {
            const getResponse = await Request(app).get(
                "/api/ProjectRoute?pageSize=0&page=1"
            );
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toStrictEqual({
                links: {
                    self: "http://127.0.0.1/api/ProjectRoute?pageSize=0&page=1",
                },
                data: [
                    {
                        type: "project",
                        id: product1.id,
                        attributes: newProject,
                    },
                    {
                        type: "project",
                        id: product2.id,
                        attributes: newProject,
                    },
                    {
                        type: "project",
                        id: product3.id,
                        attributes: newProject,
                    },
                ],
            });
        });

        test("[GET]    /api/ProjectRoute/      ->   It should return everything whenever page lower than 0", async () => {
            const getResponse = await Request(app).get(
                "/api/ProjectRoute?pageSize=1&page=-1"
            );
            expect(getResponse.status).toBe(200);
            expect(getResponse.body).toStrictEqual({
                links: {
                    self:
                        "http://127.0.0.1/api/ProjectRoute?pageSize=1&page=-1",
                },
                data: [
                    {
                        type: "project",
                        id: product1.id,
                        attributes: newProject,
                    },
                    {
                        type: "project",
                        id: product2.id,
                        attributes: newProject,
                    },
                    {
                        type: "project",
                        id: product3.id,
                        attributes: newProject,
                    },
                ],
            });
        });
    });

    describe("Sorting", () => {
        let product1: Project;
        let product2: Project;
        let product3: Project;
        beforeAll(async () => {
            // Dropping database
            await getRepository(Project).clear();

            // Creating products
            product1 = await getRepository(Project).save({
                name: "Line Flow Tool",
                description: "LFT Project",
                startDate: moment().year(2015).milliseconds(0).toISOString(),
                endDate: moment().year(2021).milliseconds(0).toISOString(),
                email: "tool@lft.com",
                teamSize: 10,
            });
            product2 = await getRepository(Project).save({
                name: "Vendor Management Tool",
                description: "VMT Project",
                startDate: moment().year(2018).milliseconds(0).toISOString(),
                endDate: moment().year(2020).milliseconds(0).toISOString(),
                email: "es-support@vmt.com",
                teamSize: 3,
            });
            product3 = await getRepository(Project).save({
                name: "Field",
                description: "Field Project",
                startDate: moment().year(2019).milliseconds(0).toISOString(),
                endDate: moment().year(2020).milliseconds(0).toISOString(),
                email: "field@field.com",
                teamSize: 12,
            });
        });

        test("[GET]    /api/ProjectRoute/      ->   It should return results according to sort provided", async () => {
            // Name
            let response = await Request(app).get(
                "/api/ProjectRoute?sort=name"
            );
            let status = response.status;
            let body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data[0].id).toEqual(product3.id);
            expect(body.data[1].id).toEqual(product1.id);
            expect(body.data[2].id).toEqual(product2.id);

            // Description
            response = await Request(app).get(
                "/api/ProjectRoute?sort=description"
            );
            status = response.status;
            body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data[0].id).toEqual(product3.id);
            expect(body.data[1].id).toEqual(product1.id);
            expect(body.data[2].id).toEqual(product2.id);

            // Start Date
            response = await Request(app).get(
                "/api/ProjectRoute?sort=startDate"
            );
            status = response.status;
            body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data[0].id).toEqual(product1.id);
            expect(body.data[1].id).toEqual(product2.id);
            expect(body.data[2].id).toEqual(product3.id);

            // End Date
            response = await Request(app).get("/api/ProjectRoute?sort=endDate");
            status = response.status;
            body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data[0].id).toEqual(product2.id);
            expect(body.data[1].id).toEqual(product3.id);
            expect(body.data[2].id).toEqual(product1.id);

            // Email
            response = await Request(app).get("/api/ProjectRoute?sort=email");
            status = response.status;
            body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data[0].id).toEqual(product2.id);
            expect(body.data[1].id).toEqual(product3.id);
            expect(body.data[2].id).toEqual(product1.id);

            // Team Size
            response = await Request(app).get(
                "/api/ProjectRoute?sort=teamSize"
            );
            status = response.status;
            body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data[0].id).toEqual(product2.id);
            expect(body.data[1].id).toEqual(product1.id);
            expect(body.data[2].id).toEqual(product3.id);
        });

        test("[GET]    /api/ProjectRoute/      ->   It should allow descending sort whenever minus sign is provided", async () => {
            // Name
            let response = await Request(app).get(
                "/api/ProjectRoute?sort=-name"
            );
            let status = response.status;
            let body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data[0].id).toEqual(product2.id);
            expect(body.data[1].id).toEqual(product1.id);
            expect(body.data[2].id).toEqual(product3.id);

            // Description
            response = await Request(app).get(
                "/api/ProjectRoute?sort=-description"
            );
            status = response.status;
            body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data[0].id).toEqual(product2.id);
            expect(body.data[1].id).toEqual(product1.id);
            expect(body.data[2].id).toEqual(product3.id);

            // Start Date
            response = await Request(app).get(
                "/api/ProjectRoute?sort=-startDate"
            );
            status = response.status;
            body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data[0].id).toEqual(product3.id);
            expect(body.data[1].id).toEqual(product2.id);
            expect(body.data[2].id).toEqual(product1.id);

            // End Date
            response = await Request(app).get(
                "/api/ProjectRoute?sort=-endDate"
            );
            status = response.status;
            body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data[0].id).toEqual(product1.id);
            expect(body.data[1].id).toEqual(product2.id);
            expect(body.data[2].id).toEqual(product3.id);

            // Email
            response = await Request(app).get("/api/ProjectRoute?sort=-email");
            status = response.status;
            body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data[0].id).toEqual(product1.id);
            expect(body.data[1].id).toEqual(product3.id);
            expect(body.data[2].id).toEqual(product2.id);

            // Team Size
            response = await Request(app).get(
                "/api/ProjectRoute?sort=-teamSize"
            );
            status = response.status;
            body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data[0].id).toEqual(product3.id);
            expect(body.data[1].id).toEqual(product1.id);
            expect(body.data[2].id).toEqual(product2.id);
        });

        test("[GET]    /api/ProjectRoute/      ->   It should allow composite sorting whenever sort values is separated by commas", async () => {
            let response = await Request(app).get(
                "/api/ProjectRoute?sort=-endDate,name"
            );
            let status = response.status;
            let body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data[0].id).toEqual(product1.id);
            expect(body.data[1].id).toEqual(product3.id);
            expect(body.data[2].id).toEqual(product2.id);

            response = await Request(app).get(
                "/api/ProjectRoute?sort=-endDate,-name"
            );
            status = response.status;
            body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(body.data[0].id).toEqual(product1.id);
            expect(body.data[1].id).toEqual(product2.id);
            expect(body.data[2].id).toEqual(product3.id);
        });

        test("[GET]    /api/ProjectRoute/      ->   It should work along with pagination", async () => {
            let response = await Request(app).get(
                "/api/ProjectRoute?sort=-endDate,name&pageSize=2&page=0"
            );
            let status = response.status;
            let body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data.length).toEqual(2);
            expect(body.data[0].id).toEqual(product1.id);
            expect(body.data[1].id).toEqual(product3.id);

            response = await Request(app).get(
                "/api/ProjectRoute?sort=-endDate,name&pageSize=2&page=1"
            );
            status = response.status;
            body = response.body as JsonApiMultipleResoucesResponse<
                ProjectResponseType
            >;
            expect(status).toBe(200);
            expect(body.data.length).toEqual(1);
            expect(body.data[0].id).toEqual(product2.id);
        });
    });
});
