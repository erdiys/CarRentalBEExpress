// abstraction / abtract class
const validation = require("../middlewares/validation");
const { generateXLSX, readXLSX } = require("../helpers/xlsx");
const { Prisma } = require("@prisma/client");

class BaseController {
  constructor(model) {
    this.model = model;
    this.validation = validation;
  }

  getAll = async (req, res, next) => {
    try {
      const {
        sortBy = "createdAt",
        sort = "desc",
        page = 1,
        limit = 10
      } = req.query;

      const { resources, count } = await this.model.get({
        q: {
          sortBy,
          sort,
          page,
          limit
        }
      });

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "Data fetched successfully",
          data: resources,
          pagination: {
            page,
            limit,
            totalPage: Math.ceil(count / limit),
            total: count
          }
        })
      );
    } catch (err) {
      // eslint-disable-next-line no-undef
      next(new ServerError(err));
    }
  };

  get = async (req, res, next) => {
    try {
      const { id } = req.params;
      const resource = await this.model.getById(id);
      if (!resource) {
        // eslint-disable-next-line no-undef
        next(new NotFoundError(null, `Data with id=${id} not found`));
      }
      return res.status(200).json(
        this.apiSend({
          status: "success",
          message: "Data fetched successfully",
          data: resource
        })
      );
    } catch (err) {
      // eslint-disable-next-line no-undef
      next(new ServerError(err));
    }
  };

  create = async (req, res, next) => {
    try {
      const resource = await this.model.set({
        ...req.body,
        createdBy: req?.user?.name
      });

      return res.status(201).json(
        this.apiSend({
          status: "success",
          message: "Data created successfully",
          data: resource
        })
      );
    } catch (err) {
      // eslint-disable-next-line no-undef
      return next(new ServerError(err));
    }
  };

  update = async (req, res, next) => {
    const { id } = req.params;
    try {
      const resource = await this.model.update(id, {
        ...req.body,
        updatedBy: req?.user?.name
      });

      return res.status(200).json(
        this.apiSend({
          status: "success",
          message: "Data updated successfully",
          data: resource
        })
      );
    } catch (err) {
      //handle prisma not found error
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          // eslint-disable-next-line no-undef
          return next(new NotFoundError(err, `Car with id=${id} not found!`));
        }
      }

      // eslint-disable-next-line no-undef
      next(new ServerError(err));
    }
  };

  delete = async (req, res, next) => {
    const { id } = req.params;
    try {
      const resource = await this.model.delete(id);

      return res.status(200).json(
        this.apiSend({
          status: "success",
          message: `Data with id ${id} deleted successfully`,
          data: resource
        })
      );
    } catch (err) {
      //handle prisma not found error
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          // eslint-disable-next-line no-undef
          return next(new NotFoundError(err, `Car with id=${id} not found!`));
        }
      }
      // eslint-disable-next-line no-undef
      next(new ServerError(err));
    }
  };

  export = (title) => {
    // eslint-disable-next-line no-unused-vars
    return async (req, res, next) => {
      const {
        sortBy = "createdDt",
        sort = "desc",
        page = 1,
        limit = 10
      } = req.query;

      // eslint-disable-next-line no-unused-vars
      const { resources, count } = await this.model.get({
        q: {
          sortBy,
          sort,
          page,
          limit
        },
        select: undefined
      });

      generateXLSX(title, resources, res);
    };
  };

  import = async (req, res, next) => {
    try {
      const { file } = req;
      const allowedFile = [
        "application/vnd.ms-excel", //xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" //xlsx
      ];

      if (allowedFile.includes(file.mimetype) === false) {
        // eslint-disable-next-line no-undef
        return next(new ValidationError("File not allowed"));
      }

      const data = readXLSX(file);

      if (!data) {
        // eslint-disable-next-line no-undef
        return next(new ValidationError("Data is empty or corrupted!"));
      }

      const importData = await this.model.setMany(data);

      return res.status(200).json(
        this.apiSend({
          code: 200,
          message: "Imported successfully",
          status: "success",
          data: importData
        })
      );
    } catch (e) {
      console.log(e);
      // eslint-disable-next-line no-undef
      next(new ServerError("Something went wrong"));
    }
  };

  //fungsi ini digunakan untuk menghandle pencarian data
  //fungsi ini akan mengembalikan object yang berisi key "OR" dan value berupa array of object
  //setiap object dalam array memiliki key sama dengan field yang ada di model dan value berupa object yang memiliki key "contains" dan "mode"
  //key "contains" berisi nilai yang akan dicari dan key "mode" berisi nilai "insensitive" yang berarti pencarian tidak akan memperhatikan huruf besar/kecil
  handleSearch = (search) => {
    const s = {
      contains: search,
      mode: "insensitive"
    };

    return {
      OR: this.searchField.map((e) => ({ [e]: s }))
    };
  };

  apiSend({ code, status, message, data, pagination }) {
    return {
      code,
      status,
      message,
      data,
      ...(pagination && pagination)
    };
  }
}

module.exports = BaseController;
