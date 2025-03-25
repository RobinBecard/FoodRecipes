import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-videoplayer',
  templateUrl: './videoplayer.component.html',
  standalone:false,
  styleUrls: ['./videoplayer.component.css']
})
export class VideoplayerComponent implements OnInit {

  @Input() video!: string; 
  playerReady: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Logique de gestion à l'initialisation, si nécessaire
  }

  // Cette méthode sera appelée lorsque le lecteur YouTube est prêt
  onPlayerReady(event: any): void {
    this.playerReady = true;
    console.log('Player is ready', event);
  }

  // Méthode pour extraire l'ID de la vidéo YouTube
  getYouTubeVideoId(url: string): string {
    const regex = /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+|(?:v|e(?:mbed)?)\/([a-zA-Z0-9_-]+)|.*[?&]v=([a-zA-Z0-9_-]+))|youtu\.be\/([a-zA-Z0-9_-]+)))/;
    const match = url.match(regex);
    return match ? match[1] || match[2] || match[3] : '';
  }
}
