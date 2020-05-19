import axios from 'axios';

const form = document.querySelector('form')! as HTMLFormElement;
const address = document.getElementById('address')! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyCB1BK89mb-0E78xC_w7IMgqiy0czOejfc";

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number, lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
};

// declare var google: any;

function searchAddressHandler(e: Event) {
  e.preventDefault();
  const loc = address.value;

  axios
    .get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(loc)}&key=${GOOGLE_API_KEY}`)
    .then(res => {
      if (res.data.status !== 'OK') {
        throw new Error('Could not fetch location');
      }

      const coordinates = res.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById('map')!, {
        center: coordinates,
        zoom: 8
      });

      new google.maps.Marker({position: coordinates, map: map});
    })
    .catch(error => {
      alert(error.message);
      console.log(error)
    });
}

form.addEventListener('submit', searchAddressHandler);