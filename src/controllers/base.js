class BaseController {
  constructor(model) {
    this.model = model;
  }

  getAll = async (req, res) => {
    try {
      const {
        sortBy = "createdAt",
        sort = "desc",
        page = 1,
        limit = 10
      } = req.query;
      const { resources, count } = await this.model.findAndCountAll({
        sortBy,
        sort,
        page,
        limit
      });

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "Data retrieved successfully",
          data: resources,
          pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
          }
        })
      );
    } catch (error) {
      console.log(error);
      //   if (error.name === "SequelizeDatabaseError") {
      //     this.apiSend({
      //       code: 500,
      //       status: "error",
      //       message: "Database error"
      //     });
      //   }
    }
  };

  get = async (req, res) => {
    try {
      const resources = await this.model.getById(req.params.id);
      return res.status(200).json(
        this.apiSend({
          status: "success",
          message: "Data retrieved successfully",
          data: resources
        })
      );
    } catch (error) {
      console.log(error);
    //   throw new NotFoundError();
    }
  };

  create = async (req, res) => {
    try {
      const resources = await this.model.set(req.body);
      return res.status(201).json(
        this.apiSend({
          status: "success",
          message: "Data created successfully",
          data: resources
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  update = async (req, res) => {
    try {
      const resources = await this.model.update(req.params.id, req.body);
      return res.status(200).json(
        this.apiSend({
          status: "success",
          message: "Data updated successfully",
          data: resources
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  delete = async (req, res) => {
    try {
      const resources = await this.model.delete(req.params.id);
      return res.status(204).json(
        this.apiSend({
          status: "success",
          message: `Data with id ${req.params.id} deleted successfully`,
          data: resources
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  apiSend = ({ code, status, message, data, pagination }) => {
    return {
      code,
      status,
      message,
      data,
      ...(pagination && pagination)
    };
  };
}

module.exports = BaseController;