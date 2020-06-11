let allUsersList = [];
let foundUsersList = [];

let usersTitle = null;
let statisticsTitle = null;

let foundUsers = null;
let userStatistics = null;

let inputSearch = null;
let searchButton = null;

window.addEventListener('load', () => {
  function searchUsers(event) {
    const hasText = !!event.target.value && event.target.value.trim() !== '';

    if (!hasText) {
      searchButton.setAttribute('disabled', '');
      clearInput();

      return;
    }

    searchButton.removeAttribute('disabled');

    const lowerCaseInput = event.target.value.toLowerCase();

    foundUsersList = allUsersList
      .filter((user) => {
        const lowerCaseName = user.name.toLowerCase();

        return lowerCaseName.includes(lowerCaseInput);
      })
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

    if (event.key === 'Enter') {
      render();
    }
  }

  function insertUsers() {
    render();
  }

  inputSearch = document.querySelector('#search');
  searchButton = document.querySelector('#search-button');

  inputSearch.addEventListener('keyup', searchUsers);
  searchButton.addEventListener('click', insertUsers);

  usersTitle = document.querySelector('#users-title');
  statisticsTitle = document.querySelector('#statistics-title');

  foundUsers = document.querySelector('#found-users');
  userStatistics = document.querySelector('#users-statistics');

  fetchUsers();
});

async function fetchUsers() {
  const preLoader = document.querySelector('#pre-loader');

  // prettier-ignore
  const res = await fetch
  ('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const json = await res.json();

  allUsersList = json.results.map((user) => {
    const { name, dob, picture, gender } = user;

    return {
      name: `${name.first} ${name.last}`,
      age: dob.age,
      picture: picture.large,
      gender,
    };
  });

  preLoader.innerHTML = '';

  console.log('Users loaded successfully!');

  inputSearch.focus();
}

function render() {
  renderFoundUsers();
  renderUsersStatistics();
}

function renderFoundUsers() {
  foundUsers.innerHTML = '';
  usersTitle.innerHTML = '';

  usersTitle.textContent = `👥 ${foundUsersList.length} user(s) found`;

  let usersHTML = `<div class="container">
                       <div class="row">`;

  foundUsersList.forEach((user) => {
    const { name, age, picture } = user;

    const userHTML = `
    <div class="col-6 col-md-4 p-2 d-flex justify-content-center">
        <div class='user box-shadow px-0'>
          <div>
            <img src="${picture}" alt ="${name}">
          </div>
          <div class="text-center ml-1">
            <h6 class="font-weight-bold mb-0" style="font-size: 0.42em">${name} <br>
            <span class="font-weight-normal"> ${age} years old </span>
            </h6>
          </div>         
          
            <a href="#" class="text-warning ml-1">
              <i class="fas fa-thumbs-up fa-xs"></i>
            </a>
        </div>
    </div>
    `;

    usersHTML += userHTML;
  });

  usersHTML += `</div>
                  </div>`;
  foundUsers.innerHTML = usersHTML;
}

function renderUsersStatistics() {
  userStatistics.innerHTML = '';
  statisticsTitle.innerHTML = '';

  statisticsTitle.textContent = `📋 Statistics`;

  const numberOfMales = foundUsersList.reduce((accumulator, current) => {
    const total = current.gender === 'male' ? accumulator + 1 : accumulator;
    return total;
  }, 0);

  const numberOfFemales = foundUsersList.length - numberOfMales;

  const sumOfAges = foundUsersList.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);

  const avarageAges =
    sumOfAges > 0 ? (sumOfAges / foundUsersList.length).toFixed(2) : 0;

  const statisticsHTML = `
  <div class="d-flex justify-content-center">
    <div>
      <h6><span class="font-weight-bold">👦 Male(s):</span> ${numberOfMales} people(s)</h6>
      <h6><span class="font-weight-bold">👧 Female(s):</span> ${numberOfFemales} people(s)</h6>
      <h6><span class="font-weight-bold">👴🧓 Sum of Ages:</span> ${sumOfAges} years old</h6>
      <h6><span class="font-weight-bold">👨👩 Average Ages:</span> ${avarageAges} years old</h6>
    </div>
  </div>

  `;

  userStatistics.innerHTML = statisticsHTML;
}

const clearInput = () => {
  inputSearch.value = '';
  inputSearch.focus();
};
