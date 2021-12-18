const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

// A rota deve retornar uma lista contendo todos os repositórios cadastrados.
app.get("/repositories", (_request, response) => {
  return response.json(repositories);
});

/*
 * A rota deve receber `title`, `url` e `techs` pelo corpo da requisição e
 * retornar um objeto com as informações do repositório criado e um status `201`.
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  response.status(201).json(repository);
});

/**
 * A rota deve receber `title`, `url` e `techs` pelo corpo da requisição e o `id`
 * do repositório que deve ser atualizado pelo parâmetro da rota. Deve alterar
 * apenas as informações recebidas pelo corpo da requisição e retornar esse
 * repositório atualizado.
 **/
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  if(updatedRepository.likes) {
    return response.status(400).json(repositories[repositoryIndex])
  }

  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

/**
 * A rota deve receber, pelo parâmetro da rota, o id do repositório que deve ser
 * excluído e retornar um status 204 após a exclusão.
 **/
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

/**
 * A rota deve receber, pelo parâmetro da rota, o id do repositório que deve
 * receber o like e retornar o repositório com a quantidade de likes atualizada.
 **/
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json({ likes });
});

module.exports = app;
