import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { TrackerPage } from '../tracker/tracker';
import * as io from "socket.io-client";

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  socket: any;

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker: any;
  latLng: any;
 
  constructor(public navCtrl: NavController, public geolocation: Geolocation) {
 
  }
 
  ionViewDidLoad(){
    this.loadMap();
  }
 
  loadMap(){
    console.log('hi');
 
    this.geolocation.getCurrentPosition().then((position) => {
 
      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: this.latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      console.log(mapOptions);
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarker();
 
    }, (err) => {
      console.log(err);
    });

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {

      console.log(data);

      this.socket = io('http://13.127.248.47:8080');
      this.socket.emit('transmitLocation',{Longitude:data.coords.longitude,Latitude:data.coords.latitude});

      this.latLng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      this.map.panTo(this.latLng);
      
      var dataPos = {
        'Latitude': data.coords.latitude,
        'Longitude': data.coords.longitude
      }
      this.newPosition(dataPos);
    });

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

  addMarker(){

    console.log("in add marker");
 
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.latLng,
    });
   
  }

  aaglaPage(){
    this.navCtrl.push(TrackerPage);
  }

}
