import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = 'YSul6ILF6RZwMvpdlWNqVMf1WBeyLjWS';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  //inyectar el servicio de http
  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLocaleLowerCase();
    //Validar tag repetido- devuelve un nuevo arreglo sin el tag ya existe
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }
    // insertag el nuevo tag al inicio
    this._tagsHistory.unshift(tag);
    // limitar a 10 busquedas
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    //si no tenemos data no hacemos nada
    if (!localStorage.getItem('history')) return;
    // si tenemos data
    // Agregamos not null operation "!"  para decir siempre va a venir una data
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    //validamos que no este vacio
    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', 10)
      .set('q', tag);

    //Observable - Es un objeto en el cual a lo largo del tiempo, puede estar emitiendo diferentes valores
    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
        console.info({ gifs: this.gifList });
      });
  }
}
