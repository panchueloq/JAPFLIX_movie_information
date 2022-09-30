// Francisco Quagliotti, Andrea Bustos, Diego Sosa

// objects
const input = document.getElementById('inputBuscar');
const btn = document.getElementById('btnBuscar');

// fetch data
async function getData(){
    let link = `https://japceibal.github.io/japflix_api/movies-data.json`;
    let response = await fetch(link);
    if(response.ok){
        let data = await response.json();
        return data;
    }
}
document.addEventListener('DOMContentLoaded', async function(){
    let data = await getData();
    Search(data);    
})

// GET MOVIE LIST
var the_list = [];

function Search(data){
    btn.addEventListener('click', ()=>{
        the_list = data.filter(match_search);
        if(input.value != ''){
            add_to_html(the_list);
        }
        input.value = '';
    })
}
function match_search(movie){
    let search = input.value.toLowerCase();
    if ((movie.title).toLowerCase().includes(search)){
        return true;
    }
    else if ((movie.overview).toLowerCase().includes(search)){
        return true;
    }
    else if ((movie.tagline).toLowerCase().includes(search)){
        return true;
    }
    else if(getGenres(movie, search)){
        return true;
    }
    else {
        return false;
    }
}
function getGenres(movie, the_search){
    for(let genre of movie.genres){
        if((genre.name).toLowerCase().includes(the_search)){
            return true;
        }
    }
}

// filling the HTML
function add_to_html(the_list){
    let container = document.getElementById('lista');
    let content = "";
    the_list.forEach(element => {

        const star_array = ['','','','',''];
        star_array.forEach((star, idx) => {
            let score = element.vote_average;
            score = Math.round(score/2);
            if (score > idx){
            star_array[idx] = 'checked';
          }
        });

        content += `
    <li class="list-group-item d-flex bg-secondary text-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop" onclick="disply_info(${element.id})">
        <div class="col-8">
            <h5>${element.title}</h5>
            <p>${element.tagline}</p>
        </div>
        <div class="col-4 text-end">
            <span class="fa fa-star ${star_array[0]}"></span>
            <span class="fa fa-star ${star_array[1]}"></span>
            <span class="fa fa-star ${star_array[2]}"></span>
            <span class="fa fa-star ${star_array[3]}"></span>
            <span class="fa fa-star ${star_array[4]}"></span>
        </div>
    </li>`
    });
    container.innerHTML = content;
}

// display the pop-up with the rest of the movie's info
function disply_info(idx){
    let the_movie = the_list.filter(movie => movie.id === idx);
    the_movie = the_movie[0];
    document.getElementById('offcanvasTopLabel').innerText = the_movie.title;
    document.getElementById('offcanvas_description').innerText = the_movie.overview;
    let movie_genres = "";
    (the_movie.genres).forEach(element => {
        if (movie_genres === ""){
            movie_genres += `${element.name}`
        }
        else{
            movie_genres += ` - ${element.name}`
        }
        document.getElementById('offcanvas_genres').innerText = movie_genres
    });
    document.getElementById('drop_year').innerText = `${the_movie.release_date.slice(0, 4)}`
    document.getElementById('drop_runtime').innerText = `${the_movie.runtime} mins.`
    document.getElementById('drop_budget').innerText = `$${the_movie.budget}`
    document.getElementById('drop_revenue').innerText = `$${the_movie.revenue}`
}