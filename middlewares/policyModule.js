// policyModule.js
const { AbilityBuilder, Ability } = require('@casl/ability');

// Define your policies
const policies = {
  guest(user, { can }) {
    can('read', 'Product');
  },

  user(user, { can }) {
    can('read', 'Product');
    can('create', 'Order', { user_id: user._id });
    can('read', 'Order', { user_id: user._id });
    can('update', 'User', { _id: user._id });
    can('read', 'Cart', { user_id: user._id });
    can('update', 'Cart', { user_id: user._id });
    can('read', 'DeliveryAddress');
    can('create', 'DeliveryAddress', { user_id: user._id });
    can('update', 'DeliveryAddress', { user_id: user._id });
    can('delete', 'DeliveryAddress', { user_id: user._id });
    can('read', 'Invoice', { user_id: user._id });
  },

  admin(user, { can }) {
    can('manage', 'all'); // Admin can perform any action on any resource
  },
};

// Function to create Ability instance based on user role
const policyFor = (user) => {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user && typeof policies[user.role] === 'function') {
    policies[user.role](user, { can, cannot });
  } else {
    policies.guest(user, { can, cannot });
  }

  return build();
};

// Function to extract token from request headers
const getToken = (req) => {
  let token = req.headers.authorization
    ? req.headers.authorization.replace('Bearer', '').trim()
    : null;
  return token && token.length ? token : null;
};

module.exports = {
  getToken,
  policyFor,
};
