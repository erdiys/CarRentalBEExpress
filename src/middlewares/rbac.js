// role_id -> role
// role -> data access
const AccessModel = require("../models/access");
const access = new AccessModel();

const rbac = (menuParam, accessParam) => {
  return async (req, res, next) => {   
    const { role_id } = req.user;
    if (role_id === 1) return next();

    const accessByRole = await access.getOne({
      // WHERE
      where: {
        // access.role_id = role_id
        role_id,
        // menus.name = [menu]
        menu: {
          is: {
            name: menuParam.toUpperCase()
          }
        },
        // grant = {[accessParam] : true}
        grant: {
          path: [accessParam],
          equals: true
        }
      }
    });
    console.log(accessByRole);

    // eslint-disable-next-line no-undef
    if (!accessByRole) return next(new ValidationError("Forbidden"));
    return next();
  };
};

module.exports = rbac;
