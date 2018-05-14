import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import * as io from "socket.io-client";

@Component({
  selector: 'page-tracker',
  templateUrl: 'tracker.html',
})
export class TrackerPage {

  socket: any;

  @ViewChild('map') mapElement: ElementRef;
  map: any;
 
  constructor(public navCtrl: NavController, public geolocation: Geolocation) {
 
  }

  task:any;
 
  ionViewDidLoad(){
    this.loadMap();
    // this.task = setInterval(this.updateMap.bind(this), 4000);
    this.updateMap();
  }

  lat: any;
  lng: any;
  latLng: any;
 
  loadMap(){
      this.geolocation.getCurrentPosition().then((position) => {
          this.latLng = new google.maps.LatLng(28.7495, 77.0565);
          let mapOptions = {
              center: this.latLng,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          this.addMarker();
      }, (err) => {
          console.log(err);
      });
  }

  marker: any;

  addMarker(){

    var icon = {
        url: "../../assets/imgs/bus.png", // url
        scaledSize: new google.maps.Size(30, 55), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.latLng,
      icon: icon
    });
    // let content = "<p>I am Here!</p>";         
    // this.addInfoWindow(marker, content);
  }

  newPosition = (data) => {
    if(data!=null || data!=undefined) {
        console.log("in new position");
        this.latLng = new google.maps.LatLng(data.Latitude, data.Longitude);
        this.marker.setPosition(this.latLng);
        var center = new google.maps.LatLng(data.Latitude, data.Longitude);
        this.map.panTo(center);
    }
  }

  addInfoWindow(marker, content){
 
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
   
  }

  updateMap(){
    console.log('listening to socket');

    this.socket = io("http://13.127.248.47:8080");
    this.socket.on('recieveLocation', (data) => {
      console.log(data);
      this.newPosition(data);
    });

  }

}
