const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const validatePost = (item) => {
  const itemProps = ['item', 'reason', 'cleanliness'];
  const propCheck = itemProps.every(prop => item.hasOwnProperty(prop));
  const propLength = Object.keys(item).length === 3;
  return (propCheck && propLength);
}

const validatePatch = (item) => {
  console.log(item);
  const itemProps = Object.keys(item);
  return (itemProps.includes('cleanliness') && itemProps.length === 1);
}

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);


app.get('/api/v1/items', (request, response) => {
  database('garage').select()
    .then(items => {
      response.status(200).json(items)
    })
    .catch(error => response.status(500).send({ error: error }))
});

app.post('/api/v1/items', (request, response) => {
  const item = request.body;
  if (validatePost(item)) {
    database('garage').insert(item, 'id')
      .then(item => {
        response.status(201).json({ id: item[0] })
      })
      .catch(error => response.status(500).send({ error: error }))
  } else {
    response.status(422).send({ error: 'Unprocessable entity.'})
  }
});

app.patch('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;
  const updatedItem = request.body;

  if (validatePatch(updatedItem)) {
    database('garage').where('id', id).update(updatedItem)
      .then(item => {
        response.status(201).send('item has been updated.')
      })
      .catch(error => response.status(500).send({ error: error }))
    } else {
      response.status(422).send({ error: 'Unprocessable entity.'})
    };
});

app.listen(app.get('port'), () => {
  console.log(`server running on port ${app.get('port')}`);
});
