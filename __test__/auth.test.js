/* eslint-disable no-undef */
const request = require("supertest");
const server = require("../index");

const user = {
  email: "test@example.com",
  password: "P@ssw0rd"
};

const admin = {
  email: process.env.ADMIN_USER,
  password: process.env.ADMIN_PASS
};

const car = {
  name: "M-2",
  manufacturer: "BMW",
  licenseNumber: "F7245HAH",
  seat: 4,
  baggage: 2,
  transmission: "Automatic",
  year: "2023-03-13",
  description:
    "Mobil yang cocok digunakan untuk berkendara di dalam kota dan antar kota",
  isDriver: false,
  price: 400000
};

const newCar = {
  name: "Supra",
  manufacturer: "Toyota",
  baggage: 2,
  isDriver: false,
  price: 600000
};

const param = {
  token: null
};

// describe("GET /api/v1/orderCars", () => {
//   it("should response with 404 status code", (done) => {
//     expect(() => {
//       request(server)
//         .get("/api/v1/orderCars")
//         .set("Accept", "application/json")
//         .catch((e) => {
//           throw new Error(e.message);
//         });
//     }).toThrow("Sorry, page not found!");
//     done();
//   });
// });

describe("POST /api/v1/auth/signup", () => {
  it("should response with 201 status code", (done) => {
    request(server)
      .post("/api/v1/auth/signup")
      .send(user)
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect.objectContaining({
          code: 201,
          status: "success",
          message: "SignUp success",
          data: expect.objectContaining({
            user: {
              email: "test@example.com",
              password: expect.not.stringContaining("P@ssw0rd"),
              address: null,
              avatar: null,
              gender: null,
              name: null,
              phoneNumber: null,
              driverLicense: null,
              role_id: 3,
              birthdate: null,
              createdBy: null,
              createdAt: expect.any(String),
              updatedBy: null,
              updatedAt: expect.any(String)
            }
          })
        });
        done();
      })
      .catch((e) => {
        console.log(e);
        done();
      });
  });
});

describe("POST /api/v1/auth/signin", () => {
  it("should response with 200 status code", (done) => {
    request(server)
      .post("/api/v1/auth/signin")
      .send(admin)
      .set("Accept", "application/json")
      .then((res) => {
        param.token = res.body.data.token;
        expect(res.statusCode).toBe(200);
        expect.objectContaining({
          code: 200,
          message: "SignIn success",
          data: {
            token: expect.any(String),
            user: {
              name: expect.any(String),
              email: admin.email,
              address: null,
              gender: null,
              phoneNumber: null,
              driverLicense: null,
              avatar: null,
              birthdate: null,
              role_id: 1,
              createdAt: expect.any(String),
              createdBy: expect.any(String),
              updatedAt: expect.any(String),
              updatedBy: null
            }
          }
        });
        done();
      })
      .catch((e) => {
        console.log(e);
        done();
      });
  });
});

describe("POST /api/v1/cars", () => {
  it("should response with 201 status code", (done) => {
    request(server)
      .post("/api/v1/cars")
      .send(car)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + param.token)
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect.objectContaining({
          status: "success",
          message: "Data created successfully",
          data: expect.objectContaining({
            id: 1,
            name: "M-2",
            manufacturer: "BMW",
            licenseNumber: "F7245HAH",
            seat: 4,
            baggage: 2,
            transmission: "Automatic",
            year: "2023-03-13",
            description:
              "Mobil yang cocok digunakan untuk berkendara di dalam kota dan antar kota",
            isDriver: false,
            isAvailable: true,
            img: null,
            price: 400000,
            createdAt: expect.any(String),
            createdBy: expect.any(String),
            updatedAt: expect.any(String),
            updatedBy: null
          })
        });
        done();
      })
      .catch((e) => {
        console.log(e);
        done();
      });
  });
});

describe("GET /api/v1/cars", () => {
  it("should response with 200 status code", (done) => {
    request(server)
      .get("/api/v1/cars")
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect.objectContaining({
          code: 200,
          status: "success",
          message: "Data fetched successfully",
          data: expect.objectContaining([
            {
              id: 1,
              name: car.name,
              year: car.year,
              manufacturer: car.manufacturer,
              price: car.price,
              img: null,
              baggage: car.baggage,
              seat: car.seat,
              description: car.description
            }
          ]),
          page: expect.any(Number),
          limit: expect.any(Number),
          totalPage: expect.any(Number),
          total: expect.any(Number)
        });
        done();
      })
      .catch((e) => {
        console.log(e);
        done();
      });
  });
});

describe("GET /api/v1/cars/:id", () => {
  it("should response with 200 status code", (done) => {
    request(server)
      .get("/api/v1/cars/1")
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect.objectContaining({
          status: "success",
          message: "Data fetched successfully",
          data: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            manufacturer: expect.any(String),
            licenseNumber: expect.any(String),
            seat: expect.any(Number),
            baggage: expect.any(Number),
            transmission: expect.any(String),
            year: expect.any(String),
            description: expect.any(String),
            isDriver: expect.any(Boolean),
            isAvailable: expect.any(Boolean),
            img: null,
            price: expect.any(Number),
            createdAt: expect.any(String),
            createdBy: expect.any(String),
            updatedAt: expect.any(String),
            updatedBy: null
          })
        });
        done();
      })
      .catch((e) => {
        console.log(e);
        done();
      });
  });
});

describe("PUT /api/v1/cars/:id", () => {
  it("should response with 200 status code", (done) => {
    request(server)
      .put("/api/v1/cars/1")
      .send(newCar)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + param.token)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect.objectContaining({
          status: "success",
          message: "Data updated successfully",
          data: expect.objectContaining({
            id: 1,
            name: newCar.name,
            manufacturer: newCar.manufacturer,
            licenseNumber: car.licenseNumber,
            seat: expect.any(Number),
            baggage: newCar.baggage,
            transmission: car.transmission,
            year: car.year,
            description: car.description,
            isDriver: newCar.isDriver,
            isAvailable: true,
            img: null,
            price: newCar.price,
            createdAt: expect.any(String),
            createdBy: expect.any(String),
            updatedAt: expect.any(String),
            updatedBy: expect.any(String)
          })
        });
        done();
      })
      .catch((e) => {
        console.log(e);
        done();
      });
  });
});

describe("DELETE /api/v1/cars/:id", () => {
  it("should response with 200 status code", (done) => {
    request(server)
      .delete("/api/v1/cars/1")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + param.token)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect.objectContaining({
          status: "success",
          message: "Data with id 1 deleted successfully",
          data: expect.objectContaining({
            id: 1,
            name: newCar.name,
            manufacturer: newCar.manufacturer,
            licenseNumber: car.licenseNumber,
            seat: expect.any(Number),
            baggage: newCar.baggage,
            transmission: car.transmission,
            year: car.year,
            description: car.description,
            isDriver: newCar.isDriver,
            isAvailable: true,
            img: null,
            price: newCar.price,
            createdAt: expect.any(String),
            createdBy: expect.any(String),
            updatedAt: expect.any(String),
            updatedBy: expect.any(String)
          })
        });
        done();
      })
      .catch((e) => {
        console.log(e);
        done();
      });
  });
});
