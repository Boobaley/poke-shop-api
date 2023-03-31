import { Injectable } from "@nestjs/common";
import { forkJoin, Observable } from "rxjs";
import { mergeMap, scan } from "rxjs/operators";
import { AxiosResponse } from "axios";
import { HttpService } from "@nestjs/axios";

import { IPokemonListItem } from "./interfaces/pokemon-list-item.interface";
import { IPokemonDetails } from "./interfaces/pokemon-details.interface";

@Injectable()
export class PokemonService {
  constructor(private readonly httpService: HttpService) {}

  getPokemonList(paginationConfig): Observable<AxiosResponse[]> {
    const { page, limit } = paginationConfig;

    return this.httpService
      .get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${page}`)
      .pipe(
        mergeMap((response: AxiosResponse) =>
          forkJoin(
            response.data.results.map(item => this.httpService.get(item.url))
          ).pipe(
            mergeMap((responses: Array<AxiosResponse>) => {
              return responses.map(response => response.data);
            })
          )
        ),
        scan((result, pokemon: any) => {
          const pokemonToInsert: IPokemonListItem = {
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.front_default,
            price: pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
          };

          result.push(pokemonToInsert);

          return result;
        }, [])
      );
  }

  async getPokemonById(id: number): Promise<IPokemonDetails> {
    try {
      const foundPokemon = await this.httpService
        .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .toPromise()
        .then(response => response.data);

      const abilitiesDetailsRequest = foundPokemon.abilities.map(abilityItem =>
        this.httpService.get(abilityItem.ability.url).toPromise()
      );

      const abilitiesDetailsResponses = await Promise.all(
        abilitiesDetailsRequest
      ).then((response: any) => response.map(res => res.data));

      const appropriateAbilitiesData = abilitiesDetailsResponses.map(
        abilityItem => ({
          title: abilityItem.name,
          description: abilityItem.effect_entries.find(
            effect => effect.language.name === "en"
          ).effect
        })
      );

      const appropriateStatsData = foundPokemon.stats.map(statItem => ({
        title: statItem.stat.name,
        value: statItem.base_stat
      }));

      return {
        id: foundPokemon.id,
        name: foundPokemon.name,
        image: foundPokemon.sprites.front_default,
        abilities: appropriateAbilitiesData,
        stats: appropriateStatsData,
        price: foundPokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
      };
    } catch (error) {
      console.log(error);
    }
  }
}
