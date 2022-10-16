import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Paginate } from '../helpers/decorators/pagination.decorator';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { IPokemonDetails } from './interfaces/pokemon-details.interface';

@ApiBearerAuth()
@ApiTags('products')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @Get('/')
  getAllProducts(@Paginate() pagination): Observable<AxiosResponse[]> {
    return this.pokemonService.getPokemonList(pagination);
  }

  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  getProductById(@Param('id') id: number): Promise<IPokemonDetails> {
    return this.pokemonService.getPokemonById(id);
  }
}
