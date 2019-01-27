// https://blog.nodeswat.com/implement-access-control-in-node-js-8567e7b484d1

// https://onury.io/accesscontrol/

// RBAC or Role Based Access Control is an access control method where each identity is assigned
// a role and the roles determine what access rights the identity has. This is opposed to IBAC,
// where each identity has separate privilege assignment. RBAC looses some granularity compared to
// IBAC, however it gains better manageability in environments with large amounts of users.

// RBAC is usually implemented as a Hierarchy of roles (HRBAC). This allows roles to inherit
// privileges from other roles, which in turn makes it easier to add new operational privileges to
// the whole tree.
