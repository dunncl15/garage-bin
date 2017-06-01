const $itemName = $('.item-input--name');
const $itemReason = $('.item-input--reason');
const $itemCleanliness = $('.item-select');
const $sparklingCount = $('.item-count--sparkling');
const $dustyCount = $('.item-count--dusty');
const $rancidCount = $('.item-count--rancid');
const $totalCount = $('.item-count--total');

const getAllItems = () => {
  clearGarage();
  fetch('/api/v1/items')
  .then(response => response.json())
  .then(items => {
    appendItems(items)
    updateCounter(items)
  })
  .catch(error => console.log(error))
}

const addNewItem = (item) => {
  fetch('api/v1/items', {
    method: 'POST',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(item)
  })
  .then(response => getAllItems())
  .catch(error => console.log('error: ', error))
}

const updateItem = (id, cleanliness) => {
  fetch(`/api/v1/items/${id}`, {
    method: 'PATCH',
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify(cleanliness)
  })
  .then(response => getAllItems())
  .catch(error => console.log(error))
}

const deleteItem = (id) => {
  fetch(`/api/v1/items/${id}`, {
    method: 'DELETE'
  })
  .then(() => getAllItems())
  .catch(error => console.log(error))
}

const updateCounter = (items) => {
  const sparklingCount = items.filter(item => item.cleanliness === 'sparkling').length;
  const dustyCount = items.filter(item => item.cleanliness === 'dusty').length;
  const rancidCount = items.filter(item => item.cleanliness === 'rancid').length;

  $sparklingCount.text(sparklingCount);
  $dustyCount.text(dustyCount);
  $rancidCount.text(rancidCount);
  $totalCount.text(items.length);
}

const clearInputs = () => {
  $itemName.val('');
  $itemReason.val('');
  $itemCleanliness.val('select cleanliness');
}

const clearGarage = () => {
  $('.garage').children('.item').remove();
}

getAllItems();

const appendItems = (items) => {
  return items.map(item => {
    $('.garage').append(`
      <article class='item' id='${item.id}'>
        <button class='delete-btn'>Delete</button>
        <p>Item: ${item.item}</p>
        <div class='inner-content'>
          <p>Reason: ${item.reason}</p>
          <p class='cleanliness'>Cleanliness: ${item.cleanliness}</p>
          <select class='update-cleanliness'>
            <option value='update cleanliness'>Update cleanliness</option>
            <option value='sparkling'>sparkling</option>
            <option value='dusty'>dusty</option>
            <option value='rancid'>rancid</option>
          </select>
        </div>
      </article>
    `)
  })
}

$('.add-item-btn').on('click', function(e) {
  e.preventDefault();
  const item = {
    item: $itemName.val(),
    reason: $itemReason.val(),
    cleanliness: $itemCleanliness.val()
  }
  addNewItem(item);
  clearInputs();
});

$('.garage').on('click', '.delete-btn', function() {
  console.log('delete');
  const id = $(this).closest('.item').attr('id');
  deleteItem(id);
})

$('.garage').on('change', '.update-cleanliness', function(e) {
  $(this).prev().text(e.target.value);
  const cleanliness = { cleanliness: $(this).prev().text() }
  const id = $(this).closest('.item').attr('id');
  updateItem(id, cleanliness);
});

$('.open-btn').on('click', function() {
  $('.garage-door').toggleClass('open')
})
