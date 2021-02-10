"use strict";

/** GET - starting location turned into coordinates */
function getStartingPoint() {
  /**format query parameters */
  function formatQueryParamsStart(paramsStart) {
    const queryItems = Object.keys(paramsStart).map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(paramsStart[key])}`
    );
    return queryItems.join("&");
  }
  /**url and fetch setup for starting location */
  const userStartLocation = $("#startingInput").val();
  const baseStartLocationUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${userStartLocation}.json`;
  const apiKeyMap =
    "pk.eyJ1IjoianVzdGluYmFybmlrb3ciLCJhIjoiY2trbW00aTQyMW1kNzJvcDd1N3lmdXc5YyJ9.oLLeeMwPnjYSXk-z_XC-1w";
  const paramsStart = {
    access_token: apiKeyMap,
    limit: 3,
  };
  const queryStringStart = formatQueryParamsStart(paramsStart);
  const startLocationUrl = baseStartLocationUrl + "?" + queryStringStart;
  const podcastInput = $("#podcastSearchInput").val();
  /**FETCH starting location coordinates data */
  fetch(startLocationUrl)
    .then((response) => response.json())
    .then((startLocationResponse) => handleStartResponse(startLocationResponse))
    .catch((error) => alert("oops! stop."));
  /**HANDLE starting coordinates data*/
  function handleStartResponse(startLocationResponse) {
    const startGeoArray = [];
    startGeoArray.push(
      startLocationResponse.features[0].geometry.coordinates[1],
      startLocationResponse.features[0].geometry.coordinates[0]
    );

    /**format query parameters */
    function formatQueryParamsEnd(paramsEnd) {
      const queryItems = Object.keys(paramsEnd).map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(paramsEnd[key])}`
      );
      return queryItems.join("&");
    }
    /**url and fetch setup for ending location */
    const userEndLocation = $("#endingInput").val();
    const baseEndLocationUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${userEndLocation}.json`;
    const paramsEnd = {
      access_token: apiKeyMap,
      limit: 3,
    };

    const queryStringEnd = formatQueryParamsEnd(paramsEnd);
    const endingLocationUrl = baseEndLocationUrl + "?" + queryStringEnd;
    /**FETCH ending location coordinates data */
    fetch(endingLocationUrl)
      .then((response) => response.json())
      .then((endLocationResponse) => handleEndResponse(endLocationResponse))
      .catch((error) => alert("oops! stop."));
    /**HANDLE ending coordinates data*/
    function handleEndResponse(endLocationResponse) {
      const endGeoArray = [];
      endGeoArray.push(
        endLocationResponse.features[0].geometry.coordinates[1],
        endLocationResponse.features[0].geometry.coordinates[0]
      );
      console.log(startGeoArray);
      console.log(startLocationResponse.features[0].place_name);
      console.log(endGeoArray);
      console.log(endLocationResponse.features[0].place_name);
      /**format query parameters */
      function formatQueryParamsBing(paramsBing) {
        const queryItems = Object.keys(paramsBing).map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(paramsBing[key])}`
        );
        return queryItems.join("&");
      }
      /**url and fetch setup for distance matrix */
      const startingCoordinates = $("#myLocation").val();
      const endingCoordinates = $("#myDestination").val();
      const current = startGeoArray;
      const dest = endGeoArray;
      const travelType = $("#myVehicle").val();
      const baseDistanceUrl = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix`;
      const vehicle = "driving";
      const apiKeyBing =
        "Air7P5oll2Ivmi1sx1fJpU65mKmYiZOPKVwBzsLrvgPfXnnsLsyKHMpe6bVQ2UhW";
      const paramsBing = {
        origins: current,
        destinations: dest,
        travelMode: vehicle,
        key: apiKeyBing,
      };
      const queryStringBing = formatQueryParamsBing(paramsBing);
      const distanceUrl = baseDistanceUrl + "?" + queryStringBing;

      /**FETCH distance matrix data */
      fetch(distanceUrl)
        .then((response) => response.json())
        .then((distanceResponse) => distanceResults(distanceResponse))
        .catch((error) => alert("oops! stop."));
      /**HANDLE distance matrix data*/
      function distanceResults(distanceResponse) {
        const distanceKilos = `${distanceResponse.resourceSets[0].resources[0].results[0].travelDistance}`;
        const distanceMiles = distanceKilos * 0.621371;
        const durationMinutes = `${distanceResponse.resourceSets[0].resources[0].results[0].travelDuration}`;
        const distanceMilesRounded = distanceMiles.toFixed(2);
        const durationMinutesRounded = Math.round(durationMinutes);
        /**IF STATEMENT - margin of error for travel time  */
        if (durationMinutesRounded >= 0 && durationMinutesRounded < 80) {
          const minLength = durationMinutesRounded - 2;
          const maxLength = durationMinutesRounded + 2;
          getPodcastResults(minLength, maxLength);
        } else if (
          durationMinutesRounded >= 80 &&
          durationMinutesRounded < 150
        ) {
          const minLength = durationMinutesRounded - 4;
          const maxLength = durationMinutesRounded + 4;
          getPodcastResults(minLength, maxLength);
        } else {
          const minLength = durationMinutesRounded - 10;
          const maxLength = durationMinutesRounded + 10;
          getPodcastResults(minLength, maxLength);
        }
        /**FETCH podcasts setup */
        function getPodcastResults(minLength, maxLength) {
          /**format query parameters */
          function formatPodcastQueryParams(podcastParams) {
            const queryItems = Object.keys(podcastParams).map(
              (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(
                  podcastParams[key]
                )}`
            );
            return queryItems.join("&");
          }
          /**url and fetch setup for podcasts */
          const basePodcastUrl =
            "https://listen-api.listennotes.com/api/v2/search";
          const apiPodKey = "128acc2bf3774b9e8117982bb6657dd1";
          const query = podcastInput;

          const podcastParams = {
            q: query,
            type: "episode",
            len_min: minLength,
            len_max: maxLength,
            language: "English",
          };

          const queryPodcastString = formatPodcastQueryParams(podcastParams);
          const podcastUrl = basePodcastUrl + "?" + queryPodcastString;

          const options = {
            headers: new Headers({
              "X-ListenAPI-Key": apiPodKey,
            }),
          };
          /**FETCH podcast list data */
          fetch(podcastUrl, options)
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              throw new Error(response.statusText);
            })
            .then((podscastResponse) => podcastResults(podscastResponse))
            .catch((error) => alert("Oops! Looks like something went wrong."));

          /**HANDLE podcast list data
           * create result variables
           */
          function podcastResults(podscastResponse) {
            $(".results").empty();
            $("#yourTripLength").empty();
            const searchLength = `${podscastResponse.count}`;
            $("#yourTripLength").append(`<br><p id="yourTripStyle">
                -${startLocationResponse.features[0].text} to ${endLocationResponse.features[0].text} <br> -Travel Time: ${durationMinutesRounded} minutes <br> -Podcasts Found: ${searchLength}
                </p>`);

            for (let i = 0; i < searchLength; i++) {
              const audioSeconds = `${podscastResponse.results[i].audio_length_sec}`;
              const audioMinutes = audioSeconds / 60;
              const audioMinutesFixed = audioMinutes.toFixed(0);
              const podcastDescriptionFull = `${podscastResponse.results[i].description_original}`;

              if (podcastDescriptionFull.length < 200) {
                const podcastDescriptionFixed = podcastDescriptionFull;
                console.log(podcastDescriptionFixed);
                appendPodcasts(podcastDescriptionFixed);
              } else {
                const podcastDescriptionFixed =
                  podcastDescriptionFull.substring(0, 200) +
                  `<a href=${podscastResponse.results[i].listennotes_url} target="_blank"> ....visit episode page</a>`;
                appendPodcasts(podcastDescriptionFixed);
              }
              /**APPEND results to page */
              function appendPodcasts(podcastDescriptionFixed) {
                //if(audioMinutesFixed === )
                $(".results")
                  .append(`<div class="space"><article class="listStyle item">
                  <h2>${podscastResponse.results[i].title_original}</h2>

                  <img src="${podscastResponse.results[i].thumbnail}" alt="thumbnail image for podcast"/>

                  <p id="minutesLong"> ${audioMinutesFixed} minutes long</p>

                  <a href="${podscastResponse.results[i].listennotes_url}" target="_blank"> listen to episode now </a>

                  <br>

                  <a href="${podscastResponse.results[i].link}" target="_blank"> visit official website </a>

                  <p id="podcastDescriptionStyle"><span id="descTag">Description</span><br>${podcastDescriptionFixed}</p>

                  </article></div>`);
                $(".results").removeClass("hidden");
                $(".travelResults").removeClass("hidden");
              }
            }
          }
        }
      }
    }
  }
}

/** SEARCH BUTTON - run function to retrieve data */
function clickSearchButton() {
  $("#travelpodForm").submit((event) => {
    event.preventDefault();

    getStartingPoint();
  });
}

/** HANDLE - handle all of the buttons and starting functions */
function handleEverything() {
  $(clickSearchButton);
}

$(handleEverything);
