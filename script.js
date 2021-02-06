'use strict'

function goFetch() {
  function formatQueryParamsStart(paramsStart) {
    const queryItems = Object.keys(paramsStart)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsStart[key])}`)
    return queryItems.join('&');
  }
    /**-------------------URL SETUP AND PARAMETERS --------------------*/
    const userStartLocation = $('#startingInput').val();
    const baseMapboxUrlOne = `https://api.mapbox.com/geocoding/v5/mapbox.places/${userStartLocation}.json`;
    const apiKeyMap = "pk.eyJ1IjoianVzdGluYmFybmlrb3ciLCJhIjoiY2trbW00aTQyMW1kNzJvcDd1N3lmdXc5YyJ9.oLLeeMwPnjYSXk-z_XC-1w";
    const paramsStart = {
      access_token: apiKeyMap,
      limit: 3,
    }
    const queryStringStart = formatQueryParamsStart(paramsStart);
    const mapboxUrl = baseMapboxUrlOne + '?' + queryStringStart;
    const podcastInput = $('#podcastSearchInput').val();

  fetch(mapboxUrl)
    .then(response => response.json())
    .then(mapboxStartResponse => mapboxStartResult(mapboxStartResponse))
    .catch(error => alert('oops! stop.'))


    function mapboxStartResult(mapboxStartResponse) {
      const startGeoArray = [];
      startGeoArray.push(mapboxStartResponse.features[0].geometry.coordinates[1], mapboxStartResponse.features[0].geometry.coordinates[0]);
    /**-------------------URL SETUP AND PARAMETERS --------------------*/
      function formatQueryParamsEnd(paramsEnd) {
      const queryItems = Object.keys(paramsEnd)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsEnd[key])}`)
      return queryItems.join('&');
      }/**END OF formatQueryParams(params) BRACKET */  

      const userEndLocation = $('#endingInput').val();
      const baseMapboxUrlTwo = `https://api.mapbox.com/geocoding/v5/mapbox.places/${userEndLocation}.json`;
      const paramsEnd = {
        access_token: apiKeyMap,
        limit: 3,
      }

      const queryStringEnd = formatQueryParamsEnd(paramsEnd);
      const mapboxUrlTwo = baseMapboxUrlTwo + '?' + queryStringEnd;


      fetch(mapboxUrlTwo)
        .then(response => response.json())
        .then(mapboxEndResponse => mapboxEndResult(mapboxEndResponse))
        .catch(error => alert('oops! stop.'))

        function mapboxEndResult(mapboxEndResponse) {
          const endGeoArray = [];
          endGeoArray.push(mapboxEndResponse.features[0].geometry.coordinates[1], mapboxEndResponse.features[0].geometry.coordinates[0]);
          console.log(startGeoArray);
          console.log(mapboxStartResponse.features[0].place_name);
          console.log(endGeoArray)
          console.log(mapboxEndResponse.features[0].place_name);
      /**-------------------URL SETUP AND PARAMETERS --------------------*/
          function formatQueryParamsBing(paramsBing) {
            const queryItems = Object.keys(paramsBing).map(
            key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsBing[key])}`
            );
            return queryItems.join("&");
            }
            const startingCoordinates = $('#myLocation').val();
            const endingCoordinates = $('#myDestination').val();
            const current = startGeoArray;
            const dest = endGeoArray;
            const travelType = $('#myVehicle').val();
            const baseDistanceUrl = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix`;
            const vehicle = 'driving';
            const apiKeyBing = "Air7P5oll2Ivmi1sx1fJpU65mKmYiZOPKVwBzsLrvgPfXnnsLsyKHMpe6bVQ2UhW";
            const paramsBing = {
              origins: current,
              destinations: dest,
              travelMode: vehicle,
              key: apiKeyBing
            }
            const queryStringBing = formatQueryParamsBing(paramsBing);
            const distanceUrl = baseDistanceUrl + '?' + queryStringBing;

            fetch(distanceUrl)
            .then(response => response.json())
            .then(distanceResponse => distanceResults(distanceResponse))
            .catch(error => alert('oops! stop.'))

            function distanceResults(distanceResponse) {
              const distanceKilos = `${distanceResponse.resourceSets[0].resources[0].results[0].travelDistance}`
              const distanceMiles = distanceKilos * 0.621371
              const durationMinutes = `${distanceResponse.resourceSets[0].resources[0].results[0].travelDuration}`
              const distanceMilesRounded = distanceMiles.toFixed(2);
              const durationMinutesRounded = Math.round(durationMinutes);
              console.log("Trip Distance: " + distanceMilesRounded + " miles");
              console.log("Trip Duration: " + durationMinutesRounded + " minutes");
              console.log(podcastInput);

              function formatPodcastQueryParams(podcastParams) {
                const queryItems = Object.keys(podcastParams).map(
                key => `${encodeURIComponent(key)}=${encodeURIComponent(podcastParams[key])}`
                  );
                return queryItems.join("&");
              }

              const basePodcastUrl = "https://listen-api.listennotes.com/api/v2/search";
              const apiPodKey = "128acc2bf3774b9e8117982bb6657dd1";
              const query = podcastInput;
              const minLength = durationMinutesRounded - 5 ;
              const maxLength = durationMinutesRounded + 5;
              console.log(minLength);
              console.log(maxLength);

              const podcastParams = {
                q: query,
                type: 'episode',
                len_min: minLength,
                len_max: maxLength,
                }
                
              const queryPodcastString = formatPodcastQueryParams(podcastParams);
              const podcastUrl = basePodcastUrl + '?' + queryPodcastString;

              const options = {
                headers: new Headers ({
                "X-ListenAPI-Key": apiPodKey,
                })
                };

                fetch(podcastUrl, options)
                  .then(response => {
                      if (response.ok) {
                        return response.json();
                      }
                      throw new Error(response.statusText);
                    })
                    .then(podscastResponse => podcastResults(podscastResponse))
                    .catch(error => alert('Oops! Looks like something went wrong.'))


              function podcastResults(podscastResponse) {
                $('.travelResults').empty();
                $('.travelresults').append(`<p id="travelResults">
                Estimated Travel Time: ${durationMinutes}
                </p>`);
                $('.results').empty();
                for(let i = 0; i < 10; i++) {
                  const audioSeconds = `${podscastResponse.results[i].audio_length_sec}`;
                  const audioMinutes = audioSeconds / 60;
                  const audioMinutesFixed = audioMinutes.toFixed(0);
                  //if(audioMinutesFixed === )
                  $('.results').append(`<article class="episodeItem"><ul class="item">
                  <li><h2>${podscastResponse.results[i].title_original}<h2></li>
                  <li><img src="${podscastResponse.results[i].thumbnail}" alt="podcast thumbnail"/></li>
                  <li><p>${podscastResponse.results[i].description_original}</p></li>
                  <li><p>Listennotes Page: <a href="${podscastResponse.results[i].listennotes_url}">Here</a></p></li>
                  <li><p>Website: <a href="${podscastResponse.results[i].link}">Here</a></p></li>
                  <li><p> ${audioMinutesFixed} minutes long</p></li>
                  </ul></article>`)
                }
                $('.results').removeClass('hidden');
                $('.travelResults').removeClass('hidden')
              }
            }
        }
    }
}


function clickFindButton() {
  $('form').submit(event => {
  event.preventDefault()

  goFetch();
  });
}

function handleEverything() {
  $(clickFindButton);
}

$(clickFindButton)