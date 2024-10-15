const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ANCHOR[id=parent] abstract class (parent)
class BaseModel {
  // encapsulation (not supported in  JavaScript)
  // rahasia parent. harus dipanggil  dengan this.#var
  // #pass = "12345678";

  constructor(model) {
    this.model = prisma[model];
  }
  get = async ({ where = {}, q = {} }) => {
    const { sortBy = "createdAt", sort = "desc", page = 1, limit = 10 } = q;
    const query = {
      select: this.select,
      where,
      orderBy: {
        [sortBy]: sort
      },
      skip: (page - 1) * limit,
      take: limit
    };

    const [resources, count] = await prisma.$transaction([
      this.model.findMany(query),
      this.model.count(where)
    ]);

    return {
      resources,
      count
    };
  };

  getById = (id, res) => {
    return this.model.findUnique({ where: { id: Number(id) }, ...res });
  };

  getOne = (query) => {
    return this.model.findFirst(query);
  };

  set = (data) => {
    if (!data.createdBy) {
      data = { ...data };
    }
    return this.model.create({ data });
  };

  update = (id, data) => {
    if (!data.updatedBy) {
      data = { ...data };
    }
    return this.model.update({
      where: { id: Number(id) },
      data
    });
  };

  delete = (id) => {
    return this.model.delete({
      where: { id: Number(id) }
    });
  };

  count = () => {
    return this.model.count({
      where: this.where
    });
  };

  transaction = async(query) => {
    return prisma.$transaction(query)
  }
}

module.exports = BaseModel;
