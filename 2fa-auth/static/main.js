const image = document.querySelector('#image');
const form = document.querySelector('#form');
const input = document.querySelector('#input');

fetch(
  'http://0.0.0.0:5000/login',
  {
    method: 'POST',
    headers: {
      Accept: 'text/plain',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'jon.doe@gmail.com',
      password: '1a2s3d',
    }),
  },
)
  .then((res) => {
    res
      .text()
      .then((text) => {
        if (text === 'Success') {
          fetch(
            'http://0.0.0.0:5000/auth/setup',
            {
              method: 'POST',
              headers: { Accept: 'application/json' },
            },
          )
            .then((res2) => {
              res2
                .json()
                .then((obj) => { image.src = obj.dataURL; });
            })
            .catch((err) => { throw new Error(err); });
        } else {
          console.info(text);
        }
      });
  })
  .catch((err) => { throw new Error(err); });

form.addEventListener('submit', (event) => {
  event.preventDefault();
  fetch(
    'http://0.0.0.0:5000/auth/verify',
    {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: input.value }),
    },
  )
    .then((res) => {
      res
        .text()
        .then((text) => { console.info(text); });
    })
    .catch((err) => { throw new Error(err); });
});
