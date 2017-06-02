
exports.seed = function(knex, Promise) {
  return knex('garage').del()
    .then(() => {
      return knex('garage').insert([
        { id: 1, item: 'car', reason: 'because.', cleanliness: 'sparkling' },
        { id: 2, item: 'snowboard', reason: 'it is summer.', cleanliness: 'dusty' },
        { id: 3, item: 'tools', reason: 'because', cleanliness: 'rancid' },
      ]);
    });
};
