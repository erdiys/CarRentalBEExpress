/* eslint-disable no-unused-vars */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ANCHOR[id=parent] abstract class (parent)
class BaseModel {
  // encapsulation (not supported in  JavaScript)
  // rahasia parent. harus dipanggil  dengan this.#var
  #pass = "12345678";

  constructor(model) {
    this.model = model;
  }
  get = async ({ where, include, q = {} }) => {
    this.#pass;
    const { sortBy = "createdAt", sort = "desc", page = 1, limit = 10 } = q;
    const query = {
      select: this.select,
      where,
      include,
      orderBy: {
        [sortBy]: sort
      },
      skip: (page - 1) * limit,
      take: limit
    };

    const [resources, count] = await prisma.$transaction([
      this.model.findMany(query),
      this.model.count(query)
    ]);

    return {
      resources,
      count
    };
  };

  getOne = async (query) => {
    return this.model.findUnique({ query });
  };

  set = async (data) => {
    return this.model.create({ data });
  };

  update = async (id, data) => {
    return this.model.update({
      where: { id }
    });
  };

  delete = async (id) => {
    return this.model.delete({
      where: { id }
    });
  };

  count = async () => {
    return this.model.count({
      where: this.where
    });
  };
}

module.exports = BaseModel;
