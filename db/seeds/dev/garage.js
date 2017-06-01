
exports.seed = function(knex, Promise) {
  return knex('garage').del()
    .then(() => {
      return knex('garage').insert([
        { item: 'car', reason: 'because.', cleanliness: 'sparkling' },
        { item: 'snowboard', reason: 'it is summer.', cleanliness: 'dusty' },
        { item: 'tools', reason: 'because', cleanliness: 'rancid' },
      ]);
    });
};
