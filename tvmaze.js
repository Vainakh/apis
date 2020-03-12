/** Given a query string, return array of matching shows:
 con
 *     { id, name, summary, episodesUrl }
 */

const NAME = "http://api.tvmaze.com/search/shows?q=<search query>";
const EPISODE = "http://api.tvmaze.com/shows/<show id>/episodes";


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
    event.preventDefault();
  let searchTerm = $("#search-query").val();
  let nameResponse = await axios.get (
    NAME,
    { params: { q: searchTerm } }
  )

  let array = [];

  for (let i = 0; i < nameResponse.data.length; i ++) {

    let id = nameResponse.data[i].show.id
    let name = nameResponse.data[i].show.name
    let summary = nameResponse.data[i].show.summary;
    let image = nameResponse.data[i].show.image;
    if (!image) {
      image = "https://tinyurl.com/tv-missing";
    } else {
      image = nameResponse.data[i].show.image.medium;
    }

    
    array.push({id,
      name,
      summary,
      image
    });
  }

    return array;
  
    // TODO: Make an ajax request to the searchShows api.  Remove
    // hard coded data.
  
    // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary: "<p><b>The Bletchley Circle</b> follows the journey of four ordinary women with extraordinary skills that helped to end World War II.</p><p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their normal lives, modestly setting aside the part they played in producing crucial intelligence, which helped the Allies to victory and shortened the war. When Susan discovers a hidden code behind an unsolved murder she is met by skepticism from the police. She quickly realises she can only begin to crack the murders and bring the culprit to justice with her former friends.</p>",
  //     image: "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  // console.log(shows.data.show.image);

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
        <img class="card-img-top" src="${show.image}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn-episode" value="${show.id}">Episodes</button>
             <div id="episode-list"></div>
           </div>
         </div>
       </div>
      `
    );
    

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

$("#shows-list").on("click", ".btn-episode", async function getEpisodes(id) {
  event.preventDefault();
  
  
  let episodeId = event.target.value;
  let episodeResponse = await axios.get(
    `http://api.tvmaze.com/shows/${episodeId}/episodes`
  )

  let array = [];

  for (let i = 0; i < episodeResponse.data.length; i++) {

    let id = episodeResponse.data[i].id;
    let name = episodeResponse.data[i].name;
    let season = episodeResponse.data[i].season;
    let number = episodeResponse.data[i].number;
    // if (!image) {
    //   image = "https://tinyurl.com/tv-missing";
    // } else {
    //   image = episodeResponse.data[i];
    // }
    array.push({
      id,
      name,
      season,
      number
    });


    populateEpisodes(array);
  }


  function populateEpisodes(episodes) {
    const $episodeList = $("#episode-list");
    console.log($episodeList);
    $episodeList.empty();

    // console.log(shows.data.show.image);

    for (let episode of episodes) {
      let $item = $(
        `
            <div>
            <div id="list-contaner"> Id ${episode.id}

            </div>
            <div id="list-contaner"> Episode ${ episode.name}

            </div>
            <div id="list-contaner"> Season ${episode.season}

            </div>
            <div id="list-contaner"> Part ${episode.number}

            </div>
        </div>
        
      `
      );


      $episodeList.append($item);
    }
  }

  return array;
  // console.log(episodeResponse)
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
});
