/* eslint-disable security/detect-object-injection */

// https://blog.nodeswat.com/implement-access-control-in-node-js-8567e7b484d1

// RBAC or Role Based Access Control is an access control method where each identity is assigned
// a role and the roles determine what access rights the identity has. This is opposed to IBAC,
// where each identity has separate privilege assignment. RBAC looses some granularity compared to
// IBAC, however it gains better manageability in environments with large amounts of users.

// RBAC is usually implemented as a Hierarchy of roles (HRBAC). This allows roles to inherit
// privileges from other roles, which in turn makes it easier to add new operational privileges to
// the whole tree.

class RBAC {
  constructor(opts) {
    this.init(opts);
  }

  init(roles) {
    if (typeof roles !== 'object') throw new TypeError('Expected an object as input');
    this.roles = roles;
    const map = {};
    Object.keys(roles).forEach((role) => {
      map[role] = { can: {} };
      if (roles[role].inherits) map[role].inherits = roles[role].inherits;
      roles[role].can.forEach((operation) => {
        if (typeof operation === 'string') {
          map[role].can[operation] = 1;
        } else if (typeof operation.name === 'string' && typeof operation.when === 'function') {
          map[role].can[operation.name] = operation.when;
        }
      });
    });
    this.roles = map;
  }

  can(role, operation, params) {
    return new Promise((resolve, reject) => {
      // Check if role exists
      if (!this.roles[role]) return false;
      const _role = this.roles[role];
      // Check if this role has this operation
      if (_role.can[operation]) {
        // Not a function so we are good
        if (typeof _role.can[operation] !== 'function') return true;
        // If the function check passes return true
        if (_role.can[operation](params)) return true;
      }
      // Check if there are any parents
      if (!_role.inherits || _role.inherits.length < 1) return false;
      // Check child roles until one returns true or all return false
      return _role.inherits.some(childRole => this.can(childRole, operation, params));
    });
  }
}

module.exports = RBAC;
