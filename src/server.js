const express = require("express");

const app = express();

app.use(express.json());

const projects = {};
let numberOfRequests = 0;

function checkIfTheProjectExists(request, response, next) {
  const { id } = request.params;
  if (!projects[id]) {
    response
      .status(404)
      .json({
        status: 404,
        message: `Does not exist a project with id equals to ${id}`
      });
  }
  return next();
}

function countRequests(request, response, next) {
  numberOfRequests++;
  console.log(`The API has been requested about ${numberOfRequests} times`);
  return next();
}

function addDefaultArrayInTasks(request, response, next) {
  if (!request.body.tasks) {
    request.body.tasks = [];
  }
  return next();
}

app.use(countRequests);

app.post("/projects", addDefaultArrayInTasks, (request, response) => {
  const project = ({ id, title, tasks } = request.body);
  projects[id] = project;
  response.status(200).json(Object.values(project));
});

app.get("/projects", (request, response) => {
  response.status(200).json(Object.values(projects));
});

app.get("/projects/:id", checkIfTheProjectExists, (request, response) => {
  const { id } = request.params;
  response.status(200).json(projects[id]);
});

app.delete("/projects/:id", checkIfTheProjectExists, (request, response) => {
  const { id } = request.params;
  delete projects[id];
  response.status(200).json(Object.values(projects));
});

app.put("/projects/:id", checkIfTheProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;
  projects[id].title = title;
  response.status(200).json(projects[id]);
});

app.post("/projects/:id/tasks", checkIfTheProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;
  projects[id].tasks.push(title);
  response.status(200).json(title);
});

app.listen(4000);
