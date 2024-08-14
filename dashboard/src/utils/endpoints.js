export const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    refresh: "/auth/refresh",
    username: "/auth/username",
  },

  profile: "/users/me",
  users: { getAll: "/users" },
  trainers: { getAll: "/trainers" },
  leads: { getAll: "/leads" },
  followups: { getAll: "/followups" },
  freezeMemberships: { getAll: "/freezeMemberships" },
  products: {
    getAll: "/products",
    admin: "/products/admin/getAll",
    attribute: {
      getAll: "/product-attributes",
      term: "/product-attribute-terms",
    },
  },
  files: {
    upload: "/upload/files",
    getFiles: "/upload",
  },
  memberships: {
    getAll: "/memberships",
  },
  members: {
    getAll: "/members",
  },
  customerMemberships: {
    getAll: "/customerMemberships",
  },
  membershipPerk: {
    getAll: "/membershipPerks",
  },
};
