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
      this.model.count()
    ]);

    return {
      resources,
      count
    };
  };

  getById = async (id) => {
    return this.model.findUnique({ where: { id: Number(id) } });
  };

  getOne = async (query) => {
    return this.model.findFirst(query);
  };

  set = async (data) => {
    if (!data.createBy) {
      data = { ...data };
    }
    return this.model.create({ data });
  };

  update = async (id, data) => {
    if (!data.updateBy) {
      data = { ...data };
    }
    return this.model.update({
      where: { id: Number(id) },
      data
    });
  };

  delete = async (id) => {
    return this.model.delete({
      where: { id: Number(id) }
    });
  };

  count = async () => {
    return this.model.count({
      where: this.where
    });
  };
}

module.exports = BaseModel;
